---
title: "PostgreSQL en producción: lo que aprendí de los errores"
description: "Índices que olvidé crear, queries que reventé en producción, y las herramientas que ahora uso siempre antes de hacer deploy."
pubDate: 2026-04-08
tags: ["PostgreSQL", "Backend", "Performance"]
readTime: 9
---

En tres años usando PostgreSQL en producción cometí casi todos los errores posibles. Este post es la lista que me hubiera ahorrado noches de guardia.

## El error que más duele: olvidar el índice en foreign keys

PostgreSQL **no crea índices automáticos en foreign keys**. Sí los crea en primary keys y unique constraints, pero no en FKs.

```sql
-- Esta tabla en producción con 10M filas y sin índice en user_id
-- va a hacer un sequential scan en cada JOIN
CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),  -- ← sin índice automático
  amount  DECIMAL,
  ...
);

-- Agregar el índice que olvidaste
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
```

`CONCURRENTLY` es clave: crea el índice sin bloquear escrituras. Sin eso, bloqueas la tabla y tumba la app.

## EXPLAIN ANALYZE antes de cada query nueva

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;
```

Lo que busco en la salida:

- `Seq Scan` en tablas grandes → necesito índice
- `Rows=10000` pero `actual rows=3` → estadísticas desactualizadas, corro `ANALYZE`
- `Buffers: shared hit=0 read=50000` → todo viene del disco, no del cache

## Transacciones explícitas en operaciones críticas

```ts
// ❌ Sin transacción: si falla el segundo insert, el primero quedó
await db.query('INSERT INTO payments ...');
await db.query('UPDATE accounts SET balance = balance - $1', [amount]);

// ✅ Con transacción
await db.query('BEGIN');
try {
  await db.query('INSERT INTO payments ...');
  await db.query('UPDATE accounts SET balance = balance - $1', [amount]);
  await db.query('COMMIT');
} catch (e) {
  await db.query('ROLLBACK');
  throw e;
}
```

En Node.js con `pg`, si usas un pool, la transacción tiene que vivir en la misma conexión. Saco una con `pool.connect()`.

## Migraciones: nunca DROP en el mismo deploy que el código nuevo

El orden que uso:

1. **Deploy migración aditiva** (add column, add index, add table)
2. **Deploy código nuevo** que usa la columna nueva
3. **Deploy migración destructiva** (drop column viejo) — días o semanas después

Si hago drop y deploy al mismo tiempo, hay un momento donde el servidor viejo (todavía en ejecución) busca la columna que ya no existe.

## Connection pooling: no abrir una conexión por request

```ts
// ❌ Una conexión nueva por request — se acaban rápido
app.get('/users', async (req, res) => {
  const client = new Client(config);
  await client.connect();
  // ...
  await client.end();
});

// ✅ Pool compartido, instanciado una vez
const pool = new Pool({ max: 20, ...config });

app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  // ...
});
```

PostgreSQL tiene un límite de conexiones (`max_connections`, por defecto 100). Con serverless o pods que escalan, uso PgBouncer delante.

## Partial indexes: pequeños pero poderosos

Si filtras constantemente por un subset de datos:

```sql
-- En vez de indexar toda la columna status
CREATE INDEX idx_orders_pending
  ON orders(created_at)
  WHERE status = 'pending';
```

El índice es mucho más pequeño y las queries con `WHERE status = 'pending'` lo usan automáticamente.

## Herramientas que uso siempre

- **pganalyze** (o su versión gratuita `pganalyze collector`) — detecta índices faltantes analizando el `pg_stat_statements`
- **pgbadger** — parsea los logs de PostgreSQL y genera un reporte de queries lentas
- **`pg_stat_statements`** — extensión nativa, actívala y ya tienes visibilidad de las queries más costosas

```sql
-- Ver las 10 queries más lentas
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Resumen rápido

| Cosa | Qué hacer |
|---|---|
| Foreign keys | Siempre agregar índice manual |
| Query nueva | `EXPLAIN ANALYZE` antes de deploy |
| Índice en prod | `CREATE INDEX CONCURRENTLY` |
| Migraciones destructivas | Deploy separado, después del código |
| Conexiones | Pool compartido, nunca por request |

La mayoría de los problemas de performance en PostgreSQL no son del motor — son del código que lo usa.

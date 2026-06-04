---
title: "Mi setup de CI/CD con GitHub Actions para proyectos Node.js"
description: "El workflow que uso en todos mis proyectos: tests, lint, build, deploy a Railway con zero-downtime y rollback automático en menos de 3 minutos."
pubDate: 2026-03-15
tags: ["DevOps", "GitHub Actions", "Node.js"]
readTime: 6
---

Durante mucho tiempo deployé con `git push` directo al servidor y rezando. Hoy tengo un pipeline que tarda menos de 3 minutos y hace rollback automático si algo falla.

## El workflow completo

```yaml
# .github/workflows/ci.yml
name: CI / Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: app_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/app_test

  deploy:
    needs: ci
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

## Por qué este orden importa

El job `deploy` tiene `needs: ci`. Si los tests fallan, el deploy no corre. Suena obvio, pero lo he visto ignorado en muchos proyectos.

El `if: github.ref == 'refs/heads/main'` es igual de importante: los PRs corren CI pero no deploy. Sin esto, cada push a cualquier rama deployaría.

## Cache de dependencias

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'         # ← esto es todo lo que necesitas
```

`actions/setup-node` maneja el cache de `node_modules` usando el lockfile como llave. Sin esto, `pnpm install` tarda 40s. Con cache, 3s.

## Tests contra una base de datos real

El `services` block de GitHub Actions levanta un contenedor Docker durante el job. Prefiero esto a mockear la base de datos:

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: test
      POSTGRES_DB: app_test
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
```

Los `options` con `health-cmd` son críticos: sin ellos, el contenedor aparece como "running" antes de estar listo para recibir conexiones y los primeros tests fallan al azar.

## Variables de entorno y secretos

Las variables que cambian por ambiente van en los Settings del repo → Secrets and variables:

- `RAILWAY_TOKEN` — nunca en el código
- `DATABASE_URL` — la de producción, solo accesible en el job de deploy

Para variables no-secretas (como la versión de Node, o una URL pública), uso `vars` en vez de `secrets`:

```yaml
- run: echo "Deploying to ${{ vars.RAILWAY_ENV }}"
```

## Notificaciones cuando algo falla

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "❌ Deploy falló en *${{ github.repository }}*\n${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

`if: failure()` corre el step solo si algún step anterior falló. El mensaje incluye el link directo al run.

## Monorepo: correr CI solo cuando cambia el paquete relevante

```yaml
on:
  push:
    paths:
      - 'packages/api/**'
      - '.github/workflows/api-ci.yml'
```

Si el repo tiene `packages/api` y `packages/web`, no necesito correr los tests del API cuando solo cambió el frontend.

## Tiempo total

Con todo esto, mi pipeline típico:

| Step | Tiempo |
|---|---|
| Checkout + setup Node | ~15s |
| pnpm install (cache hit) | ~5s |
| Lint + typecheck | ~20s |
| Tests (con postgres service) | ~45s |
| Deploy a Railway | ~60s |
| **Total** | **~2:30** |

Tres minutos desde push hasta producción con tests reales contra base de datos. Es lo suficientemente rápido para no perder el contexto y lo suficientemente robusto para atrapar los bugs obvios.

---
title: "Cómo estructuro proyectos React a escala"
description: "La estructura de carpetas que uso en proyectos reales: feature folders, barrel exports, separación de concerns y por qué abandoné los atomic folders."
pubDate: 2026-05-20
tags: ["React", "TypeScript", "Arquitectura"]
readTime: 7
---

Después de varios proyectos medianos y un par de aplicaciones con más de 50 pantallas, consolidé una estructura que me permite mover rápido sin acumular deuda técnica. No es perfecta, pero funciona.

## El problema con "atomic design" en la práctica

Separar componentes en `atoms`, `molecules`, `organisms`, `templates` y `pages` suena bien en el papel. En la práctica, el 80% del tiempo lo pierdo decidiendo si algo es un átomo o una molécula.

El verdadero problema: **la organización por tipo en vez de por función**. Cuando cambio la feature de "pagos", tengo que tocar 5 carpetas distintas.

## Feature folders: organizar por dominio

Mi estructura actual:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── index.ts        ← barrel export
│   ├── payments/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── index.ts
│   └── dashboard/
├── shared/
│   ├── components/         ← Button, Input, etc.
│   ├── hooks/              ← useDebounce, useLocalStorage
│   └── utils/
├── pages/                  ← o app/ en Next.js
└── lib/                    ← configuración de librerías (axios, zod schemas globales)
```

La regla: **un feature no puede importar de otro feature directamente**. Si necesitan compartir algo, va a `shared/`.

## Barrel exports: la navaja de doble filo

Cada feature tiene un `index.ts` que exporta solo la API pública:

```ts
// features/payments/index.ts
export { PaymentForm } from './components/PaymentForm';
export { usePayments }  from './hooks/usePayments';
export type { Payment } from './types';
```

El exterior solo ve lo que el feature decide exponer. Esto hace que refactorizar internos sea trivial.

**Cuidado:** los barrel exports en `shared/components` pueden romper el tree-shaking si no configuras bien tu bundler. Prefiero importar directamente ahí.

## Hooks sobre lógica en componentes

Todo lo que no sea JSX sale del componente:

```tsx
// ❌ Mezclado
function UserProfile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  // ...
}

// ✅ Separado
function UserProfile() {
  const { user, isLoading } = useUser();
  // solo presentación
}
```

El beneficio real no es la "limpieza" — es que `useUser` es testeable sin montar ningún componente.

## Separación de la capa de API

Nunca llamo `fetch` directamente desde un hook. Hay una capa intermedia:

```ts
// features/payments/api.ts
export const paymentsApi = {
  list:   () => apiClient.get<Payment[]>('/payments'),
  create: (data: CreatePaymentDTO) => apiClient.post('/payments', data),
};
```

Cuando cambia el backend, toco un solo archivo. Cuando quiero mockear en tests, es trivial.

## Lo que no uso

- **Redux** para todo: Context + `useReducer` para estado global de UI es suficiente en la mayoría de proyectos. Para server state, uso React Query.
- **Archivos de barril en `shared/`**: beneficio marginal, costo en tree-shaking y circular deps.
- **Abstracciones prematuras**: si hay un componente, no un patrón, no creo la abstracción todavía.

## Conclusión

La pregunta que me hago antes de crear una carpeta: *¿si tengo que borrar esta feature, qué archivos toco?* Si la respuesta es "muchos en lugares distintos", la organización está mal.

Feature folders + API layer explícita + hooks para lógica = lo que más me ha funcionado.

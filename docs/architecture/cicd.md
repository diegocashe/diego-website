# Arquitectura CI/CD

## Visión general

Este proyecto usa **Trunk Based Development (TBD)** como estrategia de branching, con un pipeline completamente automatizado que va desde el commit local hasta producción sin intervención manual.

```
┌─────────────────────────────────────────────────────────────────┐
│  LOCAL                                                          │
│                                                                 │
│   git commit  ──►  Husky (commit-msg)  ──►  commitlint         │
│                         │                                       │
│                    ✗ bloquea si el mensaje no es válido         │
│                    ✓ permite el commit y hace push              │
└─────────────────────────────┬───────────────────────────────────┘
                              │ git push origin main
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS                                                 │
│                                                                 │
│   Job: ci                                                       │
│   ├── pnpm install --frozen-lockfile                            │
│   ├── pnpm lint                                                 │
│   └── pnpm typecheck                                            │
│              │                                                  │
│         ✗ falla → notificación Discord (rojo) → pipeline para  │
│         ✓ pasa                                                  │
│              │                                                  │
│   Job: release (needs: ci)                                      │
│   ├── pnpm build                                                │
│   ├── semantic-release                                          │
│   │     ├── analiza commits desde el último tag                 │
│   │     ├── determina el tipo de bump (patch/minor/major)       │
│   │     ├── actualiza package.json + CHANGELOG.md               │
│   │     ├── crea tag vX.Y.Z en GitHub                           │
│   │     └── publica GitHub Release con notas                    │
│   │              │                                              │
│   │         sin cambios relevantes → pipeline termina sin deploy│
│   │         nueva versión publicada                             │
│   │              │                                              │
│   ├── rsync → producción (SSH, puerto 22)                       │
│   └── notificación Discord (verde) con versión y links          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PRODUCCIÓN  (cPanel — 65.181.111.131)                          │
│                                                                 │
│   /home/diegocas/public_html/                                   │
│   └── contenido sincronizado desde dist/                        │
│       (archivos obsoletos eliminados con --delete)              │
│       (preserva .htaccess y .well-known/)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes y su rol

| Componente | Herramienta | Responsabilidad |
|---|---|---|
| Hook local | Husky v9 | Intercepta `git commit` y valida el mensaje |
| Validación de mensajes | commitlint | Rechaza commits que no sigan Conventional Commits |
| CI | GitHub Actions | Lint, typecheck — gate de calidad |
| Versionado | semantic-release | Calcula versión, genera changelog, publica release |
| Build | Astro v6 | Compila a archivos estáticos en `dist/` |
| Transferencia | rsync sobre SSH | Sincroniza `dist/` con el servidor de producción |
| Notificaciones | Discord Webhook | Informa del resultado del pipeline en tiempo real |

## Reglas de versionado semántico

El tipo de bump lo determina el prefijo del commit:

| Prefijo | Tipo de cambio | Ejemplo de bump |
|---|---|---|
| `fix:` | Parche — bug fix | `1.2.3` → `1.2.4` |
| `feat:` | Minor — nueva funcionalidad | `1.2.3` → `1.3.0` |
| `feat!:` o `BREAKING CHANGE:` | Major — cambio incompatible | `1.2.3` → `2.0.0` |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:` | Sin release | versión sin cambios |

## Secretos requeridos en GitHub

Ir a **Settings → Secrets and variables → Actions** y verificar que estén configurados:

| Secret | Descripción |
|---|---|
| `SSH_HOST` | IP del servidor de producción |
| `SSH_USER` | Usuario de cPanel |
| `SSH_PRIVATE_KEY` | Llave privada RSA completa (con cabecera y pie) |
| `DISCORD_WEBHOOK_URL` | URL del webhook del canal de Discord |

`GITHUB_TOKEN` es provisto automáticamente por GitHub Actions — no requiere configuración manual.

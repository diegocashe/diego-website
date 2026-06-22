# Pipeline — GitHub Actions

Archivo de referencia: `.github/workflows/deploy.yml`

## Trigger

```yaml
on:
  push:
    branches:
      - main
```

El pipeline se dispara **únicamente** en push a `main`. Ramas de feature no generan ningún job en CI remoto — la validación en ramas locales la hace Husky.

---

## Job 1 — `ci`

**Propósito:** Gate de calidad. Si falla, el job `release` nunca corre.

| Step | Comando | Qué valida |
|---|---|---|
| Install | `pnpm install --frozen-lockfile` | Reproducibilidad exacta del lockfile |
| Lint | `pnpm lint` | Errores de ESLint (astro, a11y, typescript) |
| Typecheck | `pnpm typecheck` | Errores de tipos de TypeScript sin emitir archivos |

`--frozen-lockfile` hace que pnpm falle si `pnpm-lock.yaml` está desactualizado respecto a `package.json`, evitando instalaciones silenciosas con versiones distintas a las del lockfile.

---

## Job 2 — `release`

**Propósito:** Versionar, buildear, deployar y notificar. Depende de `ci` con `needs: ci`.

### Permisos requeridos

```yaml
permissions:
  contents: write      # crear tags y releases
  issues: write        # comentar issues cerrados por commits
  pull-requests: write # comentar PRs relacionados
```

### `fetch-depth: 0`

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

Indispensable para `semantic-release`. Sin `fetch-depth: 0` el checkout trae solo el último commit, y semantic-release no puede comparar contra el tag anterior para calcular la versión.

### Step — Release

```yaml
- name: Release
  id: semantic
  run: pnpm exec semantic-release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Genera los outputs:
- `steps.semantic.outputs.new_release_published` → `'true'` o `'false'`
- `steps.semantic.outputs.new_release_version` → ej. `1.3.0`

### Step — Deploy

```yaml
if: steps.semantic.outputs.new_release_published == 'true'
```

El deploy **solo ocurre** si semantic-release publicó una versión nueva. Un push con solo `chore:` o `docs:` no activa el deploy.

### Flags de rsync

```
-avzr --delete --exclude='.htaccess' --exclude='.well-known/'
```

| Flag | Efecto |
|---|---|
| `-a` | Modo archive: preserva permisos, timestamps, symlinks |
| `-v` | Verbose: muestra archivos transferidos en los logs |
| `-z` | Compresión durante la transferencia |
| `-r` | Recursivo |
| `--delete` | Elimina del servidor archivos que ya no existen en `dist/` |
| `--exclude='.htaccess'` | Preserva reglas de Apache del servidor |
| `--exclude='.well-known/'` | Preserva certificados SSL (Let's Encrypt) |

### Notificaciones Discord

Hay dos steps mutuamente excluyentes:

| Step | Condición | Color embed |
|---|---|---|
| Notify exitoso | `new_release_published == 'true' && success()` | Verde `#2ecc71` |
| Notify fallo | `failure()` | Rojo `#e74c3c` |

`failure()` captura fallos en cualquier step anterior del job, incluyendo lint, typecheck, build y deploy.

---

## Tiempos estimados por job

| Job | Tiempo típico |
|---|---|
| `ci` | ~1-2 min |
| `release` (sin nueva versión) | ~1-2 min |
| `release` (con deploy) | ~3-5 min |

---

## Qué no hace este pipeline

- No corre tests unitarios (el proyecto no los tiene actualmente).
- No hace rollback automático si el deploy falla en producción.
- No bloquea deploys concurrentes (poco relevante siendo un solo desarrollador).

# Flujo de desarrollo

Guía completa de qué hacer y qué evitar en cada etapa del ciclo de desarrollo.

---

## Setup inicial (solo la primera vez en una máquina nueva)

Husky necesita saber dónde está `node` antes de correr cualquier hook. Crear este archivo una sola vez:

```bash
mkdir -p ~/.config/husky
cat > ~/.config/husky/init.sh << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
EOF
```

Este archivo **no se commitea** — es configuración local de la máquina. Husky v9 lo carga automáticamente antes de ejecutar cualquier hook. Sin él, los commits serán bloqueados con `node: command not found`.

Luego activar Husky en el repo:

```bash
pnpm install
pnpm prepare
```

---

## Antes de empezar a trabajar

**Siempre** sincronizar `main` antes de comenzar cualquier cambio:

```bash
git pull origin main
pnpm install
```

Si no se hace esto y el `pnpm-lock.yaml` remoto cambió (por un bump de semantic-release), el CI fallará con `frozen-lockfile`.

---

## Durante el desarrollo

### Ramas de feature (opcionales pero recomendadas para cambios grandes)

Para cambios pequeños se puede trabajar directamente en `main`. Para cambios que toman más de un día o que son experimentales, crear una rama corta:

```bash
git checkout -b feat/nombre-descriptivo
```

**Reglas para ramas:**

| Permitido | No permitido |
|---|---|
| `feat/nueva-seccion-blog` | `mi-rama` |
| `fix/navbar-mobile` | `wip` |
| `chore/actualizar-deps` | `cambios` |
| `refactor/componente-hero` | `arreglos-varios` |

Las ramas de feature **nunca** se deployean directamente — solo `main` dispara el pipeline.

### Mientras codeas

- Correr `pnpm dev` para el servidor local con hot reload.
- Correr `pnpm typecheck` y `pnpm lint` antes de commitear para detectar errores antes de que lo haga el CI.
- No commitear archivos generados (`dist/`, `.astro/`). Verificar que estén en `.gitignore`.

---

## Al hacer un commit

### Checklist antes de `git commit`

- [ ] El código compila sin errores (`pnpm build` o al menos `pnpm typecheck`)
- [ ] No hay errores de lint (`pnpm lint`)
- [ ] El mensaje de commit sigue Conventional Commits (ver [commits.md](./commits.md))
- [ ] No se incluyen archivos sensibles (`.env`, llaves, credenciales)

### Lo que ocurre automáticamente

1. Husky intercepta el commit.
2. commitlint valida el mensaje.
3. Si el mensaje es inválido → commit bloqueado, se muestra el error.
4. Si el mensaje es válido → commit creado localmente.

### Lo que NO se debe hacer

```bash
# Nunca saltarse Husky
git commit --no-verify -m "wip"

# Nunca commitear directamente archivos de build
git add dist/

# Nunca usar mensajes vagos aunque pasen commitlint
git commit -m "chore: cambios"   # pasa Husky pero no aporta información
```

---

## Al hacer push a main

### Lo que ocurre automáticamente

```
push a main
   │
   ├─► Job CI: lint + typecheck
   │       │
   │   ✗ falla → notificación Discord roja → pipeline para
   │   ✓ pasa
   │       │
   └─► Job release:
           ├─ build
           ├─ semantic-release analiza commits desde el último tag
           │       │
           │   sin feat/fix/perf → no hay release, no hay deploy
           │   con feat/fix/perf → bump de versión + tag + GitHub Release
           │                            │
           │                        rsync a producción
           │                            │
           └──────────────────── notificación Discord verde
```

### Qué revisar después del push

1. Ir a **GitHub → Actions** y confirmar que el pipeline está corriendo.
2. Si hay error en CI, corregirlo y hacer otro push — no forzar con `--force`.
3. Si semantic-release publicó nueva versión, verificar en **GitHub → Releases** que el changelog es correcto.
4. Revisar Discord para confirmar la notificación de deploy.

### Lo que NO se debe hacer

```bash
# Nunca forzar push a main
git push origin main --force

# Nunca hacer push de ramas de feature directamente a producción
# El deploy solo lo dispara main — esto es intencional

# Nunca reescribir historial de main (rebase interactivo, amend de commits publicados)
git rebase -i HEAD~3   # en main, después de haber hecho push
```

---

## Durante el deploy (automático)

No se requiere ninguna acción manual. El deploy ocurre por rsync y puede tomar entre 1 y 5 minutos.

**Si el deploy falla:**

1. Revisar los logs en GitHub Actions (el link llega directo al Discord en la notificación roja).
2. El servidor de producción quedará con la versión anterior — rsync no hace deploy parcial si el job falla antes de terminar la sincronización.
3. Corregir el problema, commitear con el tipo correcto y hacer push nuevamente.

**Lo que NO se debe hacer durante un deploy activo:**

- No modificar archivos manualmente en el servidor vía FTP o cPanel mientras el rsync está corriendo. El flag `--delete` puede eliminar archivos que se estén subiendo manualmente.

---

## Después del deploy

- Verificar el sitio en producción manualmente.
- Confirmar que el tag `vX.Y.Z` aparece en GitHub → Releases con el changelog correcto.
- Si se detecta un bug en producción post-deploy, commitear un `fix:` en `main` — esto genera automáticamente un patch release y un nuevo deploy.

### Rollback manual (si es necesario)

El pipeline no tiene rollback automático. Si se necesita revertir:

```bash
# Opción 1 — revert commit (genera un nuevo release patch)
git revert HEAD
git push origin main

# Opción 2 — forzar el estado de un tag anterior vía rsync manual
# (solo si la opción 1 no es viable por urgencia)
git checkout vX.Y.Z
pnpm install && pnpm build
# rsync manual desde local a producción
```

La opción 1 es la preferida porque mantiene el historial limpio y genera un registro del rollback en el changelog.

---

## Resumen de prohibiciones absolutas

| Acción | Razón |
|---|---|
| `git commit --no-verify` | Rompe el versionado semántico al dejar commits sin tipo |
| `git push --force` en `main` | Destruye el historial que semantic-release usa para calcular versiones |
| Modificar manualmente `package.json version` | semantic-release gestiona eso — editarlo manualmente desincroniza el versionado |
| Subir archivos a producción por FTP durante un deploy activo | rsync con `--delete` puede eliminarlos |
| Commitear `.env` o llaves privadas | Seguridad — usar siempre GitHub Secrets para credenciales |

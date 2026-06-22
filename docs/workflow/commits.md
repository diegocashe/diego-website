# Guía de Conventional Commits

Todo commit en este proyecto debe seguir el estándar **Conventional Commits**. Husky bloquea en el momento de hacer `git commit` cualquier mensaje que no cumpla el formato.

## Formato

```
<tipo>(<scope opcional>): <descripción en imperativo, minúsculas>

[cuerpo opcional]

[footer opcional — BREAKING CHANGE: descripción]
```

## Tipos permitidos

| Tipo | Cuándo usarlo | ¿Genera release? |
|---|---|---|
| `feat` | Nueva funcionalidad visible para el usuario | Sí — minor |
| `fix` | Corrección de un bug | Sí — patch |
| `perf` | Mejora de rendimiento | Sí — patch |
| `feat!` / `BREAKING CHANGE` | Cambio que rompe compatibilidad | Sí — major |
| `refactor` | Reestructuración interna sin cambio de comportamiento | No |
| `style` | Cambios de formato, espaciado, punto y coma | No |
| `docs` | Cambios solo en documentación | No |
| `chore` | Tareas de mantenimiento, config, dependencias | No |
| `ci` | Cambios en el pipeline de GitHub Actions | No |
| `test` | Agregar o modificar tests | No |
| `build` | Cambios que afectan el sistema de build | No |
| `revert` | Revertir un commit anterior | Depende |

## Ejemplos válidos

```bash
# Patch — fix
git commit -m "fix: corregir desbordamiento del navbar en mobile"

# Minor — feat
git commit -m "feat: agregar sección de testimonios en landing"

# Sin release — chore
git commit -m "chore: actualizar dependencias de devDependencies"

# Sin release — docs
git commit -m "docs: actualizar guía de commits"

# Sin release — ci
git commit -m "ci: agregar step de notificación a Discord"

# Con scope (opcional pero recomendado)
git commit -m "feat(blog): agregar paginación en listado de posts"
git commit -m "fix(navbar): resolver parpadeo en scroll hacia arriba"

# Major — breaking change
git commit -m "feat!: migrar sistema de rutas a nueva estructura"

# Major — con footer
git commit -m "refactor: cambiar API de componentes

BREAKING CHANGE: los componentes ya no aceptan la prop 'color',
usar 'variant' en su lugar."
```

## Ejemplos inválidos (Husky los bloquea)

```bash
# Sin tipo
git commit -m "arreglé el bug del menú"

# Tipo con mayúscula
git commit -m "Fix: corregir margen"

# Descripción con mayúscula inicial
git commit -m "fix: Corregir margen"

# Mensaje vacío
git commit -m ""

# Tipo no reconocido
git commit -m "update: cambios varios"
git commit -m "wip: trabajo en progreso"
```

## Reglas de la descripción

- Imperativo presente: `agregar`, `corregir`, `eliminar` — no `agregué`, `agrega`, `se agrega`
- Minúsculas: nunca capitalizar la primera letra
- Sin punto final
- Máximo 72 caracteres en la primera línea
- En español o inglés, pero consistente en todo el proyecto

## Si Husky bloquea tu commit

El error se ve así:

```
⧗   input: arreglé el menú
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
```

Corrige el mensaje y vuelve a intentarlo:

```bash
git commit -m "fix: corregir comportamiento del menú en mobile"
```

No uses `--no-verify` para saltarte Husky. Eso rompe el versionado automático.

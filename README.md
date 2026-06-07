# diego castillo — personal website

Personal portfolio, blog, CV, and design system built with Astro 6.

## Requirements

- Node.js ≥ 22.12.0
- pnpm

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `pnpm install`    | Install dependencies                        |
| `pnpm dev`        | Start dev server at `localhost:4321`        |
| `pnpm build`      | Build production site to `./dist/`          |
| `pnpm preview`    | Preview production build locally            |
| `pnpm lint`       | Run ESLint                                  |
| `pnpm lint:fix`   | Run ESLint with auto-fix                    |
| `pnpm typecheck`  | Run `tsc --noEmit`                          |

## Project structure

```
src/
├── components/
│   ├── blog/          # PostCard
│   ├── cv/            # TimelineItem, SkillGroup, PublicationCard
│   ├── ds/            # Design system — atoms + section showcases
│   │   ├── atoms/     # Button, BadgePill, Alert, Typography, …
│   │   └── sections/  # Section showcases for /design-system page
│   ├── landing/       # HeroSection, ProjectsSection, StatsSection, …
│   ├── projects/      # ProjectCard
│   └── shared/        # SEOImage, PageHero
├── content/
│   └── blog/          # Markdown blog posts (Zod-validated schema)
├── data/
│   ├── cv.ts          # CV content (experience, education, skills)
│   ├── projects.ts    # Projects list
│   └── site.ts        # Site-wide metadata
├── layouts/
│   ├── BaseLayout.astro     # Head, CSP nonce, global styles
│   ├── BlogPostLayout.astro # Blog post wrapper
│   └── Layout.astro         # Page shell
├── lib/
│   └── sanitize.ts    # Input sanitisation, URL validation, cookie/JWT helpers
├── pages/
│   ├── index.astro        # Landing
│   ├── projects.astro     # Projects grid + filter
│   ├── cv.astro           # CV / résumé
│   ├── design-system.astro
│   └── blog/
│       ├── index.astro
│       └── [...slug].astro
├── styles/
│   └── global.css     # Design tokens, base styles
├── middleware.ts      # CSP nonce generation, checkOrigin
├── content.config.ts  # Zod schema for blog collection
└── env.d.ts           # App.Locals (nonce), ImportMeta augmentation
```

## Dependencies

| Package | Purpose |
| :------ | :------ |
| `astro` | Framework |
| `gsap` | Animation |
| `zod` | Blog content schema validation |

### Dev dependencies

| Package | Purpose |
| :------ | :------ |
| `@astrojs/check` | Astro type checking (`astro check`) |
| `@astrojs/ts-plugin` | Enables `.astro` imports in `.ts` files |
| `@typescript-eslint/parser` | TS parser for ESLint |
| `eslint` | Linter |
| `eslint-plugin-astro` | Astro rules + jsx-a11y wired through Astro parser |
| `eslint-plugin-jsx-a11y` | Accessibility rules (peer dep of eslint-plugin-astro) |
| `typescript` | Type checker |
| `typescript-eslint` | TS-aware ESLint rules |

## TypeScript configuration

Extends `astro/tsconfigs/strict` with:

- `exactOptionalPropertyTypes` — no accidental `undefined` on optional props
- `noUncheckedIndexedAccess` — array/object index access returns `T | undefined`
- `noUnusedLocals` / `noUnusedParameters` — dead code errors
- `verbatimModuleSyntax` — enforces `import type` for type-only imports

## ESLint configuration

- `tseslint.configs.strictTypeChecked` scoped to `.ts` files only — the Astro parser cannot provide full type information to typescript-eslint, so type-checked rules would produce false positives on `.astro` frontmatter
- `eslint-plugin-astro` recommended rules on all files
- `eslint-plugin-jsx-a11y` strict rules on `.astro` files (via Astro's `jsx-a11y-strict` config)

## Security

- CSP delivered via `public/_headers` (static) or `src/middleware.ts` (SSR) — not via Astro's `security.csp` which is incompatible with `<ClientRouter />`
- `checkOrigin: true` in `astro.config.mjs` — CSRF protection on mutating requests
- Image optimiser locked to empty `domains` / `remotePatterns` — prevents SSRF
- Per-request CSP nonce generated in middleware, exposed as `Astro.locals.nonce`

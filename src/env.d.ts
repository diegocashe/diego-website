/// <reference path="../.astro/types.d.ts" />

/**
 * Type augmentations for Astro's runtime environment.
 *
 * App.Locals — values set in src/middleware.ts and available as
 *   Astro.locals inside .astro components and API routes.
 *
 * ImportMetaEnv — documents every PUBLIC_* and private env variable
 *   so TypeScript catches typos at build time, not at runtime.
 */

declare namespace App {
  interface Locals {
    /**
     * Cryptographic nonce injected per-request by middleware.
     * Used in <script nonce={nonce}> and CSP nonce-{value} directives.
     * Only available on SSR routes; empty string on statically prerendered pages.
     */
    nonce: string;
  }
}

interface ImportMetaEnv {
  // ── PUBLIC variables — bundled into client JavaScript ────────────────
  // SAFE to read in .astro frontmatter AND in client components.
  // Never put secrets here. Anything PUBLIC_* is visible to end users.

  /** Canonical site URL used for OG tags and sitemaps */
  readonly PUBLIC_SITE_URL: string;

  /** Analytics measurement ID (safe to expose — it is a public ID) */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;

  // ── PRIVATE variables — server-side only ─────────────────────────────
  // These are accessible in .astro frontmatter and API endpoints.
  // They are NEVER included in client bundles.
  // Do NOT prefix these with PUBLIC_. Do NOT read them inside <script> tags
  // or inside any component rendered with client:* directive.

  /** Example: CMS API secret key — server routes only */
  readonly CMS_API_SECRET?: string;

  /** Example: Database connection string */
  readonly DATABASE_URL?: string;

  /** Example: Email service API key */
  readonly RESEND_API_KEY?: string;

  /** Node environment */
  readonly NODE_ENV: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

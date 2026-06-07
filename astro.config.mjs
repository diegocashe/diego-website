// @ts-check
import { defineConfig } from 'astro/config';

/**
 * SECURITY ARCHITECTURE — astro.config.mjs
 * ──────────────────────────────────────────────────────────────────────────
 *
 * WHY we do NOT use Astro's `security.csp` here:
 *
 * Astro v6's `security.csp` injects a <meta http-equiv="content-security-policy">
 * tag. We deliberately avoid it for two reasons:
 *
 *   1. <ClientRouter /> (ViewTransitions) is explicitly incompatible with
 *      `security.csp` — enabling both breaks client-side navigation.
 *   2. HTTP header CSP is strictly stronger than <meta> CSP:
 *      - Headers apply before any HTML is parsed (no race window)
 *      - Headers cannot be altered by injected content in the page
 *
 * CSP is delivered via:
 *   Static deployment  → public/_headers  (Cloudflare Pages / Netlify)
 *   SSR deployment     → src/middleware.ts (sets Content-Security-Policy header)
 *
 * CHECKORIGIN:
 *   Validates Origin === Host on mutating requests (POST/PUT/PATCH/DELETE) for
 *   SSR pages. Provides CSRF protection on server routes / form actions.
 *   Defaults to true in Astro v6; we make it explicit.
 */
export default defineConfig({
  security: {
    checkOrigin: true,
  },

  image: {
    // Prevent SSRF through the image optimiser endpoint (relevant when SSR is added).
    // Only list domains you control or explicitly trust.
    domains: [],
    remotePatterns: [],
  },
});

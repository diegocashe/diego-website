/**
 * src/lib/env.ts
 *
 * Type-safe, fail-fast environment variable access.
 *
 * WHY this module exists instead of reading import.meta.env directly:
 *
 *   1. Centralises the PUBLIC vs. PRIVATE boundary. Any variable accessed
 *      through `privateEnv` will throw a build error if accidentally
 *      imported inside a client-side bundle (because server-only modules
 *      are tree-shaken away, but the import itself will crash Vite's
 *      bundler when it tries to process the server-only code in a browser
 *      context).
 *
 *   2. Fails loudly at startup if a required secret is missing, instead of
 *      silently serving 500 errors at runtime hours later.
 *
 *   3. Documents every variable in one place — easier to audit during a
 *      security review.
 *
 * RULE: Never call import.meta.env.SOME_SECRET anywhere else in the codebase.
 *       Always import from this module.
 */

// ── Guard: this module must never be imported in browser context ──────────
// The check is a no-op in SSR/build — it only matters as a code-review signal.
if (typeof window !== 'undefined') {
  throw new Error(
    '[env.ts] This module contains server-only environment variables. ' +
    'Do not import it inside client:* islands or <script> tags.'
  );
}

// ── Private (server-only) variables ──────────────────────────────────────

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `[env.ts] Required environment variable "${key}" is missing or empty. ` +
      `Add it to your .env file (local) or deployment secrets (production).`
    );
  }
  return value;
}

function optionalEnv(key: string): string | undefined {
  return import.meta.env[key] as string | undefined;
}

/**
 * Private server-side environment variables.
 * These are validated at first import — the process crashes early if any
 * required variable is absent, not on the first user request that triggers
 * the code path that needs them.
 */
export const privateEnv = {
  // Add required secrets here and call requireEnv():
  // cmsApiSecret: requireEnv('CMS_API_SECRET'),
  // databaseUrl:  requireEnv('DATABASE_URL'),

  // Optional secrets — returns undefined if not set:
  resendApiKey:  optionalEnv('RESEND_API_KEY'),
  nodeEnv:       (import.meta.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test',
} as const;

// ── Public variables (safe to read in any context) ────────────────────────
// These are prefixed PUBLIC_ in .env and are included in the client bundle.
// No secrets here — treat them as fully public data.

export const publicEnv = {
  siteUrl:           import.meta.env.PUBLIC_SITE_URL ?? 'https://diegocastillo.dev',
  gaMeasurementId:   import.meta.env.PUBLIC_GA_MEASUREMENT_ID,
} as const;

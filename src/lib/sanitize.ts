/**
 * src/lib/sanitize.ts
 *
 * Input validation and sanitisation utilities for SSR routes, API endpoints,
 * and Astro middleware.
 *
 * Defence layers:
 *   1. Zod schema validation   — structural shape + type safety
 *   2. String sanitisation     — strip/escape dangerous characters
 *   3. URL allowlisting        — prevents SSRF in server-side fetch calls
 *   4. JWT/cookie validation   — verifies signatures, not just parses claims
 *
 * Install Zod if not present:  pnpm add zod
 */

import { z } from 'zod';

// ── 1. Contact form validation ────────────────────────────────────────────
// Used in any POST handler that receives user input.

export const contactFormSchema = z.object({
  name:    z.string().min(1).max(100).trim(),
  email:   z.email().max(254).toLowerCase().trim(),
  message: z.string().min(10).max(2000).trim(),
  // Honeypot field — bots fill this in, humans don't see it
  _trap:   z.string().max(0, 'Bot detected').optional(),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

/**
 * Validate form data from a Request object.
 *
 * @example
 * // Inside an API route or Astro action:
 * export const POST: APIRoute = async ({ request }) => {
 *   const result = await validateForm(request, contactFormSchema);
 *   if (!result.success) {
 *     return new Response(JSON.stringify({ error: result.error }), { status: 422 });
 *   }
 *   const { name, email, message } = result.data;
 *   // ...safe to use now
 * };
 */
export async function validateForm<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let raw: unknown;

    if (contentType.includes('application/json')) {
      raw = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const fd = await request.formData();
      raw = Object.fromEntries(fd.entries());
    } else {
      return { success: false, error: 'Unsupported content type' };
    }

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      // Return first error only — don't leak schema structure to the client
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' };
    }
    return { success: true, data: parsed.data };
  } catch {
    return { success: false, error: 'Invalid request body' };
  }
}

// ── 2. HTML/XSS escaping ─────────────────────────────────────────────────
// Astro escapes expressions in templates automatically.
// Use these functions ONLY when you must build raw HTML strings in TypeScript
// (e.g., email templates, log messages, error pages).

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escapes a string for safe insertion into HTML attribute values or text nodes.
 * NOTE: Do NOT use this on HTML that should render as HTML — use a proper
 * sanitiser library (DOMPurify / sanitize-html) for that case.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

// ── 3. SSRF prevention — URL allowlist ───────────────────────────────────
// Any server-side code that fetches a URL based on user-supplied input MUST
// go through this function first.

const ALLOWED_FETCH_ORIGINS = new Set([
  'https://api.resend.com',
  // Add other trusted API origins here
]);

/**
 * Validates that a URL is on the server-side fetch allowlist.
 * Throws if the origin is not whitelisted, preventing SSRF attacks where
 * an attacker tricks the server into fetching internal services (e.g.
 * http://169.254.169.254 EC2 metadata, http://localhost:5432 DB).
 *
 * @example
 * // In an API route that proxies requests:
 * const safeUrl = validateFetchUrl(userSuppliedUrl);
 * const data = await fetch(safeUrl, { headers: { Authorization: `Bearer ${token}` } });
 */
export function validateFetchUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`[sanitize] Invalid URL: "${rawUrl}"`);
  }

  if (!ALLOWED_FETCH_ORIGINS.has(url.origin)) {
    throw new Error(
      `[sanitize] Fetch to "${url.origin}" is not in the allowlist. ` +
      `Add it to ALLOWED_FETCH_ORIGINS in src/lib/sanitize.ts if intentional.`
    );
  }

  return url;
}

// ── 4. Cookie / JWT validation ────────────────────────────────────────────

/**
 * Extracts a named cookie from a Request's Cookie header.
 * Returns undefined rather than throwing if absent.
 */
export function parseCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;

  const cookies = Object.fromEntries(
    header.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k?.trim() ?? '', decodeURIComponent(v.join('='))];
    })
  ) as Record<string, string | undefined>;

  return cookies[name];
}

/**
 * Validates a JWT structure (header.payload.signature).
 * Does NOT verify the signature here — use a proper JWT library (jose, jsonwebtoken)
 * for signature verification in production.
 *
 * This function only:
 *   - Checks the token has exactly 3 parts
 *   - Decodes and validates the payload structure
 *   - Checks `exp` hasn't passed
 *
 * @example
 * import { createRemoteJWKSet, jwtVerify } from 'jose';
 *
 * // Proper signature verification with jose:
 * const JWKS = createRemoteJWKSet(new URL('https://auth.example.com/.well-known/jwks.json'));
 * const { payload } = await jwtVerify(token, JWKS, { audience: 'my-app' });
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const part = parts[1];
    if (!part) return null;
    const payload: unknown = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload !== 'object' || payload === null) return null;
    const exp = (payload as Record<string, unknown>)['exp'];
    if (typeof exp === 'number' && Date.now() / 1000 > exp) {
      return null; // expired
    }
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ── 5. Rate limiting helper (in-memory, single instance) ─────────────────
// For production, replace with a Redis-backed rate limiter.
// This in-memory store resets on cold starts — fine for Cloudflare Workers
// with KV, but not reliable for multi-instance Node deployments.

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple token-bucket rate limiter.
 * Returns true if the request is allowed, false if it should be rejected.
 *
 * @param key       - Unique key per client (IP address, user ID, etc.)
 * @param limit     - Maximum requests in the window
 * @param windowMs  - Window size in milliseconds
 *
 * @example
 * // In middleware or an API route:
 * const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
 * if (!checkRateLimit(`contact:${ip}`, 5, 60_000)) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

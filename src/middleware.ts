/**
 * src/middleware.ts
 *
 * Runs on EVERY SSR request (when an adapter is added — Node, Cloudflare,
 * Vercel). Has no effect on statically prerendered pages.
 *
 * Responsibilities:
 *   1. Generate a per-request CSP nonce and store it in Astro.locals
 *   2. Set all security HTTP response headers
 *   3. Provide a hook point for authentication checks
 *
 * For static-only deployment, this middleware is dormant — security headers
 * are delivered by public/_headers (Cloudflare Pages / Netlify) instead.
 * Both mechanisms should be in sync.
 */

import { defineMiddleware } from 'astro:middleware';

// ── Nonce generation ──────────────────────────────────────────────────────
// Uses the global Web Crypto API (crypto.getRandomValues) — available in
// Node.js ≥16, Cloudflare Workers, Vercel Edge, Deno, and browsers.
// No import needed; zero Node.js dependency.

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64url encode: replace + → - and / → _ and strip padding =
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ── CSP builder ───────────────────────────────────────────────────────────
// Structure:
//   default-src 'self'      → fallback for any directive not listed
//   script-src              → 'self' + nonce + 'strict-dynamic'
//                             strict-dynamic: any script loaded by a nonce-carrying
//                             script is implicitly trusted (needed for Astro's
//                             island hydration chain)
//   style-src               → 'self' + fonts.googleapis.com (for Google Fonts)
//                             unsafe-inline is required for Google Fonts which
//                             injects a <style> element — acceptable since CSS
//                             injection is far less impactful than script injection
//   font-src                → fonts.gstatic.com (where the actual .woff2 live)
//   img-src                 → 'self' data: (data URIs for CSS bg images)
//   connect-src             → 'self' (XHR/fetch from Astro client islands)
//   frame-ancestors 'none'  → prevents clickjacking
//   base-uri 'self'         → prevents base tag injection attacks
//   form-action 'self'      → restricts form submissions to same origin
//   object-src 'none'       → disables Flash / old plugin content
//   upgrade-insecure-requests → forces https for all sub-resources

function buildCSP(nonce: string): string {
  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: https:`,
    `connect-src 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ];
  return directives.join('; ');
}

// ── Security headers ──────────────────────────────────────────────────────
// Applied to every SSR response. For static pages, mirror these in
// public/_headers and/or vercel.json.

function applySecurityHeaders(headers: Headers, nonce: string): void {
  // Content-Security-Policy — primary XSS defence
  headers.set('Content-Security-Policy', buildCSP(nonce));

  // HTTP Strict Transport Security — enforce HTTPS for 1 year
  // Remove in development if testing over plain HTTP
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Prevent browsers from MIME-sniffing a response away from the declared type
  headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent framing entirely (reinforced by frame-ancestors in CSP above)
  headers.set('X-Frame-Options', 'DENY');

  // Controls how much referrer info is sent — strict-origin-when-cross-origin
  // sends the full URL to same-origin requests, only the origin to cross-origin
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Disable browser features this site doesn't need.
  // Prevents malicious scripts from accessing camera/mic/location
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()'
  );

  // Remove the X-Powered-By header if the runtime sets it (Node adapter)
  headers.delete('X-Powered-By');
  headers.delete('Server');
}

// ── Middleware entry point ────────────────────────────────────────────────

export const onRequest = defineMiddleware(async (context, next) => {
  const nonce = generateNonce();
  context.locals.nonce = nonce;

  const response = await next();

  // Skip security headers in dev — strict-dynamic CSP blocks Vite HMR
  // and unbundled module scripts that don't carry a nonce
  if (import.meta.env.DEV) {
    return response;
  }

  const newHeaders = new Headers(response.headers);
  applySecurityHeaders(newHeaders, nonce);

  return new Response(response.body, {
    status:     response.status,
    statusText: response.statusText,
    headers:    newHeaders,
  });
});

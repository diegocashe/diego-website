// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    nonce: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_FEATURE_PROJECTS: string;
  readonly PUBLIC_FEATURE_BLOG: string;
  readonly PUBLIC_FEATURE_STATS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly dirname: string;
}

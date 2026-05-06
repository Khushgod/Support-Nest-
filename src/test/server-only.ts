// Vitest-only shim for the `server-only` marker module.
// Real Next.js builds resolve `server-only` to an error if imported into
// client bundles; in tests we just want the import to be a no-op.
export {};

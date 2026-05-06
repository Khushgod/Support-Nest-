# Spec Addendum (supersedes GeneTranslate_Product_Spec.docx)

This addendum records decisions that deviate from the original product spec.
Where the two disagree, this file wins.

## Architecture (supersedes §6.1)

- **LLM inference:** local open-source model via [Ollama](https://ollama.com).
  Default `qwen2.5:7b-instruct`. The spec's mention of "Claude API" is
  **obsolete** — GeneTranslate is offline-first and does not make outbound
  LLM API calls.
- **PDF parsing:** `pdfjs-dist` running in the Next.js Node runtime (the spec
  mentions `pdfplumber` / Lambda, which assumed a Python stack).
- **Serverless runtime:** Next.js API routes (`runtime = "nodejs"`). The
  spec's "Lambda worker" nomenclature is satisfied by Next.js serverless
  functions on Vercel (or any Node host). No persistent storage, no DB.
- **ClinVar evidence (§6.2 step 4):** implemented via NCBI E-utilities
  (`esearch` + `esummary` over `db=clinvar`). OMIM is **deferred** pending
  licensing review.

## Deferred items (tracked for a future phase)

- OMIM integration (licensed API).
- LLM-fallback extraction when regex parsing fails (spec §5.1).
- Lab-specific parsers beyond Invitae + GeneDx (Quest, Blueprint, Ambry, …).

## Data lifecycle guarantees

See README.md → "Data lifecycle (ephemeral by design)" for the enforced
behavior. Key points:

- PDFs: in-memory only, discarded per request.
- Analysis results: browser `sessionStorage` only.
- Email addresses (spec §5.4): passed to Resend and not persisted server-side
  or client-side after the send completes.

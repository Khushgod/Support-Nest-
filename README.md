# GeneTranslate

A Next.js 16 app that turns clinical genetic test reports (PDFs) into
plain-language summaries, per-variant explainer cards, and a ranked list of
questions to bring to a genetic counselor. Runs fully locally — no cloud LLM
API is required.

> **For educational purposes only.** GeneTranslate does not provide medical
> advice. Every output is wrapped in a counselor-referral disclaimer and the
> safety pipeline blocks treatment recommendations or diagnostic claims.

## Pipeline

```
PDF upload ─▶ pdfjs-dist text extraction ─▶ lab detection
            ─▶ lab-specific structured extraction (Invitae, GeneDx) or
              generic regex fallback
            ─▶ ClinVar evidence retrieval (NCBI E-utilities)
            ─▶ Ollama (Qwen2.5 7B by default) — JSON-mode prompt
            ─▶ Post-LLM safety scan (blocks prohibited content)
            ─▶ results page with summary / variant cards / questions
            ─▶ optional PDF export, copy-to-clipboard, email-me-the-results
```

## Local, open-source stack

- **PDF parsing** — [`pdfjs-dist`](https://github.com/mozilla/pdf.js) (Mozilla,
  Apache 2.0), in-process in the Node runtime. No external API.
- **LLM analysis** — local open-source instruct model served by
  [Ollama](https://ollama.com). Default: `qwen2.5:7b-instruct`.
- **Variant evidence** — live [ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)
  lookup via NCBI E-utilities (`esearch` + `esummary`). OMIM is intentionally
  out of scope (license).
- **Email delivery** — [Resend](https://resend.com) over a tiny `fetch` client
  (no SDK dependency); only enabled when `RESEND_API_KEY` is set.

## Prerequisites

1. Install [Ollama](https://ollama.com/download).
2. Pull a model:
   ```bash
   ollama pull qwen2.5:7b-instruct
   ```
   Alternatives that work well with JSON-mode:
   `llama3.1:8b-instruct-q4_K_M`, `mistral:7b-instruct`, `gemma2:9b-instruct`.
3. Make sure `ollama serve` is running on `http://127.0.0.1:11434` (it starts
   automatically after install on macOS/Linux).
4. `npm install`.

### Environment variables

Set these in `.env.local`. All have safe defaults — none are required to run.

| Variable            | Default                       | Purpose                                                                     |
| ------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| `OLLAMA_BASE_URL`   | `http://127.0.0.1:11434`      | Ollama HTTP endpoint                                                        |
| `OLLAMA_MODEL`      | `qwen2.5:7b-instruct`         | Model used by `/api/analyze`                                                |
| `OLLAMA_TIMEOUT_MS` | `60000`                       | Per-attempt timeout; retried up to 3× with exponential backoff              |
| `NCBI_API_KEY`      | *(unset)*                     | Optional ClinVar API key — raises rate limit from 3/sec to 10/sec           |
| `RESEND_API_KEY`    | *(unset)*                     | Enables "Email me these results"; if unset, the endpoint returns 503        |
| `RESEND_FROM`       | `noreply@genetranslate.local` | Envelope-from address used for outbound emails                              |

## Data lifecycle (ephemeral by design)

GeneTranslate does not persist uploaded reports, extracted text, LLM output,
or email addresses:

- **PDFs** are read into memory inside the Next.js serverless function,
  parsed, and discarded when the request returns.
- **Analysis results** live in the user's browser `sessionStorage` only.
  Closing the tab clears them.
- **ClinVar lookups** are cached per Node process for the duration of a
  single invocation — nothing is written to disk.
- **Email addresses** submitted to `/api/send-email` are forwarded to the
  email provider and never persisted server-side or client-side after send
  (per spec §5.4).

## Safety guarantees

The LLM output goes through a deterministic post-processing scan
(`scanOutputForProhibitedContent`) before being returned to the client.
Treatment recommendations, direct diagnostic claims, or instructions to
start/stop medication cause `/api/analyze` to return **HTTP 422
`SAFETY_BLOCKED`** with a structured error — the prohibited content is never
shown to the user.

A separate "elevated safety mode" engages whenever a high-risk gene is
detected (BRCA1/2, MLH1, MSH2, MSH6, PMS2, EPCAM, PALB2, ATM, CHEK2, TP53,
STK11, CDH1, MUTYH). In that mode:

- The system prompt is rewritten to forbid risk-percentage speculation.
- The "Family implications" panel in the variant card is replaced with a
  counselor-referral note.
- A red banner is rendered above the results.

## Running

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm test             # vitest run (57 tests)
npm run test:watch   # vitest watch
npm run accuracy     # extraction-accuracy harness (verbose)
npm run lint         # eslint
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route               | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `/`                 | Upload page                                                          |
| `/manual-input`     | Manual variant entry (skip PDF upload)                               |
| `/results`          | Renders summary / variant cards / questions from `sessionStorage`    |
| `/api/parse-pdf`    | Multipart upload → text + lab detection + structured variant extract |
| `/api/analyze`      | Variants → Ollama (with ClinVar enrichment) → safety-scanned JSON    |
| `/api/send-email`   | Optional: send the result PDF to a user-supplied address via Resend  |

## Testing & accuracy

The test harness lives at [src/lib/__tests__/](src/lib/__tests__/) and
[src/app/api/*/route.test.ts](src/app/api/). It currently covers:

- **lab-detector** — every supported lab regex, header truncation.
- **variant-extractor** — broad gene matching (incl. NPC1, GJA8 — formerly
  out-of-allow-list), classification normalization, acronym filtering,
  deduplication.
- **safety-checker** — high-risk flagging, prohibited-content scan.
- **clinvar-client** — esearch + esummary roundtrip, schema fallback
  (germline_classification ↔ clinical_significance), caching, rate-limit
  pacing, network-failure resilience.
- **prompt-builder** — ClinVar prompt injection, elevated-mode toggle, soft
  failure when ClinVar is unreachable.
- **ollama-client** — JSON parsing, code-fence stripping, retry on transport
  errors, `OllamaUnavailableError` after exhaustion, JSON-correction round.
- **/api/analyze route** — safety-block path returns 422, success path
  returns 200 + safetyFlags.
- **/api/send-email route** — auth, address validation, size limits, Resend
  forwarding, error mapping.
- **lab parsers** — Invitae and GeneDx happy paths plus routing through
  `extractByLab`.

The accuracy target per spec §7.4 is ≥95% field accuracy across the
`public/samples/` corpus. Real-PDF fixtures with paired expected-variant
JSONs still need to be added to fully populate `npm run accuracy` — see the
[plan](./SPEC_ADDENDUM.md) for status.

## Spec deviations

See [SPEC_ADDENDUM.md](./SPEC_ADDENDUM.md). The original
`GeneTranslate_Product_Spec.docx` referenced Claude API + AWS Lambda +
pdfplumber + OMIM; the addendum supersedes those choices with the
Ollama / Next.js / pdfjs-dist / ClinVar-only stack actually shipped.

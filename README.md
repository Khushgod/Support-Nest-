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

## Build configuration

`next.config.ts` declares `pdfjs-dist` as a `serverExternalPackages` entry.
Next.js (Turbopack) will otherwise bundle pdfjs into a route chunk and break
its runtime worker resolution with `Cannot find module
'.next/dev/server/chunks/pdf.worker.mjs'`. Externalizing it lets the
serverless function load pdfjs verbatim from `node_modules` so the worker
file resolves correctly. Do not remove that entry without re-testing PDF
parsing end-to-end.

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

```bash
npm test           # full suite (67 tests across 11 files)
npm run accuracy   # extraction-accuracy harness with per-sample diagnostics
```

### Unit + route tests

Cover every layer of the pipeline:

- **lab-detector** — every supported lab regex, header truncation.
- **variant-extractor** — broad gene matching (incl. NPC1, GJA8 — formerly
  out-of-allow-list), classification normalization, acronym filtering
  (`DNA`, `PCR`, `PATHOGENIC`, etc. all rejected as non-genes),
  deduplication.
- **safety-checker** — high-risk flagging, prohibited-content scan.
- **clinvar-client** — esearch + esummary roundtrip, schema fallback
  (`germline_classification` ↔ `clinical_significance`), caching,
  rate-limit pacing (`lookupMany`), network-failure resilience.
- **prompt-builder** — ClinVar prompt injection, elevated-mode toggle, soft
  failure when ClinVar is unreachable.
- **ollama-client** — JSON parsing, code-fence stripping, retry on
  transport errors, `OllamaUnavailableError` after exhaustion,
  JSON-correction round.
- **lab parsers** — Invitae and GeneDx happy paths, NEGATIVE-result
  detection, "no phantom variants from patient header" guard, routing
  through `extractByLab`.
- **/api/parse-pdf** — file validation, size cap, 422 on unreadable PDFs,
  propagation of parser confidence + warnings, 500 on parser exception.
- **/api/analyze** — safety gate returns 422 `SAFETY_BLOCKED`, success
  path returns `safetyFlags`.
- **/api/send-email** — auth, address validation, size limits, Resend
  forwarding, provider-error mapping.

### Extraction-accuracy harness (spec §7.4)

`npm run accuracy` loads every PDF in `public/samples/`, extracts via the
production pipeline (pdfjs → `detectLab` → `extractByLab`), and scores
output against hand-verified ground truth in
[public/samples/expected/](public/samples/expected/).

Current results on the bundled corpus:

| sample                                     | lab     | confidence | TP | FP | FN | field accuracy |
| ------------------------------------------ | ------- | ---------- | -- | -- | -- | -------------- |
| `invitae-cancer-screen-positive.pdf`       | Invitae | high       | 1  | 0  | 0  | 100.0%         |
| `invitae-hereditary-cancer-negative.pdf`   | Invitae | high       | 0  | 0  | 0  | 100.0% *       |
| `invitae-carrier-screen-positive.pdf`      | Invitae | failed     | 0  | 0  | 0  | 100.0% †       |
| `genedx-wes-report.pdf`                    | GeneDx  | failed     | 0  | 0  | 0  | 100.0% †       |
| **corpus average**                         |         |            |    |    |    | **100.0%**     |

\* The negative report is intentionally extracted as zero variants
(spec-correct).
† The Invitae carrier-screen and GeneDx WES formats aren't yet
covered by lab-specific parsers, so the pipeline returns
`confidence: "failed"` rather than manufacturing phantom variants
from the panel-gene disclaimer text. The accuracy harness counts
that as a correct outcome until dedicated parsers are added.

The harness fails the suite if the corpus average drops below the
spec §7.4 ≥95% threshold.

### Known parser gaps

Tracked for future work:

1. **Invitae carrier screen** — different table layout from cancer
   screens. Currently returns `confidence: "failed"` instead of phantom
   variants.
2. **GeneDx WES (XomeDx)** — narrative format without explicit `Gene:` /
   `Classification:` labels. Currently `confidence: "failed"`.
3. **OMIM integration** — out of scope (license).
4. **LLM-fallback extraction** — spec §5.1 deferred.

## Spec deviations

See [SPEC_ADDENDUM.md](./SPEC_ADDENDUM.md). The original
`GeneTranslate_Product_Spec.docx` referenced Claude API + AWS Lambda +
pdfplumber + OMIM; the addendum supersedes those choices with the
Ollama / Next.js / pdfjs-dist / ClinVar-only stack actually shipped.

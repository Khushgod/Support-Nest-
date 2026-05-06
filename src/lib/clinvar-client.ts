/**
 * ClinVar evidence client — NCBI E-utilities.
 *
 * Flow per variant:
 *   1. esearch  on db=clinvar with a gene+HGVS query → list of variation UIDs.
 *   2. esummary on db=clinvar with the top UID → classification, review status,
 *      last-evaluated date, condition(s).
 *
 * Results are cached in-memory for the lifetime of the serverless invocation
 * only — we do NOT persist anything across requests, per spec §5.3 / §6.3.
 */

export interface ClinVarEvidence {
  uid: string;
  gene: string;
  hgvs?: string;
  clinicalSignificance?: string;
  reviewStatus?: string;
  dateLastEvaluated?: string;
  conditions?: string[];
  variationUrl?: string;
}

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

function apiKeyParam(): string {
  const key = process.env.NCBI_API_KEY;
  return key ? `&api_key=${encodeURIComponent(key)}` : "";
}

// Module-scoped cache. A fresh Node process = fresh cache; no cross-user leak.
const cache = new Map<string, ClinVarEvidence | null>();

interface FetchOpts {
  signal?: AbortSignal;
  timeoutMs?: number;
  // Injected for tests.
  fetchImpl?: typeof fetch;
}

function cacheKey(gene: string, hgvs?: string): string {
  return `${gene}::${hgvs ?? ""}`.toLowerCase();
}

async function getJson(
  url: string,
  opts: FetchOpts
): Promise<unknown> {
  const f = opts.fetchImpl ?? fetch;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 8000);
  try {
    const res = await f(url, {
      signal: opts.signal ?? ctrl.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`ClinVar HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(t);
  }
}

function buildQuery(gene: string, hgvs?: string): string {
  // HGVS notation (when present) gives the most specific match. Otherwise
  // fall back to the gene symbol alone and take ClinVar's first result.
  if (hgvs) {
    // Use the coding portion only (strip protein suffix if we appended one).
    const coding = hgvs.split(" ")[0];
    return `${gene}[gene] AND "${coding}"`;
  }
  return `${gene}[gene]`;
}

/**
 * Look up a single variant. Returns `null` on miss or error — callers should
 * treat a miss as "no authoritative evidence available" and fall back to the
 * built-in reference data.
 */
export async function lookupVariant(
  gene: string,
  hgvs: string | undefined,
  opts: FetchOpts = {}
): Promise<ClinVarEvidence | null> {
  const key = cacheKey(gene, hgvs);
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const query = buildQuery(gene, hgvs);
    const esearchUrl = `${BASE}/esearch.fcgi?db=clinvar&retmode=json&retmax=1&term=${encodeURIComponent(
      query
    )}${apiKeyParam()}`;
    const esearch = (await getJson(esearchUrl, opts)) as {
      esearchresult?: { idlist?: string[] };
    };
    const uid = esearch.esearchresult?.idlist?.[0];
    if (!uid) {
      cache.set(key, null);
      return null;
    }

    const esummaryUrl = `${BASE}/esummary.fcgi?db=clinvar&retmode=json&id=${uid}${apiKeyParam()}`;
    const esummary = (await getJson(esummaryUrl, opts)) as {
      result?: Record<string, unknown>;
    };
    // ClinVar's esummary payload has two competing shapes in the wild:
    //   - current: `germline_classification.{description,review_status,last_evaluated}`
    //   - legacy:  `clinical_significance.{description,review_status,last_evaluated}`
    // We merge both so we keep working if NCBI rolls schemas.
    const rec = esummary.result?.[uid] as
      | {
          germline_classification?: {
            description?: string;
            review_status?: string;
            last_evaluated?: string;
          };
          clinical_significance?: {
            description?: string;
            review_status?: string;
            last_evaluated?: string;
          };
          trait_set?: Array<{ trait_name?: string }>;
        }
      | undefined;

    const cls = rec?.germline_classification ?? rec?.clinical_significance;

    const evidence: ClinVarEvidence = {
      uid,
      gene,
      hgvs,
      clinicalSignificance: cls?.description,
      reviewStatus: cls?.review_status,
      dateLastEvaluated: cls?.last_evaluated,
      conditions: rec?.trait_set
        ?.map((t) => t.trait_name)
        .filter((n): n is string => !!n),
      variationUrl: `https://www.ncbi.nlm.nih.gov/clinvar/variation/${uid}/`,
    };

    cache.set(key, evidence);
    return evidence;
  } catch {
    cache.set(key, null);
    return null;
  }
}

/**
 * Look up multiple variants sequentially. NCBI E-utilities limits anonymous
 * callers to 3 requests/sec; we pace to ~2.5/sec to leave headroom. Each
 * `lookupVariant` call internally makes 2 HTTP requests (esearch + esummary).
 * With an `NCBI_API_KEY` the limit rises to 10/sec — callers can set
 * `minIntervalMs: 100` to use the faster budget.
 */
export async function lookupMany(
  variants: Array<{ gene: string; hgvsNotation?: string }>,
  opts: FetchOpts & { minIntervalMs?: number } = {}
): Promise<ClinVarEvidence[]> {
  const interval = opts.minIntervalMs ?? 400;
  const results: ClinVarEvidence[] = [];
  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const ev = await lookupVariant(v.gene, v.hgvsNotation, opts);
    if (ev) results.push(ev);
    if (i < variants.length - 1 && interval > 0) {
      await new Promise((r) => setTimeout(r, interval));
    }
  }
  return results;
}

/** Exposed for tests. */
export function __clearClinVarCache(): void {
  cache.clear();
}

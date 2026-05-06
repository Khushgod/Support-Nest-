export const GENE_REFERENCE: Record<
  string,
  { function: string; conditions: string; inheritance: string }
> = {
  BRCA1: {
    function: "Helps repair damaged DNA and prevent uncontrolled cell growth",
    conditions: "Hereditary Breast and Ovarian Cancer syndrome",
    inheritance: "Autosomal Dominant",
  },
  BRCA2: {
    function: "Works with BRCA1 to repair DNA damage and suppress tumors",
    conditions: "Hereditary Breast and Ovarian Cancer syndrome",
    inheritance: "Autosomal Dominant",
  },
  MLH1: {
    function: "Fixes small errors that occur when DNA is copied during cell division",
    conditions: "Lynch syndrome (hereditary colorectal and other cancers)",
    inheritance: "Autosomal Dominant",
  },
  MSH2: {
    function: "Partners with other proteins to detect and repair DNA copying errors",
    conditions: "Lynch syndrome",
    inheritance: "Autosomal Dominant",
  },
  MSH6: {
    function: "Helps recognize and repair mismatched DNA base pairs",
    conditions: "Lynch syndrome",
    inheritance: "Autosomal Dominant",
  },
  PMS2: {
    function: "Part of the DNA mismatch repair system that maintains genome stability",
    conditions: "Lynch syndrome",
    inheritance: "Autosomal Dominant",
  },
  EPCAM: {
    function: "Involved in cell adhesion; deletions can silence the MSH2 gene",
    conditions: "Lynch syndrome (via MSH2 silencing)",
    inheritance: "Autosomal Dominant",
  },
  TP53: {
    function: "Known as the 'guardian of the genome' — triggers cell death when DNA damage is severe",
    conditions: "Li-Fraumeni syndrome (high risk of multiple cancer types)",
    inheritance: "Autosomal Dominant",
  },
  PALB2: {
    function: "Partners with BRCA2 to repair DNA double-strand breaks",
    conditions: "Increased breast cancer risk; Fanconi anemia (biallelic)",
    inheritance: "Autosomal Dominant (cancer risk); Autosomal Recessive (Fanconi anemia)",
  },
  ATM: {
    function: "Detects DNA damage and activates the repair pathway",
    conditions: "Moderately increased breast cancer risk; Ataxia-Telangiectasia (biallelic)",
    inheritance: "Autosomal Dominant (cancer risk); Autosomal Recessive (A-T)",
  },
  CHEK2: {
    function: "Activates DNA repair when damage is detected",
    conditions: "Moderately increased breast and colorectal cancer risk",
    inheritance: "Autosomal Dominant",
  },
  STK11: {
    function: "Regulates cell growth and energy metabolism",
    conditions: "Peutz-Jeghers syndrome (GI polyps and increased cancer risk)",
    inheritance: "Autosomal Dominant",
  },
  CDH1: {
    function: "Produces a protein that helps cells stick together properly",
    conditions: "Hereditary Diffuse Gastric Cancer; lobular breast cancer risk",
    inheritance: "Autosomal Dominant",
  },
  MUTYH: {
    function: "Repairs a specific type of oxidative DNA damage",
    conditions: "MUTYH-Associated Polyposis (colorectal polyps and cancer) when two copies are affected",
    inheritance: "Autosomal Recessive",
  },
  CFTR: {
    function: "Controls the flow of salt and water in and out of cells",
    conditions: "Cystic Fibrosis",
    inheritance: "Autosomal Recessive",
  },
  SMN1: {
    function: "Produces a protein essential for motor nerve cell survival",
    conditions: "Spinal Muscular Atrophy (SMA)",
    inheritance: "Autosomal Recessive",
  },
  FMR1: {
    function: "Produces a protein needed for normal brain development and function",
    conditions: "Fragile X syndrome",
    inheritance: "X-linked Dominant",
  },
  HTT: {
    function: "Produces huntingtin protein important for nerve cell function",
    conditions: "Huntington disease",
    inheritance: "Autosomal Dominant",
  },
  DMD: {
    function: "Produces dystrophin, a protein that protects muscle fibers during contraction",
    conditions: "Duchenne/Becker Muscular Dystrophy",
    inheritance: "X-linked Recessive",
  },
  HEXA: {
    function: "Breaks down a fatty substance called GM2 ganglioside in nerve cells",
    conditions: "Tay-Sachs disease",
    inheritance: "Autosomal Recessive",
  },
  GBA: {
    function: "Breaks down a fatty molecule called glucocerebroside in cells",
    conditions: "Gaucher disease; increased Parkinson disease risk",
    inheritance: "Autosomal Recessive",
  },
  PTEN: {
    function: "Acts as a brake on cell growth and division",
    conditions: "PTEN Hamartoma Tumor Syndrome; Cowden syndrome",
    inheritance: "Autosomal Dominant",
  },
  APC: {
    function: "Controls cell growth in the lining of the colon and other tissues",
    conditions: "Familial Adenomatous Polyposis (FAP)",
    inheritance: "Autosomal Dominant",
  },
  NF1: {
    function: "Regulates a cell growth signaling pathway",
    conditions: "Neurofibromatosis Type 1",
    inheritance: "Autosomal Dominant",
  },
  SCN1A: {
    function: "Controls sodium channels in brain nerve cells, essential for normal signaling",
    conditions: "Dravet syndrome; genetic epilepsy",
    inheritance: "Autosomal Dominant",
  },
  MECP2: {
    function: "Regulates gene activity in the brain and is critical for brain development",
    conditions: "Rett syndrome",
    inheritance: "X-linked Dominant",
  },
  PKD1: {
    function: "Helps kidney cells sense mechanical signals and develop properly",
    conditions: "Autosomal Dominant Polycystic Kidney Disease",
    inheritance: "Autosomal Dominant",
  },
  FGFR3: {
    function: "Regulates bone growth and development",
    conditions: "Achondroplasia; Thanatophoric dysplasia",
    inheritance: "Autosomal Dominant",
  },
  FBN1: {
    function: "Produces fibrillin-1, a protein that gives structure to connective tissue",
    conditions: "Marfan syndrome",
    inheritance: "Autosomal Dominant",
  },
};

export const ACMG_DEFINITIONS = `
## ACMG Variant Classification Definitions

**Pathogenic**: Strong scientific evidence shows this variant causes disease. Multiple independent studies, functional data, and/or well-established clinical correlation support this classification.

**Likely Pathogenic**: There is strong but not definitive evidence that this variant causes disease. The probability of pathogenicity is greater than 90%.

**Variant of Uncertain Significance (VUS)**: There is not enough evidence to determine whether this variant causes disease or is harmless. A VUS is NOT a diagnosis. It means scientists are still studying this change. Many VUS are later reclassified as benign.

**Likely Benign**: There is strong but not definitive evidence that this variant does NOT cause disease. The probability of being benign is greater than 90%.

**Benign**: Strong scientific evidence shows this variant does NOT cause disease. It is a normal variation in the population.

## ClinVar Star Ratings

- ★★★★ (4 stars): Practice guideline — an expert panel has reviewed this variant
- ★★★ (3 stars): Reviewed by expert panel
- ★★ (2 stars): Multiple submitters with consistent interpretation
- ★ (1 star): Single submitter or submitters with conflicting interpretations
- No stars: No assertion criteria provided

## VUS Explanation Framework

When a variant is classified as VUS, explain:
1. What VUS means: "Scientists have found a change in this gene, but there is not yet enough evidence to know if it causes health problems or is a normal variation."
2. What VUS does NOT mean: "A VUS is not a diagnosis. It does not mean you have a genetic condition."
3. What to do: "Your genetic counselor may recommend periodic follow-up as more research becomes available. The classification may change over time as scientists learn more."
`;

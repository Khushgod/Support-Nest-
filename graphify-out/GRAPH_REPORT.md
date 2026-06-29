# Graph Report - .  (2026-06-26)

## Corpus Check
- 201 files · ~246,720 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 761 nodes · 1372 edges · 50 communities (38 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Gene Analysis Pipeline|Gene Analysis Pipeline]]
- [[_COMMUNITY_Auth & Vault Security|Auth & Vault Security]]
- [[_COMMUNITY_Auth Actions & Schema|Auth Actions & Schema]]
- [[_COMMUNITY_Static Pages & Events|Static Pages & Events]]
- [[_COMMUNITY_Lab Detection & PDF Parsing|Lab Detection & PDF Parsing]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Forum UI Components|Forum UI Components]]
- [[_COMMUNITY_Forum Seed Data|Forum Seed Data]]
- [[_COMMUNITY_Auth DAL & Community Hub|Auth DAL & Community Hub]]
- [[_COMMUNITY_Regulation Toolkit|Regulation Toolkit]]
- [[_COMMUNITY_IEP Companion Tool|IEP Companion Tool]]
- [[_COMMUNITY_Analyze Page & Hooks|Analyze Page & Hooks]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Walkthrough Scripts|Walkthrough Scripts]]
- [[_COMMUNITY_PDF Export & Sample Data|PDF Export & Sample Data]]
- [[_COMMUNITY_Results Display Types|Results Display Types]]
- [[_COMMUNITY_Forum CSV Import|Forum CSV Import]]
- [[_COMMUNITY_Auth Layout & Header|Auth Layout & Header]]
- [[_COMMUNITY_Forum Body & Formatting|Forum Body & Formatting]]
- [[_COMMUNITY_Forum Reactions & Thread Views|Forum Reactions & Thread Views]]
- [[_COMMUNITY_Sensory Planner Tool|Sensory Planner Tool]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Analysis Summary & Disclaimers|Analysis Summary & Disclaimers]]
- [[_COMMUNITY_Plain Language Tool|Plain Language Tool]]
- [[_COMMUNITY_Tool Pages (IEP & Sensory)|Tool Pages (IEP & Sensory)]]
- [[_COMMUNITY_Scripts TypeScript Config|Scripts TypeScript Config]]
- [[_COMMUNITY_Analysis Types & Hooks|Analysis Types & Hooks]]
- [[_COMMUNITY_User Profile & Follows|User Profile & Follows]]
- [[_COMMUNITY_GeneTranslate Layout|GeneTranslate Layout]]
- [[_COMMUNITY_Resources & Genetic Counselors|Resources & Genetic Counselors]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `requireUser` - 22 edges
2. `compilerOptions` - 16 edges
3. `Shell()` - 15 edges
4. `getCurrentUser` - 15 edges
5. `ExtractedVariant` - 15 edges
6. `scripts` - 12 edges
7. `ThreadPage()` - 11 edges
8. `getThread()` - 11 edges
9. `timeAgo()` - 10 edges
10. `PatientContext` - 10 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `decrypt()`  [EXTRACTED]
  proxy.ts → src/lib/auth/session.ts
- `main()` --calls--> `csvRowsToSeedThreads()`  [EXTRACTED]
  scripts/import-forum-csv.ts → src/lib/forum/csv-import.ts
- `main()` --calls--> `parseQuestionResponseCsv()`  [EXTRACTED]
  scripts/import-forum-csv.ts → src/lib/forum/csv-import.ts
- `SpacePage()` --calls--> `NotFound()`  [INFERRED]
  src/app/community/[space]/page.tsx → src/app/not-found.tsx
- `Header()` --calls--> `getCurrentUser`  [EXTRACTED]
  src/components/supportnest/Header.tsx → src/lib/auth/dal.ts

## Import Cycles
- None detected.

## Communities (50 total, 12 thin omitted)

### Community 0 - "Gene Analysis Pipeline"
Cohesion: 0.07
Nodes (39): POST(), apiKeyParam(), buildQuery(), cache, cacheKey(), __clearClinVarCache(), ClinVarEvidence, FetchOpts (+31 more)

### Community 1 - "Auth & Vault Security"
Cohesion: 0.07
Nodes (46): requireUser, deleteRecord(), deriveRecordKey(), getMasterKey(), listForUser(), openAndDecrypt(), sealAndStore(), SealedRef (+38 more)

### Community 2 - "Auth Actions & Schema"
Cohesion: 0.06
Nodes (34): login(), logout(), register(), LoginFormState, LoginInput, LoginSchema, RegisterFormState, RegisterInput (+26 more)

### Community 3 - "Static Pages & Events"
Cohesion: 0.05
Nodes (26): VALUES, metadata, EventItem, FORMAT_STYLES, metadata, UPCOMING, metadata, SECTIONS (+18 more)

### Community 4 - "Lab Detection & PDF Parsing"
Cohesion: 0.09
Nodes (34): detectLab(), LAB_PATTERNS, extractTextFromPDF(), ExtractedVariant, extractVariants(), getLineContexts(), isLikelyGene(), LineContext (+26 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.04
Nodes (45): dependencies, bcryptjs, better-sqlite3, clsx, groq-sdk, jose, jspdf, jspdf-autotable (+37 more)

### Community 6 - "Forum UI Components"
Cohesion: 0.11
Nodes (25): AUD_CLASS, AudienceChip(), ContentNoteChip(), TagChip(), AUDIENCE_LABELS, AUDIENCE_TAGS, AudienceTag, Bookmark (+17 more)

### Community 7 - "Forum Seed Data"
Cohesion: 0.11
Nodes (23): buildSeedReplies(), CSV_SEED_THREADS, QUESTION_RESPONSE_CSV_ROWS, Seed, SEED_THREADS, SEED_USERS, CreateThreadInput, getThread() (+15 more)

### Community 8 - "Auth DAL & Community Hub"
Cohesion: 0.16
Nodes (20): getCurrentUser, CommunityHubPage(), metadata, PRINCIPLES, AutoSubmitSelect(), bookmarksForUser(), listSpaceStats(), listThreads() (+12 more)

### Community 9 - "Regulation Toolkit"
Cohesion: 0.10
Nodes (15): metadata, Body, BODY_OPTIONS, Energy, Need, NEED_OPTIONS, pickTools(), pickZone() (+7 more)

### Community 10 - "IEP Companion Tool"
Cohesion: 0.14
Nodes (12): IepClient(), INITIAL, renderText(), roleLabel(), State, Accommodation, ACCOMMODATIONS, CHALLENGE_AREAS (+4 more)

### Community 11 - "Analyze Page & Hooks"
Cohesion: 0.16
Nodes (15): AnalyzePage(), STATUS_MESSAGES, useAnalysis(), ACMG_OPTIONS, EMPTY_VARIANT, INHERITANCE_OPTIONS, ManualInputPage(), ZYGOSITY_OPTIONS (+7 more)

### Community 12 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 13 - "Walkthrough Scripts"
Cohesion: 0.15
Nodes (12): OUT, captureOne(), ensureFreshUser(), main(), MANIFEST_PATH, registerAndLogin(), settle(), SHOTS_DIR (+4 more)

### Community 14 - "PDF Export & Sample Data"
Cohesion: 0.16
Nodes (10): buildPdfDoc(), buildResultsPdfBuffer(), exportResultsToPDF(), DEFAULT_SAMPLE_OUTPUT, invitaeBrip1Output, SAMPLE_REPORTS, SampleReport, AnalysisResult (+2 more)

### Community 15 - "Results Display Types"
Cohesion: 0.15
Nodes (11): CounselorQuestion, VariantCardData, QuestionsSectionProps, CLASSIFICATION_COLORS, getClassColor(), SUPPRESS_SPECULATION_GENES, VariantCard(), VariantCardProps (+3 more)

### Community 16 - "Forum CSV Import"
Cohesion: 0.20
Nodes (10): csvRowsToSeedThreads(), parseCsv(), parseQuestionResponseCsv(), QuestionResponseCsvRow, REQUIRED_HEADERS, THEME_TO_AUDIENCE, THEME_TO_AUTHOR, THEME_TO_SPACE (+2 more)

### Community 17 - "Auth Layout & Header"
Cohesion: 0.20
Nodes (4): Header(), NAV, Logo(), SensoryModeToggle()

### Community 18 - "Forum Body & Formatting"
Cohesion: 0.29
Nodes (10): Body(), bodyToSegments(), buildSearchHref(), normalizeForumTag(), snippet(), splitForumTags(), timeAgo(), ReplyCard() (+2 more)

### Community 19 - "Forum Reactions & Thread Views"
Cohesion: 0.26
Nodes (10): NotFound(), getRepliesForThread(), incrementViewCount(), isBookmarked(), isFollowing(), reactionsForUser(), REACTION_LABELS, REACTION_ORDER (+2 more)

### Community 20 - "Sensory Planner Tool"
Cohesion: 0.18
Nodes (10): BellState, Block, BlockRow(), DEFAULT_BLOCKS, Load, LOAD_META, nowHHMM(), resolveBell() (+2 more)

### Community 21 - "Home Page"
Cohesion: 0.18
Nodes (6): AUDIENCES, metadata, PILLARS, TOOLS, VALUES, VOICES

### Community 22 - "Analysis Summary & Disclaimers"
Cohesion: 0.25
Nodes (6): AnalysisSummary, DisclaimerFooter(), HighRiskBanner(), HighRiskBannerProps, SummarySection(), SummarySectionProps

### Community 23 - "Plain Language Tool"
Cohesion: 0.18
Nodes (7): metadata, Audience, AUDIENCE_OPTIONS, Result, SAMPLES, Tone, TONE_OPTIONS

### Community 24 - "Tool Pages (IEP & Sensory)"
Cohesion: 0.20
Nodes (4): metadata, metadata, Accent, ACCENTS

### Community 25 - "Scripts TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, module, moduleResolution, resolveJsonModule, skipLibCheck, strict, target (+1 more)

### Community 26 - "Analysis Types & Hooks"
Cohesion: 0.33
Nodes (5): AnalyzeRequest, AnalysisStatus, ExtractionResult, PatientContext, ContextFormProps

### Community 27 - "User Profile & Follows"
Cohesion: 0.31
Nodes (7): followsForUser(), repliesByUser(), asTab(), CommunityMePage(), metadata, Tab, TABS

### Community 28 - "GeneTranslate Layout"
Cohesion: 0.28
Nodes (3): NAV, Footer(), SECTIONS

### Community 29 - "Resources & Genetic Counselors"
Cohesion: 0.22
Nodes (6): ACMG_TIERS, COUNSELORS, EDUCATION, Resource, SUPPORT, metadata

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (4): ConfidenceBadgeProps, VARIANT_MAP, Badge(), BadgeProps

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (5): __dirname, files, localRequire, root, samplesDir

### Community 32 - "Community 32"
Cohesion: 0.40
Nodes (3): FAQS, metadata, QA

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): csp, nextConfig, securityHeaders

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (3): FilePreview(), FilePreviewProps, formatSize()

## Knowledge Gaps
- **268 isolated node(s):** `deploy.sh script`, `eslintConfig`, `csp`, `securityHeaders`, `nextConfig` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Shell()` connect `Static Pages & Events` to `Auth & Vault Security`, `Forum UI Components`, `Auth DAL & Community Hub`, `Forum Reactions & Thread Views`, `User Profile & Follows`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `getCurrentUser` connect `Auth DAL & Community Hub` to `Auth & Vault Security`, `Forum Reactions & Thread Views`, `Forum UI Components`, `Auth Layout & Header`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Footer()` connect `GeneTranslate Layout` to `Tool Pages (IEP & Sensory)`, `Static Pages & Events`, `Home Page`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `deploy.sh script`, `eslintConfig`, `csp` to the rest of the system?**
  _268 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Gene Analysis Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06654567453115548 - nodes in this community are weakly interconnected._
- **Should `Auth & Vault Security` be split into smaller, more focused modules?**
  _Cohesion score 0.07207792207792207 - nodes in this community are weakly interconnected._
- **Should `Auth Actions & Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.06485671191553545 - nodes in this community are weakly interconnected._
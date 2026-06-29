@AGENTS.md

## graphify — MANDATORY codebase analysis tool

This project has a pre-built knowledge graph at `graphify-out/` (761 nodes, 1372 edges, 50 communities).

**Always use the graph before reading source files.** Do not grep or open files to answer architecture questions when the graph can answer them faster.

Rules:
- **Before any codebase analysis**, run `graphify query "<question>"` — this is the primary way to understand the code. Never skip this step.
- Use `graphify path "<A>" "<B>"` to trace relationships between two concepts (e.g. `graphify path "analyze route" "Groq client"`).
- Use `graphify explain "<concept>"` for a focused plain-language explanation of any node.
- Read `graphify-out/GRAPH_REPORT.md` for broad architecture review — it contains god nodes, surprising connections, and community map.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Key god nodes to know: `requireUser` (auth guard), `Shell()` (app shell layout), `getCurrentUser` (DAL), `ExtractedVariant` (core gene type), `getThread()` (forum).
- The graph lives at `graphify-out/graph.json`. If it's missing, rebuild with `graphify .` from the project root (`C:\Users\khushagra\geneTranslate`).

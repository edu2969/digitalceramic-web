<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:graphify-agent-rules -->
# Graphify first — save tokens

This repo has a prebuilt knowledge graph at `graphify-out/graph.json` (535 nodes, 782 edges).
Querying it returns a small scoped subgraph instead of dumping whole files, so it is far cheaper
than Read/Grep/Glob/Bash exploration. **Use it before those tools for any "where/how/what/why"
question about the code.**

Commands (run via Bash/PowerShell):
- `graphify query "<question>"` — scoped subgraph for any codebase/architecture question
- `graphify path "<A>" "<B>"` — dependency path between two symbols
- `graphify explain "<concept>"` — all nodes related to a concept

Rules:
- This applies to YOU and to every subagent you spawn. Include this rule verbatim in every
  subagent prompt that involves code exploration.
- Do NOT skip graphify because files seem "already known" or you're executing a plan — the graph
  surfaces cross-file and INFERRED edges that grep/Read cannot find.
- Fall back to Read/Grep/Glob only when: (a) graphify already oriented you and you need exact lines
  to modify/debug, (b) the graph lacks the detail, or (c) `graphify-out/graph.json` is missing/stale.
- For broad architecture review, read `graphify-out/GRAPH_REPORT.md` (God Nodes, communities,
  surprising connections) rather than crawling files.
- After editing code files, run `graphify update .` to refresh the graph (AST-only, no API cost).
- Check staleness: compare `git rev-parse HEAD` against the "Built from commit" line in GRAPH_REPORT.md.
<!-- END:graphify-agent-rules -->

# AGENTS.md - Developer & AI Agent Guide for polymind-ai 🤖

## 🎯 Repository Overview
**polymind-ai**: > **PolyMind AI** is an advanced AI Orchestrator that queries **ChatGPT (OpenAI)**, **Claude (Anthropic)**, **Gemini (Google)**, and **Ollama (Local LLM)** in parallel, compares their outputs side-by-side with real-time latency benchmarks, and synthesizes an authoritative unified consensus master response. Available as a modern responsive web application and native Android app with hardware acceleration, tactile haptics, and system sharing. - ⚡ **Parallel Multi-Model Execution**: Dispatch a single prompt simultaneously to ChatGPT (GPT-4o / GPT-4o-mini), Claude (3.5 Sonnet / 3.5 Haiku), Gemini (1.5 Pro / 2.0 Flash), and Ollama (Local LLM).

---

## 🏗️ Repository Architecture
Key directories and files: `.github/, LICENSE, README.md, android/, web/`.

### Tech Stack & Runtime
- **Category:** Documentation, Curated System Catalog, or Metadata Repository
- **Format:** Markdown & System Configs

## ⚙️ Verification Instructions
- Validate all Markdown links and header hierarchy.
- Ensure UTF-8 clean encoding with no broken character encodings.

---

## 🛡️ Coding & Safety Guidelines for Autonomous Agents

1. **Documentation Integrity:** Preserve all existing docstrings, header comments, and licensing banners. Never delete context unless specifically instructed.
2. **Zero Hardcoded Secrets:** Never embed API keys, OAuth tokens, personal access tokens, or sensitive credentials in committed files. Read credentials exclusively from environment variables or secure credential paths.
3. **Git Hygiene:**
   - Do not force-push (`git push --force`) or run destructive commands.
   - Never modify root git configurations or harness infrastructure outside task scope.
   - Keep git diffs atomic, focused, and verified before committing.
4. **Agent Workflow Protocol:**
   - **Plan:** Inspect codebase architecture and dependencies before editing.
   - **Act:** Make minimal, clean, high-precision changes.
   - **Verify:** Run the appropriate verification commands listed above.
   - **Reflect:** Confirm zero regressions and review `git diff`.

---
*Maintained by Ayyappa Pravin • Built for Antigravity, Claude, Cursor & Autonomous AI Agents.*

# AGENTS.md - Developer & AI Agent Operations Manual for `polymind-ai` 🤖

This document is the definitive operational guide for autonomous AI coding agents (Antigravity, Claude, Cursor, OpenAI Codex, OpenHands) operating within this repository.

---

## 🎯 1. System Overview & Core Philosophy

**PolyMind AI - Multi-LLM Orchestrator & Consensus Engine 🧠⚡**
> PolyMind AI is an advanced AI Orchestrator that queries ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), and Ollama (Local LLM) in parallel, compares their outputs side-by-side with real-time latency benchmarks, and synthesizes an authoritative unified consensus master response. Available as a modern responsive web application and native Android app with hardware acceleration, tactile haptics, and system sharing. - ⚡ Parallel Multi-Model Execution: Dispatch a single prompt simultaneously to ChatGPT (GPT-4o / GPT-4o-mini), Claude (3.5 Sonnet / 3.5 Haiku), Gemini (1.5 Pro / 2.0 Flash), and Ollama (Local LLM).

### Key Architectural Capabilities
- **Meta-LLM Synthesis**: Uses active API models to dynamically synthesize points of agreement, divergences, and harmonized code solutions.
- **Smart Heuristic Fallback**: Intelligent client-side heuristic engine that extracts code blocks and key stances when offline or in simulation mode.
- **🎯 Consensus**: Synthesizes universal agreements and a unified master solution.
- **⚔️ Code Battle**: Pits models against each other for the cleanest, most performant, and memory-efficient implementation.
- **🔍 Fact-Check**: Exposes hallucinations, contradictions, and data discrepancies.
- **⚖️ Debate & Perspectives**: Compares contrasting trade-offs, paradigms, and design philosophies.

---

## 🏗️ 2. Repository Structure & Directory Map

| Path | Role & Architectural Responsibility |
| :--- | :--- |
| `.github/` | Subsystem directory (.github) |
| `android/` | Native Android Gradle project & wrapper |
| `web/` | Frontend web application interface and assets |

---

## ⚙️ 3. Executable Verification Pipeline

Before marking any task complete, an AI agent **must** run the following verification steps sequentially:

### Tier 1: Web Interface Syntax & Local Server
```bash
# Verify HTML, JS, and CSS files under web/
python3 -m http.server 8000 --directory web &
PID=$!; sleep 1; kill $PID
```

### Tier 2: Android Build Check (if Android SDK is active)
```bash
cd android && ./gradlew assembleDebug
```

---

## 🛡️ 4. Architectural Invariants & Non-Negotiable Rules

### Strict Invariants ("Never Do" List):
1. **Documentation Integrity:** Preserve all existing comments, docstrings, and license headers. Never truncate context.
2. **Clean Atomic Diffs:** Keep git commits minimal, focused, and verified.

### Security & Environment Variables:
- All API keys and secrets must be loaded strictly from environment variables.
- Never commit `.env`, `.pem`, token files, or private credentials.

---

## 🤖 5. Autonomous Agent Operational Protocol

When dispatched to resolve an issue, implement a feature, or refactor code in this repo:

1. **Phase 1 — Explore & Plan:**
   - Read this `AGENTS.md` and relevant source files.
   - Check existing tests to establish the baseline.
2. **Phase 2 — Act (Surgical Implementation):**
   - Implement changes with minimal blast radius.
   - Adhere to the established code style and existing conventions.
3. **Phase 3 — Verify:**
   - Run the Tier 1, 2, and 3 verification commands listed above.
   - Ensure all existing and new tests pass cleanly.
4. **Phase 4 — Reflect:**
   - Review `git diff` to confirm zero unintended whitespace or collateral changes.
   - Confirm no untracked scratch files remain.

---
*Maintained by Ayyappa Pravin • Engineered for Antigravity, Claude, Cursor & Modern Autonomous AI Agents.*

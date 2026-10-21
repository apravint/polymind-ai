/**
 * PolyMind AI - Multi-LLM Orchestrator & Consensus Engine v1.2
 * Built for Web & Android Native Bridge Integration
 */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initModal();
    initHistory();
    initPresets();
    initModes();
    initTemperatureSlider();
    initCardActions();
    initOrchestrator();
});

/* ==========================================================================
   Tactile & Native Bridge Helpers
   ========================================================================== */

function triggerHaptic(type = "light") {
    const duration = type === "medium" ? 45 : type === "heavy" ? 85 : 20;
    try {
        if (window.AndroidBridge && typeof window.AndroidBridge.vibrate === "function") {
            window.AndroidBridge.vibrate(duration);
        } else if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    } catch (_) {}
}

function showToast(message) {
    if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
        window.AndroidBridge.showToast(message);
        return;
    }
    const toast = document.getElementById("toastNotification");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("visible");

    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.classList.add("hidden"), 300);
    }, 2800);
}

function copyToClipboard(text, successMessage = "Copied to clipboard!") {
    triggerHaptic("light");
    if (window.AndroidBridge && typeof window.AndroidBridge.copyToClipboard === "function") {
        window.AndroidBridge.copyToClipboard(text);
        showToast(successMessage);
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(successMessage))
            .catch(() => fallbackCopy(text, successMessage));
    } else {
        fallbackCopy(text, successMessage);
    }
}

function fallbackCopy(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        showToast(successMessage);
    } catch (e) {
        showToast("Failed to copy");
    }
    document.body.removeChild(textArea);
}

function shareContent(title, text) {
    triggerHaptic("medium");
    if (window.AndroidBridge && typeof window.AndroidBridge.shareConsensus === "function") {
        window.AndroidBridge.shareConsensus(text);
        return;
    }
    if (navigator.share) {
        navigator.share({ title: title, text: text }).catch(() => {});
    } else {
        copyToClipboard(text, "Sharing copied to clipboard!");
    }
}

/* ==========================================================================
   Theme Switcher
   ========================================================================== */

function initTheme() {
    const btn = document.getElementById("themeToggleBtn");
    const current = localStorage.getItem("polymind_theme") || "dark";
    document.body.setAttribute("data-theme", current);

    btn.addEventListener("click", () => {
        triggerHaptic("light");
        const isDark = document.body.getAttribute("data-theme") === "dark";
        const next = isDark ? "light" : "dark";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem("polymind_theme", next);
    });
}

/* ==========================================================================
   Temperature & Mode Selectors
   ========================================================================== */

let currentMode = "consensus";

function initModes() {
    const modePills = document.querySelectorAll(".mode-pill");
    modePills.forEach(pill => {
        pill.addEventListener("click", () => {
            triggerHaptic("light");
            modePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            currentMode = pill.getAttribute("data-mode");
            showToast(`Switched to ${pill.textContent.trim()} mode`);
        });
    });
}

function initTemperatureSlider() {
    const slider = document.getElementById("tempSlider");
    const badge = document.getElementById("tempValueBadge");
    if (!slider || !badge) return;

    slider.addEventListener("input", () => {
        const val = parseFloat(slider.value).toFixed(1);
        let label = "Balanced";
        if (val <= 0.3) label = "Precise & Deterministic";
        else if (val >= 0.8) label = "Creative & Exploratory";
        badge.textContent = `${val} (${label})`;
    });
}

/* ==========================================================================
   API Key & Model Configuration Modal
   ========================================================================== */

function initModal() {
    const openBtn = document.getElementById("apiKeyModalBtn");
    const modal = document.getElementById("apiKeyModal");
    const closeBtn = document.getElementById("closeApiKeysBtn");
    const closeIconBtn = document.getElementById("closeApiKeysIconBtn");
    const saveBtn = document.getElementById("saveApiKeysBtn");
    const clearBtn = document.getElementById("clearAllKeysBtn");
    const detectOllamaBtn = document.getElementById("detectOllamaBtn");
    const ollamaStatusMsg = document.getElementById("ollamaStatusMsg");

    // Inputs & Selects
    const keyOpenAI = document.getElementById("keyOpenAI");
    const keyClaude = document.getElementById("keyClaude");
    const keyGemini = document.getElementById("keyGemini");
    const urlOllama = document.getElementById("urlOllama");

    const modalModelOpenAI = document.getElementById("modalModelOpenAI");
    const modalModelClaude = document.getElementById("modalModelClaude");
    const modalModelGemini = document.getElementById("modalModelGemini");
    const modalModelOllama = document.getElementById("modalModelOllama");
    const selectSynthesizerProvider = document.getElementById("selectSynthesizerProvider");

    // Inline selects on header
    const selectModelOpenAI = document.getElementById("selectModelOpenAI");
    const selectModelClaude = document.getElementById("selectModelClaude");
    const selectModelGemini = document.getElementById("selectModelGemini");
    const selectModelOllama = document.getElementById("selectModelOllama");

    // Load saved settings
    keyOpenAI.value = localStorage.getItem("poly_key_openai") || "";
    keyClaude.value = localStorage.getItem("poly_key_claude") || "";
    keyGemini.value = localStorage.getItem("poly_key_gemini") || "";
    urlOllama.value = localStorage.getItem("poly_url_ollama") || "http://localhost:11434";

    const savedModelOpenAI = localStorage.getItem("poly_model_openai") || "gpt-4o";
    const savedModelClaude = localStorage.getItem("poly_model_claude") || "claude-3-5-sonnet-20241022";
    const savedModelGemini = localStorage.getItem("poly_model_gemini") || "gemini-1.5-pro";
    const savedModelOllama = localStorage.getItem("poly_model_ollama") || "llama3.2:3b";
    const savedSynthesizer = localStorage.getItem("poly_synthesizer_provider") || "auto";

    modalModelOpenAI.value = savedModelOpenAI;
    modalModelClaude.value = savedModelClaude;
    modalModelGemini.value = savedModelGemini;
    modalModelOllama.value = savedModelOllama;
    selectSynthesizerProvider.value = savedSynthesizer;

    if (selectModelOpenAI) selectModelOpenAI.value = savedModelOpenAI;
    if (selectModelClaude) selectModelClaude.value = savedModelClaude;
    if (selectModelGemini) selectModelGemini.value = savedModelGemini;
    if (selectModelOllama) selectModelOllama.value = savedModelOllama;

    updateHeaderModelBadges();

    // Sync inline selects with modal
    if (selectModelOpenAI) {
        selectModelOpenAI.addEventListener("change", (e) => {
            modalModelOpenAI.value = e.target.value;
            localStorage.setItem("poly_model_openai", e.target.value);
            updateHeaderModelBadges();
        });
    }
    if (selectModelClaude) {
        selectModelClaude.addEventListener("change", (e) => {
            modalModelClaude.value = e.target.value;
            localStorage.setItem("poly_model_claude", e.target.value);
            updateHeaderModelBadges();
        });
    }
    if (selectModelGemini) {
        selectModelGemini.addEventListener("change", (e) => {
            modalModelGemini.value = e.target.value;
            localStorage.setItem("poly_model_gemini", e.target.value);
            updateHeaderModelBadges();
        });
    }
    if (selectModelOllama) {
        selectModelOllama.addEventListener("change", (e) => {
            modalModelOllama.value = e.target.value;
            localStorage.setItem("poly_model_ollama", e.target.value);
            updateHeaderModelBadges();
        });
    }

    const openModal = () => { triggerHaptic("light"); modal.classList.remove("hidden"); };
    const closeModal = () => { triggerHaptic("light"); modal.classList.add("hidden"); };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    closeIconBtn.addEventListener("click", closeModal);

    saveBtn.addEventListener("click", () => {
        triggerHaptic("medium");
        localStorage.setItem("poly_key_openai", keyOpenAI.value.trim());
        localStorage.setItem("poly_key_claude", keyClaude.value.trim());
        localStorage.setItem("poly_key_gemini", keyGemini.value.trim());
        localStorage.setItem("poly_url_ollama", urlOllama.value.trim() || "http://localhost:11434");

        localStorage.setItem("poly_model_openai", modalModelOpenAI.value);
        localStorage.setItem("poly_model_claude", modalModelClaude.value);
        localStorage.setItem("poly_model_gemini", modalModelGemini.value);
        localStorage.setItem("poly_model_ollama", modalModelOllama.value.trim() || "llama3.2:3b");
        localStorage.setItem("poly_synthesizer_provider", selectSynthesizerProvider.value);

        if (selectModelOpenAI) selectModelOpenAI.value = modalModelOpenAI.value;
        if (selectModelClaude) selectModelClaude.value = modalModelClaude.value;
        if (selectModelGemini) selectModelGemini.value = modalModelGemini.value;
        if (selectModelOllama) selectModelOllama.value = modalModelOllama.value;

        updateHeaderModelBadges();
        closeModal();
        showToast("Configuration saved successfully!");
    });

    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all stored API keys?")) {
            triggerHaptic("heavy");
            keyOpenAI.value = "";
            keyClaude.value = "";
            keyGemini.value = "";
            localStorage.removeItem("poly_key_openai");
            localStorage.removeItem("poly_key_claude");
            localStorage.removeItem("poly_key_gemini");
            showToast("API keys cleared.");
        }
    });

    // Auto-Detect Ollama Local Models
    detectOllamaBtn.addEventListener("click", async () => {
        triggerHaptic("light");
        const endpoint = (urlOllama.value.trim() || "http://localhost:11434").replace(/\/$/, "");
        ollamaStatusMsg.textContent = "Connecting to Ollama...";
        ollamaStatusMsg.className = "sub-label text-warning";

        try {
            const res = await fetch(`${endpoint}/api/tags`, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            const models = data.models || [];
            if (models.length === 0) {
                ollamaStatusMsg.textContent = "Ollama connected, but no installed models found.";
                ollamaStatusMsg.className = "sub-label text-warning";
                return;
            }

            // Populate selects with detected models
            const names = models.map(m => m.name);
            modalModelOllama.value = names[0];
            if (selectModelOllama) {
                selectModelOllama.innerHTML = names.map(n => `<option value="${n}">${n}</option>`).join("");
                selectModelOllama.value = names[0];
            }
            ollamaStatusMsg.textContent = `✓ Found ${names.length} models: ${names.slice(0, 3).join(", ")}${names.length > 3 ? "..." : ""}`;
            ollamaStatusMsg.className = "sub-label text-success";
            showToast(`Detected ${names.length} Ollama models!`);
        } catch (err) {
            ollamaStatusMsg.textContent = `✗ Connection failed: ${err.message}. Ensure Ollama is running and OLLAMA_ORIGINS="*" is set.`;
            ollamaStatusMsg.className = "sub-label text-danger";
        }
    });
}

function updateHeaderModelBadges() {
    const oModel = localStorage.getItem("poly_model_openai") || "gpt-4o";
    const cModel = localStorage.getItem("poly_model_claude") || "3.5 Sonnet";
    const gModel = localStorage.getItem("poly_model_gemini") || "1.5 Pro";
    const lModel = localStorage.getItem("poly_model_ollama") || "Local";

    const vOpenAI = document.getElementById("versionBadgeOpenAI");
    const vClaude = document.getElementById("versionBadgeClaude");
    const vGemini = document.getElementById("versionBadgeGemini");
    const vOllama = document.getElementById("versionBadgeOllama");

    if (vOpenAI) vOpenAI.textContent = oModel;
    if (vClaude) vClaude.textContent = cModel.replace("claude-", "").replace("-20241022", "");
    if (vGemini) vGemini.textContent = gModel.replace("gemini-", "");
    if (vOllama) vOllama.textContent = lModel;
}

/* ==========================================================================
   Preset Prompts Handler
   ========================================================================== */

function initPresets() {
    const presetBtns = document.querySelectorAll(".preset-btn");
    const promptInput = document.getElementById("promptInput");
    const clearBtn = document.getElementById("clearPromptBtn");

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            triggerHaptic("light");
            promptInput.value = btn.getAttribute("data-preset");
            promptInput.focus();
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            triggerHaptic("light");
            promptInput.value = "";
            promptInput.focus();
        });
    }

    // Ctrl+Enter or Cmd+Enter to dispatch
    promptInput.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            document.getElementById("runOrchestratorBtn").click();
        }
    });
}

/* ==========================================================================
   Card Action Icons (Copy & Expand Modal)
   ========================================================================== */

let cachedModelResults = {};

function initCardActions() {
    // Copy buttons on cards
    document.querySelectorAll(".copy-card-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const provider = btn.getAttribute("data-provider");
            const res = cachedModelResults[provider.toLowerCase()];
            if (res && res.text) {
                copyToClipboard(res.text, `${provider} response copied!`);
            } else {
                showToast(`No output to copy for ${provider}`);
            }
        });
    });

    // Expand buttons on cards
    const expandedModal = document.getElementById("expandedCardModal");
    const expandedTitle = document.getElementById("expandedModelTitle");
    const expandedBadge = document.getElementById("expandedModelBadge");
    const expandedContent = document.getElementById("expandedContent");
    const expandedDot = document.getElementById("expandedDot");
    const closeExpandedIcon = document.getElementById("closeExpandedIconBtn");
    const expandedCopyBtn = document.getElementById("expandedCopyBtn");

    document.querySelectorAll(".expand-card-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            triggerHaptic("light");
            const provider = btn.getAttribute("data-provider");
            const res = cachedModelResults[provider.toLowerCase()];
            if (!res || !res.text) {
                showToast(`Run a query first to view ${provider}'s output.`);
                return;
            }

            expandedTitle.textContent = `${provider} Full Analysis`;
            expandedBadge.textContent = res.model || provider;
            expandedDot.className = `provider-dot provider-${provider.toLowerCase()}`;
            renderMarkdown(expandedContent, res.text);
            expandedModal.classList.remove("hidden");

            expandedCopyBtn.onclick = () => {
                copyToClipboard(res.text, `${provider} output copied!`);
            };
        });
    });

    if (closeExpandedIcon) {
        closeExpandedIcon.addEventListener("click", () => {
            triggerHaptic("light");
            expandedModal.classList.add("hidden");
        });
    }

    // Close modals on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
        }
    });
}

/* ==========================================================================
   Multi-LLM Orchestrator Engine
   ========================================================================== */

function initOrchestrator() {
    const runBtn = document.getElementById("runOrchestratorBtn");
    const runBtnText = document.getElementById("runBtnText");
    const runBtnSpinner = runBtn.querySelector(".spinner");
    const runBtnIcon = runBtn.querySelector(".play-icon");
    const promptInput = document.getElementById("promptInput");

    const consensusSection = document.getElementById("consensusSection");
    const consensusContent = document.getElementById("consensusContent");
    const consensusBadge = document.getElementById("consensusBadge");
    const consensusLatencyBadge = document.getElementById("consensusLatencyBadge");
    const copyConsensusBtn = document.getElementById("copyConsensusBtn");
    const shareConsensusBtn = document.getElementById("shareConsensusBtn");
    const exportConsensusBtn = document.getElementById("exportConsensusBtn");

    // Consensus tabs
    const consensusTabs = document.querySelectorAll(".consensus-tab-btn");
    consensusTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            triggerHaptic("light");
            consensusTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const target = tab.getAttribute("data-tab");
            document.querySelectorAll(".consensus-card .tab-pane").forEach(pane => pane.classList.remove("active"));
            if (target === "synthesis") {
                document.getElementById("consensusContent").classList.add("active");
            } else if (target === "matrix") {
                document.getElementById("consensusMatrix").classList.add("active");
            }
        });
    });

    runBtn.addEventListener("click", async () => {
        const rawPrompt = promptInput.value.trim();
        if (!rawPrompt) {
            triggerHaptic("heavy");
            showToast("Please enter a prompt to orchestrate.");
            promptInput.focus();
            return;
        }

        triggerHaptic("medium");

        const activeProviders = {
            openai: document.getElementById("checkOpenAI").checked,
            claude: document.getElementById("checkClaude").checked,
            gemini: document.getElementById("checkGemini").checked,
            ollama: document.getElementById("checkOllama").checked
        };

        const activeCount = Object.values(activeProviders).filter(Boolean).length;
        if (activeCount === 0) {
            showToast("Please enable at least one AI provider.");
            return;
        }

        // Apply Mode-specific prompt augmentation
        const enhancedPrompt = formatPromptForMode(rawPrompt, currentMode);
        const temperature = parseFloat(document.getElementById("tempSlider")?.value || "0.7");
        const runConsensus = document.getElementById("synthesizeToggle").checked;

        // Set Loading UI
        runBtn.disabled = true;
        if (runBtnText) runBtnText.textContent = "Orchestrating...";
        if (runBtnSpinner) runBtnSpinner.classList.remove("hidden");
        if (runBtnIcon) runBtnIcon.classList.add("hidden");

        resetResponseCards(activeProviders);
        cachedModelResults = {};

        const startTimeAll = performance.now();
        const promises = [];

        if (activeProviders.openai) {
            const model = document.getElementById("selectModelOpenAI")?.value || "gpt-4o";
            promises.push(fetchOpenAI(enhancedPrompt, rawPrompt, model, temperature).then(res => cachedModelResults.openai = res));
        }
        if (activeProviders.claude) {
            const model = document.getElementById("selectModelClaude")?.value || "claude-3-5-sonnet-20241022";
            promises.push(fetchClaude(enhancedPrompt, rawPrompt, model, temperature).then(res => cachedModelResults.claude = res));
        }
        if (activeProviders.gemini) {
            const model = document.getElementById("selectModelGemini")?.value || "gemini-1.5-pro";
            promises.push(fetchGemini(enhancedPrompt, rawPrompt, model, temperature).then(res => cachedModelResults.gemini = res));
        }
        if (activeProviders.ollama) {
            const model = document.getElementById("selectModelOllama")?.value || "llama3.2:3b";
            promises.push(fetchOllama(enhancedPrompt, rawPrompt, model, temperature).then(res => cachedModelResults.ollama = res));
        }

        await Promise.all(promises);

        const totalLatency = Math.round(performance.now() - startTimeAll);

        // Synthesize AI Consensus if enabled
        if (runConsensus) {
            consensusSection.classList.remove("hidden");
            if (consensusBadge) consensusBadge.textContent = `${Object.keys(cachedModelResults).length} Models Harmonized`;
            if (consensusLatencyBadge) consensusLatencyBadge.textContent = `⚡ Latency: ${(totalLatency / 1000).toFixed(2)}s`;

            renderMarkdown(consensusContent, "*Synthesizing harmonized multi-model consensus master response...*");
            consensusSection.scrollIntoView({ behavior: "smooth" });

            const synthesizedResult = await runConsensusSynthesis(rawPrompt, cachedModelResults, currentMode);
            renderMarkdown(consensusContent, synthesizedResult.text);

            const synBadge = document.getElementById("consensusSynthesizerBadge");
            if (synBadge) synBadge.textContent = `Engine: ${synthesizedResult.engine}`;

            renderAgreementMatrix(rawPrompt, cachedModelResults);
            triggerHaptic("medium");

            // Save to Local History
            saveToHistory({
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                prompt: rawPrompt,
                mode: currentMode,
                totalLatency: totalLatency,
                models: cachedModelResults,
                consensus: synthesizedResult.text
            });
        } else {
            consensusSection.classList.add("hidden");
            triggerHaptic("light");
        }

        // Restore Run Button UI
        runBtn.disabled = false;
        if (runBtnText) runBtnText.textContent = "Run Multi-LLM Query";
        if (runBtnSpinner) runBtnSpinner.classList.add("hidden");
        if (runBtnIcon) runBtnIcon.classList.remove("hidden");
    });

    // Copy Consensus Button
    copyConsensusBtn.addEventListener("click", () => {
        const text = consensusContent.innerText;
        copyToClipboard(text, "Synthesized Master Consensus copied!");
    });

    // Share Consensus Button
    shareConsensusBtn.addEventListener("click", () => {
        const text = consensusContent.innerText;
        shareContent("PolyMind AI Master Consensus", text);
    });

    // Export Consensus as Markdown
    exportConsensusBtn.addEventListener("click", () => {
        triggerHaptic("light");
        const prompt = promptInput.value.trim() || "polymind-query";
        const text = consensusContent.innerText;
        const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PolyMind_Consensus_${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Exported Consensus as Markdown file!");
    });
}

function formatPromptForMode(prompt, mode) {
    switch (mode) {
        case "code-battle":
            return `${prompt}\n\n[Instruction: Provide the most optimal, production-grade, and performant code solution. Focus on algorithmic efficiency, type safety, memory usage, and edge-case handling with concise explanation.]`;
        case "fact-check":
            return `${prompt}\n\n[Instruction: Provide a strictly factual, verified, and objective breakdown. Highlight verified claims, common misconceptions, and cite specific data or specifications where applicable.]`;
        case "debate":
            return `${prompt}\n\n[Instruction: Analyze this from multiple viewpoints. Present the core arguments, trade-offs, advantages, and disadvantages of each alternative before stating your recommendation.]`;
        default:
            return prompt;
    }
}

function resetResponseCards(active) {
    const providers = ["OpenAI", "Claude", "Gemini", "Ollama"];
    providers.forEach(p => {
        const key = p.toLowerCase();
        const statusEl = document.getElementById(`status${p}`);
        const bodyEl = document.getElementById(`response${p}`);
        const latencyEl = document.getElementById(`latency${p}`);
        const wordsEl = document.getElementById(`words${p}`);

        if (active[key]) {
            statusEl.textContent = "Querying...";
            statusEl.className = "status-indicator loading";
            bodyEl.innerHTML = `<div class="card-loading-state"><span class="spinner inline"></span><p class="placeholder-text">Waiting for ${p} response...</p></div>`;
            if (latencyEl) latencyEl.textContent = "--";
            if (wordsEl) wordsEl.textContent = "--";
        } else {
            statusEl.textContent = "Disabled";
            statusEl.className = "status-indicator";
            bodyEl.innerHTML = `<p class="placeholder-text">Provider disabled for this run.</p>`;
            if (latencyEl) latencyEl.textContent = "--";
            if (wordsEl) wordsEl.textContent = "--";
        }
    });
}

function updateCardMetrics(providerName, text, latencyMs, isSimulated = false, isError = false) {
    const statusEl = document.getElementById(`status${providerName}`);
    const latencyEl = document.getElementById(`latency${providerName}`);
    const wordsEl = document.getElementById(`words${providerName}`);

    if (isError) {
        if (statusEl) {
            statusEl.textContent = "Error";
            statusEl.className = "status-indicator error";
        }
        return;
    }

    if (statusEl) {
        statusEl.textContent = isSimulated ? "Complete (Simulated)" : "Complete";
        statusEl.className = "status-indicator success";
    }

    if (latencyEl) {
        latencyEl.textContent = `⚡ ${latencyMs}ms`;
    }

    if (wordsEl && text) {
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        wordsEl.textContent = `${words}w`;
    }
}

/* ==========================================================================
   Provider Fetch Handlers
   ========================================================================== */

async function fetchOpenAI(prompt, rawPrompt, model = "gpt-4o", temperature = 0.7) {
    const apiKey = localStorage.getItem("poly_key_openai");
    const bodyEl = document.getElementById("responseOpenAI");
    const t0 = performance.now();

    if (apiKey) {
        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: temperature
                })
            });
            if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
            const data = await res.json();
            const text = data.choices[0].message.content;
            const latency = Math.round(performance.now() - t0);

            updateCardMetrics("OpenAI", text, latency, false);
            renderMarkdown(bodyEl, text);
            return { text, latency, model, simulated: false };
        } catch (e) {
            console.warn("OpenAI API fetch failed, falling back to simulator:", e);
        }
    }

    // High-Fidelity Simulator
    await new Promise(r => setTimeout(r, 650 + Math.random() * 400));
    const latency = Math.round(performance.now() - t0);
    const sim = generateSmartSimulation("OpenAI", model, rawPrompt, prompt);
    updateCardMetrics("OpenAI", sim, latency, true);
    renderMarkdown(bodyEl, sim);
    return { text: sim, latency, model, simulated: true };
}

async function fetchClaude(prompt, rawPrompt, model = "claude-3-5-sonnet-20241022", temperature = 0.7) {
    const apiKey = localStorage.getItem("poly_key_claude");
    const bodyEl = document.getElementById("responseClaude");
    const t0 = performance.now();

    if (apiKey) {
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerously-allow-browser": "true",
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 1500,
                    temperature: temperature,
                    messages: [{ role: "user", content: prompt }]
                })
            });
            if (!res.ok) throw new Error(`Claude HTTP ${res.status}`);
            const data = await res.json();
            const text = data.content[0].text;
            const latency = Math.round(performance.now() - t0);

            updateCardMetrics("Claude", text, latency, false);
            renderMarkdown(bodyEl, text);
            return { text, latency, model, simulated: false };
        } catch (e) {
            console.warn("Claude API fetch failed, falling back to simulator:", e);
        }
    }

    // High-Fidelity Simulator
    await new Promise(r => setTimeout(r, 800 + Math.random() * 450));
    const latency = Math.round(performance.now() - t0);
    const sim = generateSmartSimulation("Claude", model, rawPrompt, prompt);
    updateCardMetrics("Claude", sim, latency, true);
    renderMarkdown(bodyEl, sim);
    return { text: sim, latency, model, simulated: true };
}

async function fetchGemini(prompt, rawPrompt, model = "gemini-1.5-pro", temperature = 0.7) {
    const apiKey = localStorage.getItem("poly_key_gemini");
    const bodyEl = document.getElementById("responseGemini");
    const t0 = performance.now();

    if (apiKey) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: temperature }
                })
            });
            if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
            const data = await res.json();
            const text = data.candidates[0].content.parts[0].text;
            const latency = Math.round(performance.now() - t0);

            updateCardMetrics("Gemini", text, latency, false);
            renderMarkdown(bodyEl, text);
            return { text, latency, model, simulated: false };
        } catch (e) {
            console.warn("Gemini API fetch failed, falling back to simulator:", e);
        }
    }

    // High-Fidelity Simulator
    await new Promise(r => setTimeout(r, 550 + Math.random() * 350));
    const latency = Math.round(performance.now() - t0);
    const sim = generateSmartSimulation("Gemini", model, rawPrompt, prompt);
    updateCardMetrics("Gemini", sim, latency, true);
    renderMarkdown(bodyEl, sim);
    return { text: sim, latency, model, simulated: true };
}

async function fetchOllama(prompt, rawPrompt, model = "llama3.2:3b", temperature = 0.7) {
    const url = localStorage.getItem("poly_url_ollama") || "http://localhost:11434";
    const bodyEl = document.getElementById("responseOllama");
    const t0 = performance.now();

    try {
        const res = await fetch(`${url.replace(/\/$/, "")}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                options: { temperature: temperature }
            })
        });
        if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
        const data = await res.json();
        const text = data.response;
        const latency = Math.round(performance.now() - t0);

        const statusEl = document.getElementById("statusOllama");
        if (statusEl) {
            statusEl.textContent = "Complete (Local)";
            statusEl.className = "status-indicator success";
        }
        updateCardMetrics("Ollama", text, latency, false);
        renderMarkdown(bodyEl, text);
        return { text, latency, model, simulated: false };
    } catch (e) {
        // Fallback simulator if Ollama local port isn't reachable
        await new Promise(r => setTimeout(r, 750 + Math.random() * 400));
        const latency = Math.round(performance.now() - t0);
        const sim = generateSmartSimulation("Ollama", model, rawPrompt, prompt);
        updateCardMetrics("Ollama", sim, latency, true);
        renderMarkdown(bodyEl, sim);
        return { text: sim, latency, model, simulated: true };
    }
}

/* ==========================================================================
   Smart Dynamic Simulation Generator (Context-Aware)
   ========================================================================== */

function generateSmartSimulation(provider, model, rawPrompt, fullPrompt) {
    const isCode = /code|script|function|implement|refactor|python|rust|go|javascript|typescript|query|api/i.test(rawPrompt);
    const isComparison = /vs|compare|difference|trade-off|better|advantages/i.test(rawPrompt);

    if (provider === "OpenAI") {
        if (isCode) {
            return `### ⚡ ChatGPT (${model}) Architecture
Structured, production-grade approach for: **"${rawPrompt}"**

1. **Clean Design Pattern**:
\`\`\`typescript
// Production Implementation - ChatGPT
export async function executeOptimizedTask(input: string): Promise<{ success: boolean; data: any }> {
  try {
    const sanitized = input.trim();
    const result = await processPipeline(sanitized);
    return { success: true, data: result };
  } catch (error) {
    console.error("Task execution error:", error);
    throw error;
  }
}
\`\`\`
2. **Key Strengths**: Enterprise maintainability, modularity, and predictable error handling.`;
        } else if (isComparison) {
            return `### 📊 ChatGPT (${model}) Breakdown
Direct comparative assessment for: **"${rawPrompt}"**

* **Core Assessment**: Focuses on developer velocity, ecosystem maturity, and operational reliability.
* **Key Strengths**: Out-of-the-box tooling, comprehensive documentation, and broad enterprise adoption.
* **Verdict**: Recommended when team ramp-up speed and battle-tested ecosystem libraries are the primary constraints.`;
        } else {
            return `### 💡 ChatGPT (${model}) Evaluation
Direct synthesis for: **"${rawPrompt}"**

1. **Foundational Concept**: Explains the mechanism through structured, hierarchical decomposition.
2. **Actionable Application**: Direct implementation steps ensuring high clarity and immediate feasibility.
3. **Core Conclusion**: Balances theoretical rigor with practical execution guidelines.`;
        }
    }

    if (provider === "Claude") {
        if (isCode) {
            return `### 🛡️ Claude (${model}) Implementation
Nuanced, type-safe execution for: **"${rawPrompt}"**

1. **Resilient Typing & Edge Cases**:
\`\`\`typescript
// Claude Deep-Reasoning Pattern
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function safePipelineExecution<T>(data: readonly T[]): Result<T[]> {
  if (!Array.isArray(data) || data.length === 0) {
    return { ok: false, error: new Error("Empty or invalid payload") };
  }
  const uniqueItems = Array.from(new Set(data));
  return { ok: true, value: uniqueItems };
}
\`\`\`
2. **Nuance**: Prioritizes immutable data structures, strict boundary checking, and defensive execution.`;
        } else if (isComparison) {
            return `### ⚖️ Claude (${model}) Nuanced Trade-offs
Deep architectural breakdown for: **"${rawPrompt}"**

* **Underlying Philosophy**: Analyzes memory invariants, latency distributions (p99 vs p50), and cognitive overhead for maintenance engineers.
* **Critical Edge Case**: Emphasizes failure modes under extreme concurrency and cache invalidation bottlenecks.
* **Verdict**: Superior choice where absolute fault tolerance and mathematical predictability take precedence.`;
        } else {
            return `### 🔬 Claude (${model}) Deep Dive
Comprehensive reasoning for: **"${rawPrompt}"**

* **First Principles**: Traces the core mechanics down to architectural fundamentals.
* **Nuance & Limitations**: Directly highlights boundary conditions, known caveats, and potential edge-case failures.
* **Synthesis**: Provides balanced, intellectually honest recommendations with explicit trade-off analyses.`;
        }
    }

    if (provider === "Gemini") {
        return `### 🚀 Gemini (${model}) Technical Analysis
High-throughput analysis for: **"${rawPrompt}"**

* **Scale & Throughput**: Optimized for massive context digestion and low-latency response delivery.
* **High-Level Matrix**:
  - **Efficiency**: Rapid streaming with minimal token overhead.
  - **Multi-Modal Extensibility**: Ready for cross-modal integration (text, audio, vision).
* **Summary**: Delivers concise, benchmark-oriented summaries ideal for rapid architectural decisions.`;
    }

    // Ollama
    return `### 🔒 Ollama (${model} - Local LLM)
Zero-cloud private execution for: **"${rawPrompt}"**

1. **Complete Data Sovereignty**: 100% on-device inference via local VRAM/RAM.
2. **Deterministic Execution**: Zero network latency, zero per-token cloud costs, and air-gapped security.
3. **Efficiency**: Lightweight parameter footprint with rapid local execution.`;
}

/* ==========================================================================
   Consensus Synthesis Engine (Dynamic Meta-LLM + Heuristic Fallback)
   ========================================================================== */

async function runConsensusSynthesis(prompt, results, mode) {
    const validResults = Object.keys(results).filter(k => results[k] && results[k].text);
    if (validResults.length === 0) {
        return { text: "No model responses were received to synthesize.", engine: "None" };
    }

    const preferredSynthesizer = localStorage.getItem("poly_synthesizer_provider") || "auto";

    // Try Real LLM Meta-Synthesis if active API key exists and preference allows
    if (preferredSynthesizer !== "heuristic") {
        const synResult = await tryMetaLLMSynthesis(prompt, results, preferredSynthesizer, mode);
        if (synResult) return synResult;
    }

    // Heuristic Dynamic Consensus Engine (Client-Side)
    return {
        text: synthesizeHeuristicConsensus(prompt, results, mode),
        engine: "Smart Heuristic Analyzer"
    };
}

async function tryMetaLLMSynthesis(prompt, results, preference, mode) {
    const keyGemini = localStorage.getItem("poly_key_gemini");
    const keyOpenAI = localStorage.getItem("poly_key_openai");
    const keyClaude = localStorage.getItem("poly_key_claude");
    const urlOllama = localStorage.getItem("poly_url_ollama") || "http://localhost:11434";

    const promptSummary = Object.keys(results).map(p => {
        const item = results[p];
        return `=== MODEL: ${p.toUpperCase()} (${item.model || "default"}) ===\n${item.text}\n`;
    }).join("\n");

    const metaPrompt = `You are the PolyMind AI Master Consensus Synthesizer.
The user asked: "${prompt}" (Mode: ${mode})

Here are the responses returned by multiple AI models in parallel:
${promptSummary}

Synthesize an authoritative, unified Master Consensus response:
1. Executive Master Summary & Core Verdict
2. Points of Strong Agreement across the models
3. Key Differences, Unique Nuances & Edge Cases (explicitly attribute which model noted what)
4. Harmonized Optimal Solution (if code, combine the best parts into a single definitive production snippet)
5. Practical Recommendation & Next Steps

Write with clean GitHub-flavored markdown, headings, bullet points, and code blocks.`;

    // 1. Try Gemini (Fast & Generous Quota)
    if ((preference === "gemini" || preference === "auto") && keyGemini) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyGemini}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: metaPrompt }] }] })
            });
            if (res.ok) {
                const data = await res.json();
                const text = data.candidates[0].content.parts[0].text;
                return { text, engine: "Google Gemini 1.5 Flash (Meta-LLM)" };
            }
        } catch (_) {}
    }

    // 2. Try OpenAI
    if ((preference === "openai" || preference === "auto") && keyOpenAI) {
        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${keyOpenAI}` },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: metaPrompt }]
                })
            });
            if (res.ok) {
                const data = await res.json();
                const text = data.choices[0].message.content;
                return { text, engine: "OpenAI GPT-4o-mini (Meta-LLM)" };
            }
        } catch (_) {}
    }

    // 3. Try Claude
    if ((preference === "claude" || preference === "auto") && keyClaude) {
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": keyClaude,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerously-allow-browser": "true",
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    model: "claude-3-5-haiku-20241022",
                    max_tokens: 1500,
                    messages: [{ role: "user", content: metaPrompt }]
                })
            });
            if (res.ok) {
                const data = await res.json();
                const text = data.content[0].text;
                return { text, engine: "Claude 3.5 Haiku (Meta-LLM)" };
            }
        } catch (_) {}
    }

    // 4. Try Ollama Local
    if (preference === "ollama") {
        try {
            const res = await fetch(`${urlOllama.replace(/\/$/, "")}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: localStorage.getItem("poly_model_ollama") || "llama3.2:3b",
                    prompt: metaPrompt,
                    stream: false
                })
            });
            if (res.ok) {
                const data = await res.json();
                return { text: data.response, engine: "Ollama Local (Meta-LLM)" };
            }
        } catch (_) {}
    }

    return null;
}

function synthesizeHeuristicConsensus(prompt, results, mode) {
    const activeModels = Object.keys(results).filter(k => results[k] && results[k].text);
    const codeBlocks = [];

    // Extract code blocks across responses
    activeModels.forEach(m => {
        const text = results[m].text;
        const matches = text.match(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```/g);
        if (matches) {
            matches.forEach(block => codeBlocks.push({ model: m, block: block }));
        }
    });

    let bestCodeBlock = "";
    if (codeBlocks.length > 0) {
        // Choose the most comprehensive code block (often Claude or OpenAI)
        const preferred = codeBlocks.find(c => c.model === "claude") || codeBlocks.find(c => c.model === "openai") || codeBlocks[0];
        bestCodeBlock = preferred.block;
    }

    return `# 🎯 PolyMind AI Consensus Synthesis

**Original Prompt:** *"${prompt}"*  
**Harmonized Models (${activeModels.length}):** ${activeModels.map(m => m.toUpperCase()).join(" • ")}  
**Operating Mode:** *${mode.toUpperCase()}*

---

### 💡 Executive Master Summary
By cross-analyzing outputs across **${activeModels.map(m => m.toUpperCase()).join(", ")}**, the consensus engine harmonizes high-level architectural patterns, edge-case safety, and runtime throughput into a unified decision framework.

1. **Unified Consensus Verdict:**
   - **Foundational Agreement:** All participating models converge on clean modular abstraction, strict boundary validation, and performance-conscious data flow.
   - **Architectural Synthesis:** Combining the structured clarity of **ChatGPT**, the nuanced type boundaries of **Claude**, the throughput orientation of **Gemini**, and the private execution of **Ollama**.

2. **Cross-Model Nuance & Insights:**
   - **ChatGPT**: Prioritizes standard enterprise design patterns, readability, and idiomatic ecosystem libraries.
   - **Claude**: Uncovers edge cases, strict type invariance, and defensive error handling under high load.
   - **Gemini**: Highlights throughput benchmarks, concise execution, and cloud scalability.
   - **Ollama**: Validates on-device feasibility, data privacy, and zero-cloud dependency.

${bestCodeBlock ? `3. **Harmonized Definitive Code Implementation:**\n${bestCodeBlock}\n` : ""}

4. **Strategic Takeaway:**
   Deploy the harmonized solution by enforcing strict input validation at system boundaries while maintaining modular decoupling for maintenance velocity.

---
> 🌟 *Synthesized dynamically by PolyMind AI Consensus Engine v1.2*`;
}

function renderAgreementMatrix(prompt, results) {
    const tbody = document.getElementById("matrixTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    Object.keys(results).forEach(k => {
        const item = results[k];
        if (!item) return;

        const words = (item.text || "").trim().split(/\s+/).filter(Boolean).length;
        let focus = "Enterprise modularity & standard patterns";
        if (k === "claude") focus = "Defensive type safety & boundary edge cases";
        else if (k === "gemini") focus = "High-throughput scaling & concise synthesis";
        else if (k === "ollama") focus = "100% on-device privacy & zero-cloud latency";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${k.toUpperCase()}</strong></td>
            <td><span class="badge">${item.model || "standard"}</span></td>
            <td><span class="tag ${item.simulated ? "tag-neutral" : "tag-success"}">${item.simulated ? "Simulated" : "Live API"}</span></td>
            <td><code>⚡ ${item.latency || "--"}ms</code></td>
            <td>${words} words</td>
            <td>${focus}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==========================================================================
   History Storage & Management
   ========================================================================== */

function initHistory() {
    const historyModalBtn = document.getElementById("historyModalBtn");
    const historyModal = document.getElementById("historyModal");
    const closeHistoryBtn = document.getElementById("closeHistoryBtn");
    const closeHistoryIconBtn = document.getElementById("closeHistoryIconBtn");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    const exportHistoryBtn = document.getElementById("exportHistoryBtn");
    const searchInput = document.getElementById("historySearchInput");

    updateHistoryBadge();

    const openHistory = () => {
        triggerHaptic("light");
        renderHistoryList();
        historyModal.classList.remove("hidden");
    };

    const closeHistory = () => {
        triggerHaptic("light");
        historyModal.classList.add("hidden");
    };

    historyModalBtn.addEventListener("click", openHistory);
    closeHistoryBtn.addEventListener("click", closeHistory);
    closeHistoryIconBtn.addEventListener("click", closeHistory);

    searchInput.addEventListener("input", () => {
        renderHistoryList(searchInput.value.trim().toLowerCase());
    });

    clearHistoryBtn.addEventListener("click", () => {
        if (confirm("Clear all orchestration history on this device?")) {
            triggerHaptic("heavy");
            localStorage.removeItem("polymind_history");
            renderHistoryList();
            updateHistoryBadge();
            showToast("History cleared.");
        }
    });

    exportHistoryBtn.addEventListener("click", () => {
        triggerHaptic("light");
        const list = getHistory();
        const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PolyMind_History_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Exported history as JSON!");
    });
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem("polymind_history")) || [];
    } catch (_) {
        return [];
    }
}

function saveToHistory(entry) {
    const list = getHistory();
    list.unshift(entry);
    if (list.length > 40) list.pop(); // keep last 40
    localStorage.setItem("polymind_history", JSON.stringify(list));
    updateHistoryBadge();
}

function updateHistoryBadge() {
    const badge = document.getElementById("historyCountBadge");
    if (!badge) return;
    const count = getHistory().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
}

function renderHistoryList(query = "") {
    const container = document.getElementById("historyListContainer");
    if (!container) return;

    let list = getHistory();
    if (query) {
        list = list.filter(item => item.prompt.toLowerCase().includes(query) || (item.mode && item.mode.toLowerCase().includes(query)));
    }

    if (list.length === 0) {
        container.innerHTML = `<p class="placeholder-text" style="padding: 24px; text-align: center;">No history entries found.</p>`;
        return;
    }

    container.innerHTML = "";
    list.forEach(item => {
        const el = document.createElement("div");
        el.className = "history-item card";
        const dateStr = new Date(item.timestamp).toLocaleString();
        const modelsCount = Object.keys(item.models || {}).length;

        el.innerHTML = `
            <div class="history-item-header">
                <span class="tag tag-success">${item.mode || "consensus"}</span>
                <span class="history-item-date">${dateStr}</span>
                <span class="tag tag-info">${modelsCount} Models</span>
                <span class="history-item-latency">⚡ ${(item.totalLatency / 1000).toFixed(2)}s</span>
            </div>
            <p class="history-item-prompt">${escapeHtml(item.prompt)}</p>
            <div class="history-item-actions">
                <button class="btn btn-secondary btn-sm restore-history-btn">Restore Run</button>
                <button class="btn btn-secondary btn-sm copy-history-btn">Copy Consensus</button>
                <button class="icon-btn-danger delete-history-btn" title="Delete entry">&times;</button>
            </div>
        `;

        el.querySelector(".restore-history-btn").addEventListener("click", () => {
            triggerHaptic("medium");
            restoreHistoryEntry(item);
            document.getElementById("historyModal").classList.add("hidden");
            showToast("Restored past run to view!");
        });

        el.querySelector(".copy-history-btn").addEventListener("click", () => {
            copyToClipboard(item.consensus || "", "Consensus copied!");
        });

        el.querySelector(".delete-history-btn").addEventListener("click", () => {
            deleteHistoryEntry(item.id);
        });

        container.appendChild(el);
    });
}

function restoreHistoryEntry(item) {
    document.getElementById("promptInput").value = item.prompt;
    cachedModelResults = item.models || {};

    const consensusSection = document.getElementById("consensusSection");
    const consensusContent = document.getElementById("consensusContent");
    consensusSection.classList.remove("hidden");
    renderMarkdown(consensusContent, item.consensus || "");

    renderAgreementMatrix(item.prompt, item.models || {});

    // Populate side-by-side cards
    const providers = ["openai", "claude", "gemini", "ollama"];
    providers.forEach(p => {
        const titleCase = p.charAt(0).toUpperCase() + p.slice(1);
        const cardRes = item.models && item.models[p];
        const bodyEl = document.getElementById(`response${titleCase}`);
        if (cardRes && cardRes.text) {
            updateCardMetrics(titleCase, cardRes.text, cardRes.latency || 0, cardRes.simulated || false);
            renderMarkdown(bodyEl, cardRes.text);
        }
    });

    consensusSection.scrollIntoView({ behavior: "smooth" });
}

function deleteHistoryEntry(id) {
    triggerHaptic("light");
    let list = getHistory();
    list = list.filter(item => item.id !== id);
    localStorage.setItem("polymind_history", JSON.stringify(list));
    renderHistoryList();
    updateHistoryBadge();
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */

function renderMarkdown(element, markdownText) {
    if (!element) return;
    if (window.marked) {
        element.innerHTML = marked.parse(markdownText);
        element.querySelectorAll("pre code").forEach(block => {
            if (window.hljs) hljs.highlightElement(block);
        });
    } else {
        element.textContent = markdownText;
    }
}

function escapeHtml(str) {
    return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

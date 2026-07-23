---
title: "My Local AI Research Stack: Ollama + Obsidian + Perplexity"
date: 2026-06-13T09:00:00+05:30
description: "Running LLMs locally without cloud bills. Stack for knowledge management, research, and AI-assisted learning."
tags: [ollama, local-llm, productivity, research-tools, ai]
categories: [Tools, Productivity]
series: "Agentic AI & Neuro-Symbolic AI"
slug: my-local-ai-research-stack-ollama-obsidian-perplexity
estimated_read_time: 10 minutes
last_validated: June 2026
---

## You're bleeding $200/month on API calls and your research notes are scattered across five apps

You ran a quick query to Claude at 3am for context on a paper, then checked ChatGPT because you needed a different model's take, then tried Perplexity for web search. Three separate tabs, three separate contexts, no memory of what you asked yesterday.

Meanwhile, your Obsidian vault is full of notes from papers you'll never find again, because they're tagged inconsistently and scattered across 40 files.

This problem doesn't have to be expensive or chaotic.

## The stack: Ollama + Obsidian + Perplexity

I'm not advocating for a "one true stack" — pick what fits your workflow. But this combination solves three separate problems: local inference, knowledge capture, and web-aware context.

## Special note: My current research setup

My current machine uses an **RTX 4060 OC with 8GB of VRAM**. That hardware budget shapes the workflow: I use **Ollama with DeepSeek R1 7B** for focused local reasoning, **Obsidian** as the durable research memory, and **Perplexity Pro** when the task needs current web evidence or substantially more context than I want to keep in GPU memory.

For local work, I deliberately use a predefined **8,192-token context window**. It is large enough for a focused note, a paper section, code, or a compact bundle of related Obsidian notes, while leaving practical headroom on an 8GB GPU. Increasing context is not free: the model's key-value cache grows with the conversation, consuming more memory and reducing responsiveness. The exact limit a machine can sustain also depends on quantization, prompt size, and what else is using VRAM.

I keep the local configuration explicit instead of depending on a changing default:

```text
FROM deepseek-r1:7b
PARAMETER num_ctx 8192
```

Save that as a `Modelfile`, then create and run the research profile:

```bash
ollama pull deepseek-r1:7b
ollama create deepseek-r1-research -f Modelfile
ollama run deepseek-r1-research
```

The operating rule is simple:

- **Use DeepSeek R1 7B locally** for private notes, repeated questioning, drafting, summarization, and reasoning that fits inside the predefined context.
- **Use Obsidian** to preserve conclusions, source links, and compact summaries so every new local prompt does not need the entire research history.
- **Use Perplexity Pro with a 200K context option** when comparing many papers, long reports, or a larger source collection.
- **Use a 1M context option when available in the selected Pro model or research mode** for exceptionally large corpora. Even then, retrieve and organize only the relevant material instead of treating a huge context window as permanent memory.

This creates a practical escalation path: start local and private, compress useful findings into Obsidian, and move to Perplexity only when fresh sources or a much larger evidence window materially improves the research.

### Ollama: Models run locally

Ollama lets you run open models (Llama 2, Mistral, DeepSeek, etc.) on your laptop. No cloud, no bills, no rate limiting.

**Install:**

```bash
# macOS / Linux
curl https://ollama.ai/install.sh | sh

# Then run a model
ollama run mistral:7b
```

That's it. Mistral 7B is now running locally, exposed via REST API on localhost:11434.

**Why this matters:**
- **Cost**: One-time GPU investment (or just CPU, it's slower but works)
- **Privacy**: Your prompts never leave your machine
- **Speed**: Sub-second latency once the model loads
- **Iteration**: Run 100 queries without thinking about costs
- **Offline**: Works without internet once the model is cached

**The trade-off:** You're limited by your GPU. A 7B model runs fine on any modern GPU. A 70B model needs an RTX 4090 or similar. CPU-only works but is glacially slow.

### Obsidian + Ollama integration

Obsidian is your note vault. The Ollama integration turns it into an AI-powered research assistant that stays in your local network.

**Setup:**

1. Install Obsidian if you don't have it
2. Install the "Ollama" plugin from the community plugins menu
3. Point it at `http://localhost:11434`
4. Select your model (Mistral, Llama, etc.)

Now you can:
- Highlight text in any note and ask the model for context
- Generate summaries of long passages
- Ask questions about your notes without leaving the editor
- Keep everything in your vault (all history, all prompts)

```
You write:    "Explain transformer attention"
Ollama: "Attention is a mechanism where..."
        [all within your Obsidian note]
```

The model has access to your note context, so it understands what you're working on without needing to re-explain everything.

### Perplexity: Web-aware reasoning

Ollama runs locally but doesn't have web access. Perplexity bridges that gap — it's like ChatGPT but with real-time search.

When you ask Perplexity a question, it:
1. Searches the web
2. Reads the results
3. Synthesizes an answer with sources

Use Perplexity for:
- Current events, recent research, this year's benchmarks
- Fact-checking something your local model hallucinates
- Exploring a topic you're new to (web gives you breadth)

Use Ollama for:
- Iterating on ideas (local, no API limits)
- Analyzing your own data (privacy, speed)
- Deep dives into familiar topics (context from your notes)

**The workflow:**
1. **Explore**: Ask Perplexity to find recent papers on a topic
2. **Deep dive**: Take Perplexity's sources into Ollama + Obsidian
3. **Synthesize**: Use your local model to connect ideas across notes
4. **Iterate**: Keep asking questions until you understand

## Common setup mistakes

### Mistake 1: Running too large a model for your GPU

```bash
# Don't do this on 8GB GPU
ollama run llama2:70b  # Will thrash swap, glacially slow

# Do this instead
ollama run mistral:7b  # Runs great on 8GB
```

Check your VRAM. A rough rule:
- 7B model ≈ 5GB VRAM
- 13B model ≈ 9GB VRAM
- 70B model ≈ 45GB VRAM

### Mistake 2: Not using context from Obsidian

The Ollama plugin in Obsidian can read your entire vault as context. Don't just ask generic questions — reference your notes.

```
Ask: "Based on my notes about graph databases, 
     explain how they differ from relational DBs"

The model reads your notes, understands your level of knowledge,
and answers at the right depth.
```

### Mistake 3: Confusing local-only with search-enabled

Your local model doesn't know today's date or recent news. If you ask "what happened in June 2026," it'll confabulate. Use Perplexity for that.

## The cost math

**Cloud-only approach:**
- $20/month: ChatGPT Plus
- $20/month: Claude API (heavy usage)
- $10/month: Perplexity
- **Total: $50+/month, likely much more if you query heavily**

**Local + Perplexity:**
- $0/month: Ollama (one-time GPU cost amortized)
- $10/month: Perplexity (only for web search)
- **Total: $10/month + hardware**

If you query heavily (100+ times per day), local breaks even in months.

## Practical example: Researching a complex topic

**Goal:** Understand how knowledge graphs improve LLM reasoning

**Process:**

1. **Perplexity**: Search for "knowledge graphs LLM reasoning 2025" → find 5 papers
2. **Save to Obsidian**: Create notes for each paper with key insights
3. **Ollama**: Ask "Based on these papers, explain why knowledge graphs help LLMs"
4. **Iterate**: Keep asking follow-up questions, building on previous answers
5. **Synthesize**: Write a post combining all the insights

The entire process costs:
- Perplexity queries: ~3 ($0.30 from your Perplexity usage)
- Ollama queries: ~50 (free, runs locally)
- Time: 2 hours

With CloudOnly, that's $5-10 in API costs plus you lose the context between sessions.

## When to NOT use local-only

- **Real-time information:** Use Perplexity or Claude/ChatGPT
- **Complex reasoning:** Larger models (Claude 3, GPT-4) often outperform local models
- **Specialized tasks:** Some tasks (coding, math) benefit from the latest, largest models
- **Collaboration:** If you need to share results, cloud APIs are easier

## The takeaway

A local model running on your hardware is not a replacement for cloud APIs. It's a complement:

- **Explore cheaply**: Run 100 iterations locally before investing in cloud API calls
- **Keep knowledge local**: Your research stays in your vault, not spread across cloud services
- **Fact-check faster**: Ask your model to verify something instantly, without waiting for an API call

Ollama + Obsidian + Perplexity gives you a system that's responsive, private, and sustainable. You're not dependent on any single vendor's API pricing or rate limits.

And you're building the research stack for the next post in this series: understanding how to actually ground these models in your knowledge.

**Next in this series:** [RAG vs GraphRAG vs ADK/A2A/MCP: Architecture Choices for Agentic Systems](/post/2025/07/rag-vs-graphrag-adk-a2a-mcp/)

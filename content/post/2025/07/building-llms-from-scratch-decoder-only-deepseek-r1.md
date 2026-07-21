---
title: "Building LLMs from Scratch: Decoder-Only Transformers & DeepSeek R1"
date: 2025-07-25T09:00:00+05:30
description: "Why decoder-only transformers dominate GenAI. Architecture decisions that let one model do a thousand tasks."
tags: [llm, transformers, architecture, deepseek, ai]
categories: [AI, Architecture]
series: "Agentic AI & Neuro-Symbolic AI"
slug: building-llms-from-scratch-decoder-only-deepseek-r1
estimated_read_time: 10 minutes
last_validated: March 2026
---

## You spent a week tuning a BERT model and it still can't generate coherent text

Your team trained a bidirectional encoder on your company's knowledge base. It's great at retrieval and classification but useless for generation — because it wasn't designed for it. Meanwhile, a 7B decoder-only model you've never seen before is generating better answers than your 50M-parameter expert model.

Something structural is different about how these architectures work, and it matters for what you build next.

## From BERT to GPT: The fork in the road

Transformers, when they landed in 2017, looked like they could go anywhere. An encoder-decoder architecture that beat every benchmark. Then the field split into two paths:

**Bidirectional encoders (BERT, RoBERTa):**
- See the entire context at once
- Predict masked tokens in the middle
- Excellent at understanding, terrible at generation
- Built for classification, retrieval, embeddings

**Decoder-only (GPT, Llama, DeepSeek):**
- See only the left context (autoregressive)
- Predict the next token, always
- Terrible at classification, exceptional at generation and reasoning
- Built for completion, which turns out to be enough

The irony: everyone thought encoder-decoder hybrids (T5, BART) would be the future. Turns out decoder-only scales better. Way better.

## Why decoder-only won

### 1. The training objective is everything

A decoder-only model trains on one job: "given tokens 0 to N, predict token N+1." That's it. No masking, no special tokens, no multiple heads. Just next-token prediction, billions of times.

BERT masks 15% of tokens randomly and asks the model to predict them bidirectionally. Great for understanding, but the model never learns to generate because during training it always sees the context around the masked token. At inference time, it only has the left context and freezes.

Decoder-only models train the way they're used: left-to-right. One token at a time. This is why they generate coherent text and BERT doesn't.

### 2. Scale is kind

Decoder-only architectures benefit disproportionately from scale. Every additional parameter, every additional training token, every additional layer — they all compound into emergent capability.

Here's what happens as you scale:

```
7B parameters: Can do basic tasks (summarize, answer questions)
13B parameters: Adds reasoning, code generation, multi-language
70B parameters: Approaches expert reasoning, handles complex chains
175B+ parameters: Emergent behaviors nobody designed for
```

With BERT-style models, scaling helps but hits diminishing returns. With decoder-only, scaling *unlocks entirely new capabilities*.

### 3. Generation is reasoning

This was the surprise nobody expected. A model trained to predict the next token, when scaled up, starts reasoning step-by-step without ever being told to. It writes code. It does math. It reasons about hypotheticals.

This isn't because we taught it to. It's because at sufficient scale, the model discovers that reasoning — writing out intermediate steps — helps it predict the next token better.

## What changed with DeepSeek R1

DeepSeek R1 landed in late 2024 and shocked the industry for one reason: it was open-source, cheap to run, and competitive with models 10x its size. Why?

**Chain-of-thought reasoning by default.** DeepSeek R1 trained the model to reason explicitly during generation. Instead of hiding all its thinking, it shows intermediate steps. This costs more tokens but gets better results.

The technique is old (Wei et al. 2022, chain-of-thought prompting). The insight is new: if you train a model to reason during generation, you don't need a 175B monster to get good results. A 32B model with explicit reasoning beats a 70B model that reasons implicitly.

For builders, this is the shift: **compute moves from training to inference**. You can train a smaller model cheaply and let it reason expensive at runtime.

```python
# What DeepSeek shows us:
# Decoder-only + explicit reasoning + inference-time compute
# = competitive results at a fraction of training cost
```

## The architecture under the hood

All decoder-only models follow the same pattern:

1. **Tokenizer**: Break text into tokens
2. **Embedding**: Convert tokens to vectors
3. **Stack of transformer blocks**: Each block has self-attention + feedforward
4. **Attention is causal**: Can only look left (at past tokens)
5. **Language model head**: Projects hidden states to next-token logits

The magic is in step 3 — attention with billions of parameters, trained on trillions of tokens.

Here's the simplified architecture:

```
Input: "Explain quantum computing"
  ↓
Tokenize: [explain, quantum, computing]
  ↓
Embed: [[0.2, -0.1, ...], [0.5, 0.3, ...], ...]
  ↓
Transformer block 1: attention + feedforward
  ↓
Transformer block 2: attention + feedforward
  ↓
... (repeat 40-80 times) ...
  ↓
Output layer: [logits for token 1]
  ↓
Sample: "In" (or "Let", "The", ...)
  ↓
Repeat for next token...
```

Each token is predicted given all previous tokens. That's it. No magic, just scale.

## Why this architecture eats everything

Decoder-only works because:

1. **Training and inference match.** No gap between how it sees data during training and at runtime.

2. **Simple scaling.** More parameters = more capability. Predictable and monotonic.

3. **Emergent generalization.** Train on predicting text, get reasoning, code, math, translation for free.

4. **Generation is first-class.** Everything else (classification, retrieval) is a downstream application of generation.

This is why fine-tuning a BERT for generation is like using a hammer for a screw job. Structurally wrong.

## What this means for you

If you're building with LLMs, understand that the model you're using is fundamentally a next-token predictor scaled to absurdity. This changes how you:

**Prompt design**: You're not commanding the model; you're setting up context for the next-token prediction to go in the direction you want.

**Fine-tuning**: Small models with reasoning (like DeepSeek R1) might beat large models without it. Spend inference compute, not training compute.

**Grounding**: Without external context (RAG, tools), the model will hallucinate because next-token prediction has no way to fact-check.

**Reasoning chains**: Longer chains help because more steps = better next-token predictions.

## The takeaway

Decoder-only transformers won because they're simple (next-token prediction), scale predictably (bigger = better), and generate anything you ask (reasoning emergent from scale).

DeepSeek R1 showed that explicit reasoning during generation can be cheaper than implicit reasoning in massive models. The era of "throw more parameters at it" might be giving way to "think harder at inference."

Either way, the architecture is decoder-only. Everything else is optimization.

**Next in this series:** [My Local AI Research Stack: Ollama + Obsidian + Perplexity](/post/2025/07/my-local-ai-research-stack-ollama-obsidian-perplexity/)

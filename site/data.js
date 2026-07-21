// site/data.js
// Centralized content structure for all posts

export const posts = [
  {
    id: "ai-to-genai",
    title: "AI → GenAI: The Real Shift",
    slug: "ai-to-genai-the-real-shift",
    date: "2025-07-21",
    category: "AI",
    tags: ["ai", "genai", "fundamentals", "transformers", "llm"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Why calling GenAI just 'AI' misses what actually changed. The discontinuity that matters for your next system.",
    readTime: 8,
    wordCount: 1450,
    body: `<h2>You just got paged at 2am because the model is hallucinating</h2>
<p>Your ML model trained on 5 years of labeled customer data is confidently generating support tickets that never happened. Your team's trained on classifier debugging — check the confusion matrix, retrain on edge cases, deploy. But that playbook doesn't work here. The model didn't misclassify; it <em>invented facts</em>.</p>
<p>This is the problem GenAI creates, and it's not the same problem AI has always been.</p>
<h2>The 60-year context, compressed</h2>
<p>AI as a field started with symbolic reasoning — hand-coded rules, expert systems, search over explicit knowledge representations. It was interpretable and provably correct within its domain, and it collapsed the moment reality got messier than the rules anticipated.</p>
<p>Machine learning shifted the burden from "hand-write the rules" to "learn the rules from data" — huge win for pattern recognition, still mostly narrow: one model, one task, one dataset. You built a classifier for spam detection, it detected spam. You trained it on your data, you knew what it would do.</p>
<p>Deep learning scaled that further with representation learning — the model learns its own features instead of you engineering them. Better results, same game: input → fixed prediction.</p>
<p><strong>What GenAI adds isn't just "bigger deep learning." It's three things that changed the shape of the engineering problem:</strong></p>
<h3>1. Self-supervised pretraining at scale</h3>
<p>Instead of needing labeled data for every task, the model learns from the structure of raw text/image/audio itself — predict the next token, reconstruct the masked patch. This is the unlock that let one model absorb enough general knowledge to be useful across tasks it was never explicitly trained on.</p>
<h3>2. Emergent capability, not just accuracy</h3>
<p>A model trained purely to predict the next token turns out to do arithmetic, translate languages, write code, and reason step-by-step, <em>without being explicitly taught any of those as separate objectives</em>.</p>
<h3>3. Instruction-following as an interface</h3>
<p>RLHF and instruction-tuning turned a raw next-token predictor into something you can talk to — a system with a natural language API instead of a fixed schema.</p>
<h2>Why this matters for what you build next</h2>
<p>Once you internalize that the shift is (a) self-supervised scale, (b) emergent capability, and (c) instruction-following as an interface, the rest of the modern stack makes more sense.</p>`,
    next: "building-llms-from-scratch-decoder-only-deepseek-r1",
    prev: null,
  },

  {
    id: "building-llms-from-scratch",
    title: "Building LLMs from Scratch: Decoder-Only Transformers & DeepSeek R1",
    slug: "building-llms-from-scratch-decoder-only-deepseek-r1",
    date: "2025-07-25",
    category: "AI",
    tags: ["llm", "transformers", "deepseek", "architecture", "genai"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "From first principles to production: how decoder-only architectures power modern LLMs like DeepSeek R1.",
    readTime: 9,
    wordCount: 1600,
    body: `<h2>The architecture that ate the world</h2>
<p>If GenAI is self-supervised learning at scale, then decoder-only transformers are the machine that makes it practical.</p>
<p>When Vaswani et al. published "Attention Is All You Need" in 2017, they proposed three things: encoder, decoder, and attention. Everyone building language models promptly ignored the encoder and decoder parts and just used the decoder. DeepSeek R1, GPT-4, Claude — all decoder-only. The encoder turned out to be unnecessary friction.</p>
<h2>Why decoder-only won</h2>
<p>Encoder-decoder (like the original Transformer, like BERT) was built for translation: encode source language, decode target language. Two separate jobs.</p>
<p>For language modeling (predict the next token), you don't need the asymmetry. You read left-to-right, predict right. One direction, one job. Decoder-only is simpler and scales better.</p>
<h2>The core operations</h2>
<p>A decoder-only model is just stacked transformer blocks. Each block does:</p>
<ol>
<li><strong>Self-attention</strong>: "Given all the tokens I've seen so far, what should I pay attention to?"</li>
<li><strong>Feed-forward</strong>: "Apply some learned non-linear transformations"</li>
<li><strong>Layer norm</strong>: "Stabilize the numbers so training doesn't explode"</li>
</ol>`,
    next: "my-local-ai-research-stack-ollama-obsidian-perplexity",
    prev: "ai-to-genai-the-real-shift",
  },

  {
    id: "local-ai-research-stack",
    title: "My Local AI Research Stack: Ollama, Obsidian, Perplexity",
    slug: "my-local-ai-research-stack-ollama-obsidian-perplexity",
    date: "2025-07-29",
    category: "Tools",
    tags: ["tools", "ai", "local", "ollama", "research"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Building a knowledge system for AI research without depending on cloud APIs or proprietary platforms.",
    readTime: 7,
    wordCount: 1200,
    body: `<h2>Why local matters</h2>
<p>When you're doing serious research on AI systems, keeping your thinking on someone else's servers is a liability. You need reproducibility, you need control over your data, you need to be able to iterate without worrying about rate limits or API costs.</p>
<h2>The stack</h2>
<p><strong>Ollama:</strong> Run models locally. No cloud, no auth, no latency tax. Quantized versions of Llama, Mistral, whatever.</p>
<p><strong>Obsidian:</strong> Note-taking that stays on your machine. Markdown, graph view, plugins for everything. The model is your second brain; Obsidian is how you externalize your thinking.</p>
<p><strong>Perplexity:</strong> Augment local reasoning with web search. When you need to ground your thinking in current facts.</p>`,
    next: "rag-vs-graphrag-adk-a2a-mcp",
    prev: "building-llms-from-scratch-decoder-only-deepseek-r1",
  },

  {
    id: "rag-vs-graphrag",
    title: "RAG vs GraphRAG: Agentic Data Knowledge (A2A) & MCP",
    slug: "rag-vs-graphrag-adk-a2a-mcp",
    date: "2025-08-02",
    category: "Architecture",
    tags: ["rag", "graphrag", "retrieval", "architecture", "agents"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Why vector databases are not enough: structured retrieval, agent-to-agent protocols, and the future of data grounding.",
    readTime: 9,
    wordCount: 1650,
    body: `<h2>The problem with vanilla RAG</h2>
<p>Retrieval-Augmented Generation solved the hallucination problem: instead of asking the model "what do you know about X," you ask "here are facts about X, now reason about them."</p>
<p>But vector databases are terrible at structure. They're great at "find things similar to this query" and terrible at "find things that satisfy this constraint."</p>
<h2>GraphRAG: structure as retrieval</h2>
<p>GraphRAG turns your documents into a knowledge graph and queries the graph. Relationships, hierarchies, constraints — all explicit.</p>
<p>Entities and relationships mean agents can reason about dependencies: "If I want to know X, I first need to understand Y."</p>`,
    next: "genai-enterprise-saas-integration-playbook",
    prev: "my-local-ai-research-stack-ollama-obsidian-perplexity",
  },

  {
    id: "genai-enterprise-saas",
    title: "GenAI Enterprise SaaS Integration Playbook",
    slug: "genai-enterprise-saas-integration-playbook",
    date: "2025-08-06",
    category: "Production",
    tags: ["genai", "enterprise", "integration", "saas", "deployment"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "How to integrate GenAI models into existing SaaS products without breaking compliance, latency, or your architecture.",
    readTime: 8,
    wordCount: 1550,
    body: `<h2>The integration problem</h2>
<p>Your SaaS product has users, data, compliance requirements, and latency budgets. Bolting on an LLM API is not the same as integrating it.</p>
<h2>The checklist</h2>
<p><strong>Latency:</strong> If your 99th percentile is 200ms, an LLM that takes 2s will break your product.</p>
<p><strong>Cost:</strong> Per-token billing scales with usage. Know your cost per feature.</p>
<p><strong>Privacy:</strong> Can you send user data to OpenAI? Read your contract.</p>
<p><strong>Consistency:</strong> LLMs are stochastic. Today's answer differs from yesterday's. Design for that.</p>`,
    next: "claude-code-mastery-skills-plugins-workflows",
    prev: "rag-vs-graphrag-adk-a2a-mcp",
  },

  {
    id: "claude-code-mastery",
    title: "Claude Code Mastery: Skills, Plugins & Workflows",
    slug: "claude-code-mastery-skills-plugins-workflows",
    date: "2025-08-10",
    category: "Tools",
    tags: ["claude", "tools", "productivity", "automation", "skills"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "How to leverage Claude Code's skills system, plugins, and workflow orchestration for building complex AI systems.",
    readTime: 8,
    wordCount: 1400,
    body: `<h2>Claude Code is more than a chat interface</h2>
<p>It's a tool for building AI-powered workflows. Skills, plugins, and multi-agent orchestration let you compose complex behaviors from simpler pieces.</p>
<h2>Skills: Reusable tools</h2>
<p>Write a skill once, invoke it everywhere. Language-agnostic, versioned, shareable.</p>
<h2>Workflows: Multi-agent orchestration</h2>
<p>Fan out work across agents, aggregate results, retry on failure. Deterministic, inspectable, debuggable.</p>`,
    next: "build-ai-simulators-simulation-assisted-ai",
    prev: "genai-enterprise-saas-integration-playbook",
  },

  {
    id: "ai-simulators",
    title: "Build AI Simulators: Simulation-Assisted AI",
    slug: "build-ai-simulators-simulation-assisted-ai",
    date: "2025-08-14",
    category: "AI",
    tags: ["simulation", "ai", "training", "reinforcement-learning", "agents"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Using simulation to train and evaluate AI agents without the cost and risk of real-world experimentation.",
    readTime: 8,
    wordCount: 1500,
    body: `<h2>Why simulation matters for AI</h2>
<p>Training an agent in the real world is expensive and dangerous. Simulation lets you iterate fast, test edge cases, and validate behavior before deployment.</p>
<h2>The simulator loop</h2>
<p>1. Define a world (state space, actions, rewards)</p>
<p>2. Run the agent in simulation</p>
<p>3. Evaluate behavior</p>
<p>4. Adjust the agent or the simulation</p>
<p>5. Repeat until good</p>
<p>6. Deploy to real world</p>`,
    next: "what-is-neuro-symbolic-ai-and-why-now",
    prev: "claude-code-mastery-skills-plugins-workflows",
  },

  {
    id: "neuro-symbolic-intro",
    title: "What is Neuro-Symbolic AI and Why Now?",
    slug: "what-is-neuro-symbolic-ai-and-why-now",
    date: "2025-08-18",
    category: "AI",
    tags: ["neuro-symbolic", "ai", "reasoning", "logic", "hybrid"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Why combining neural networks with symbolic reasoning is the next frontier, and why it's practical now.",
    readTime: 8,
    wordCount: 1600,
    body: `<h2>The hybrid approach</h2>
<p>Neural networks excel at pattern recognition from data. Symbolic systems excel at explicit reasoning and guarantees.</p>
<p>Neuro-symbolic AI combines both: use neural networks for perception and pattern matching, use symbolic reasoning for logic and constraints.</p>
<h2>Why now</h2>
<p>Large language models became good enough at reasoning that the bottleneck shifted from "can the neural part reason?" to "can we make the reasoning trustworthy and efficient?"</p>
<p>That's where symbolic methods come in.</p>`,
    next: "knowledge-graphs-as-symbolic-backbone",
    prev: "build-ai-simulators-simulation-assisted-ai",
  },

  {
    id: "knowledge-graphs",
    title: "Knowledge Graphs as Symbolic Backbone",
    slug: "knowledge-graphs-as-symbolic-backbone",
    date: "2025-08-22",
    category: "Architecture",
    tags: ["knowledge-graphs", "graphs", "symbolic", "reasoning", "data"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "How knowledge graphs ground neural reasoning in explicit structure and enable verifiable AI systems.",
    readTime: 8,
    wordCount: 1550,
    body: `<h2>Structure as a feature</h2>
<p>A knowledge graph is a machine-readable model of your domain: entities, relationships, properties, constraints.</p>
<p>Unlike unstructured text or embeddings, a graph lets you ask: "What are all the ways X relates to Y?" and get a complete answer, not a probability.</p>
<h2>Graph + LLM</h2>
<p>Query the graph to ground reasoning. Use the LLM for natural language generation and fine-grained reasoning. Use the graph for structure and verification.</p>`,
    next: "agentic-knowledgegraph-engineering-101",
    prev: "what-is-neuro-symbolic-ai-and-why-now",
  },

  {
    id: "agentic-kg-engineering",
    title: "Agentic Knowledge Graph Engineering 101",
    slug: "agentic-knowledgegraph-engineering-101",
    date: "2025-08-26",
    category: "Architecture",
    tags: ["knowledge-graphs", "agents", "engineering", "design", "systems"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Practical guide to designing and building knowledge graphs for autonomous agents.",
    readTime: 9,
    wordCount: 1700,
    body: `<h2>The design phase</h2>
<p>Before you build a knowledge graph, define your entity types, relationships, and properties. What questions will the agent need to answer? What constraints must it respect?</p>
<h2>The implementation phase</h2>
<p>Choose a graph database (Neo4j, ArangoDB, etc). Model your domain. Write the queries the agent will run.</p>
<h2>The integration phase</h2>
<p>Connect the agent to the graph. Give it tools to query, update, and verify. Test edge cases.</p>`,
    next: "reasoning-engines-logic-programming-llm",
    prev: "knowledge-graphs-as-symbolic-backbone",
  },

  {
    id: "reasoning-engines",
    title: "Reasoning Engines: Logic Programming & LLMs",
    slug: "reasoning-engines-logic-programming-llm",
    date: "2025-09-02",
    category: "AI",
    tags: ["reasoning", "logic", "programming", "constraint-solving", "symbolic"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Combining Prolog-style logic with LLM reasoning for verifiable AI systems.",
    readTime: 8,
    wordCount: 1600,
    body: `<h2>When probabilistic reasoning isn't enough</h2>
<p>LLMs reason probabilistically: "This answer has high likelihood." But sometimes you need guarantees: "This decision is consistent with policy" or "This solution satisfies all constraints."</p>
<h2>Logic programming</h2>
<p>Systems like Prolog let you state facts and rules, then query what must be true. The reasoning is deterministic and verifiable.</p>
<h2>The hybrid: LLM + Logic Engine</h2>
<p>Use the LLM for open-ended reasoning and language understanding. Use the logic engine for constraint satisfaction and verification.</p>`,
    next: "neuro-symbolic-agents-production",
    prev: "agentic-knowledgegraph-engineering-101",
  },

  {
    id: "neuro-symbolic-production",
    title: "Neuro-Symbolic Agents in Production",
    slug: "neuro-symbolic-agents-production",
    date: "2025-09-06",
    category: "Production",
    tags: ["neuro-symbolic", "agents", "production", "deployment", "systems"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Building, deploying, and monitoring hybrid AI systems in production environments.",
    readTime: 9,
    wordCount: 1750,
    body: `<h2>From research to production</h2>
<p>Neuro-symbolic AI sounds great in a paper. Deploying it reliably at scale is a different problem.</p>
<h2>The challenges</h2>
<p><strong>Latency:</strong> Agents that query graphs and call LLMs add latency at every step.</p>
<p><strong>Cost:</strong> Each agent call might invoke multiple LLM queries.</p>
<p><strong>Debugging:</strong> When the agent fails, which component is at fault?</p>
<h2>Best practices</h2>
<p>Cache aggressively. Monitor each component. Have fallbacks for when reasoning fails.</p>`,
    next: "neuro-symbolic-ai-enterprise-roadmap",
    prev: "reasoning-engines-logic-programming-llm",
  },

  {
    id: "enterprise-roadmap",
    title: "Neuro-Symbolic AI: Enterprise Roadmap",
    slug: "neuro-symbolic-ai-enterprise-roadmap",
    date: "2025-09-10",
    category: "Production",
    tags: ["neuro-symbolic", "enterprise", "roadmap", "strategy", "deployment"],
    series: "Agentic AI & Neuro-Symbolic AI",
    description: "Strategic guide for enterprises adopting neuro-symbolic AI over the next 3-5 years.",
    readTime: 10,
    wordCount: 1900,
    body: `<h2>The enterprise perspective</h2>
<p>Neuro-symbolic AI isn't just technically interesting; it's strategically important for companies that need reliable, auditable AI systems.</p>
<h2>Year 1: Foundation</h2>
<p>Build your knowledge graphs. Get comfortable with graph queries. Integrate your first LLM-powered features with guardrails.</p>
<h2>Year 2-3: Scale</h2>
<p>Deploy agents that use graphs as grounding. Invest in monitoring and explainability tooling.</p>
<h2>Year 4-5: Competitive advantage</h2>
<p>Your system becomes more reliable and auditable than competitors. You win deals on compliance and transparency.</p>`,
    next: null,
    prev: "neuro-symbolic-agents-production",
  },
];

export const collections = {
  ai: {
    name: "AI",
    description: "Artificial Intelligence, GenAI, LLMs, and related technologies",
    color: "#1d9bf0",
  },
  tools: {
    name: "Tools",
    description: "Engineering tools, workflows, and productivity",
    color: "#f1a208",
  },
  architecture: {
    name: "Architecture",
    description: "System design and technical architecture",
    color: "#13a538",
  },
  production: {
    name: "Production",
    description: "Deployment, monitoring, and production systems",
    color: "#e84c3d",
  },
};

export const stats = {
  totalPosts: posts.length,
  totalWords: posts.reduce((sum, p) => sum + (p.wordCount || 0), 0),
  byCategory: {},
  byTag: {},
};

for (const post of posts) {
  stats.byCategory[post.category] = (stats.byCategory[post.category] || 0) + 1;
  for (const tag of post.tags) {
    stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
  }
}

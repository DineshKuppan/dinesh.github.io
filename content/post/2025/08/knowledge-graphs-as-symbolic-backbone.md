---
title: "Knowledge Graphs as the Symbolic Backbone: Where Neo4j Meets LLMs"
date: 2025-08-22T09:00:00+05:30
description: "Building knowledge graphs for AI reasoning. From schema design to querying with LLMs."
tags: [knowledge-graphs, neo4j, graph-databases, llm-reasoning]
categories: [Architecture, Databases]
series: "Agentic AI & Neuro-Symbolic AI"
slug: knowledge-graphs-as-symbolic-backbone
estimated_read_time: 11 minutes
last_validated: April 2026
---

## Your vector database lost a crucial relationship

You indexed 50,000 customer support documents into a vector database. The model retrieves relevant chunks and answers questions. Works great for retrieval.

Then a customer asks: "Who sold us the PremiumTier product in Q3?" The vector search returns 3 documents, none of them connected. The LLM hallucinates an answer.

The problem: relationships matter. Sales rep → sold → Product → Account → Quarter. You need that chain, not just similar documents.

A knowledge graph would have found the right path instantly.

## From vectors to graphs

**Vector databases (RAG):**
- Store documents as embeddings
- Search by similarity
- Fast, simple, works for retrieval
- Loses structure

**Knowledge graphs:**
- Store entities and relationships explicitly
- Search by graph paths
- Slower to query, but finds relationships
- Preserves structure

**Example:**

```
Vector search for "Q3 PremiumTier sales":
Finds: [document1: mentions Q3, document2: mentions PremiumTier, ...]
Problem: Doesn't link them

Graph search for "Q3 PremiumTier sales":
Finds: Rep → sold → Product:PremiumTier → Quarter:Q3
Result: Found it
```

## Designing a graph schema

A knowledge graph has nodes (entities) and edges (relationships).

**Example: SaaS company graph**

Nodes:
- `Customer` (properties: name, industry, region)
- `Product` (properties: name, tier, price)
- `SalesRep` (properties: name, team)
- `Feature` (properties: name, category)
- `Bug` (properties: id, severity)

Edges:
- `Customer --uses--> Product`
- `SalesRep --sold--> Product`
- `Product --has--> Feature`
- `Feature --has-bug--> Bug`
- `Customer --reports--> Bug`
- `Bug --fixed-by--> Developer`

```
CREATE (c:Customer {name: "Acme Corp", industry: "Finance"})
CREATE (p:Product {name: "Enterprise", tier: "Premium"})
CREATE (sr:SalesRep {name: "Alice"})

CREATE (sr)-[:sold {date: "2026-Q3"}]->(p)
CREATE (c)-[:uses {since: "2026-01-01"}]->(p)
CREATE (c)-[:has_rep]->(sr)
```

Now you can query:

```cypher
// Who is the rep for customers using PremiumTier?
MATCH (c:Customer)-[:uses]->(p:Product {tier: "Premium"})
      (c)-[:has_rep]->(sr:SalesRep)
RETURN c.name, sr.name
```

This is precise. No hallucination.

## Building the graph from documents

You have 50,000 documents. You don't want to hand-code all relationships. Use LLMs to extract them.

**Step 1: Define extraction schema**

```python
extraction_schema = {
    "entities": [
        {"type": "Customer", "properties": ["name", "industry"]},
        {"type": "Product", "properties": ["name", "tier"]},
        {"type": "SalesRep", "properties": ["name"]},
    ],
    "relationships": [
        {"from": "SalesRep", "to": "Product", "type": "sold"},
        {"from": "Customer", "to": "Product", "type": "uses"},
    ]
}
```

**Step 2: Extract from documents**

```python
def extract_entities_and_relationships(document_text):
    prompt = f"""
    Extract entities and relationships from this document:
    {document_text}
    
    Return JSON matching this schema:
    {extraction_schema}
    """
    
    result = call_claude(prompt, schema=extraction_schema)
    return result

# For each document:
doc = read_document()
entities, relationships = extract_entities_and_relationships(doc)

# Insert into graph
for entity in entities:
    create_node_in_graph(entity)
for rel in relationships:
    create_relationship_in_graph(rel)
```

**Result:** Your 50,000 documents are now a structured graph. You can query it precisely.

## Querying the graph with LLMs

Most LLMs can't write Cypher (graph query language) well. But they can write it if trained.

**Approach: Few-shot learning**

```python
# Show the LLM a few examples
examples = [
    {
        "question": "Who sold Premium products?",
        "cypher": "MATCH (sr:SalesRep)-[:sold]->(p:Product {tier: 'Premium'}) RETURN sr.name"
    },
    {
        "question": "What features does Enterprise have?",
        "cypher": "MATCH (p:Product {name: 'Enterprise'})-[:has]->(f:Feature) RETURN f.name"
    }
]

# Now ask a new question
user_question = "Who are the customers of Alice?"
prompt = f"""
Given these examples:
{examples}

Write a Cypher query for: {user_question}
Return only the Cypher query.
"""

cypher_query = call_claude(prompt)
result = execute_cypher(cypher_query)  # Query the graph
```

**But there's a better way: Schema-aware prompting**

```python
prompt = f"""
You are a graph database expert. 
The graph has these node types: {node_types}
The graph has these relationships: {relationship_types}

Write a Cypher query for: {user_question}
Return only the query.
"""

cypher_query = call_claude(prompt)
```

Claude understands the schema and writes correct queries 90% of the time.

## Real-world example: Financial regulatory compliance

**Problem:** Is this transaction compliant with all regulations?

**Without a graph:**
- Regulations are text documents (hundreds of them)
- You'd need to search all of them
- Vector search might miss relevant ones
- LLM has to reason over incomplete information

**With a graph:**

```
Nodes:
- Regulation (id, category, rule)
- TransactionType (name)
- Country (name, risk_level)
- Customer (name, kyc_status)

Relationships:
- TransactionType --subject-to--> Regulation
- Customer --from--> Country
- Regulation --requires--> KYCStatus
```

Query a transaction:

```cypher
MATCH (t:TransactionType {type: "crypto_transfer"})
      -[:subject_to]->(reg:Regulation)
      (c:Customer)-[:from]->(country:Country)
RETURN reg.rule, reg.requirement
```

Result: All regulations that apply to this transaction, pre-filtered.

LLM receives: Exact relevant regulations, not 500 possibly-relevant documents.

LLM answers: Yes/no with proof.

## When to use graphs vs. vectors

| Use case | Best approach |
|----------|---------------|
| "Find documents about X" | Vector (RAG) |
| "What is the relationship between X and Y?" | Graph |
| "Do X and Y have a common ancestor?" | Graph |
| "List all transactions from customer X" | Graph |
| "Is X similar to Y?" | Vector |
| "Search across millions of documents" | Vector (faster) |
| "I need the exact relationship path" | Graph |

## Hybrid: Graph + Vector

Use both:
- Vector search to find relevant subgraphs
- Graph query to navigate relationships precisely

```python
# 1. Vector search narrows down
relevant_docs = vector_search("crypto compliance", top_k=10)

# 2. Extract entities from relevant docs
entities = extract_entities(relevant_docs)

# 3. Query graph with extracted entities
result = graph_query(
    f"MATCH (:Regulation)-[:applies_to]->(:TransactionType) 
           WHERE ... RETURN ..."
)
```

## Setting up Neo4j locally

```bash
# Docker
docker run -p 7474:7474 -p 7687:7687 neo4j:latest

# Create a graph
cypher = """
CREATE (c:Customer {name: "Alice"})
CREATE (p:Product {name: "Pro"})
CREATE (c)-[:uses {since: "2026-01"}]->(p)
"""

execute_cypher(cypher)

# Query
result = execute_cypher(
    "MATCH (c:Customer)-[:uses]->(p:Product) RETURN c.name, p.name"
)
```

## Common mistakes

**Mistake 1: Not extracting relationships properly**

Don't just do entity extraction. Extract the relationships explicitly.

```python
# Wrong: Just find entities
"Customer: Alice, Product: Pro"

# Right: Find relationships
"Alice uses Pro since 2026-01"
# Then create: (alice)-[:uses {since: "2026-01"}]->(pro)
```

**Mistake 2: Over-normalizing**

```
Wrong: Too many small nodes
(alice)-[:age]->(30)

Right: Properties on the node
(alice {age: 30})
```

**Mistake 3: Forgetting to maintain the graph**

Products get updated, customers churn, relationships change. The graph gets stale. Plan for updates.

```python
# Quarterly refresh
def refresh_graph():
    # Extract from new documents
    new_entities = extract_all()
    # Update the graph (insert new, update existing, delete old)
    sync_graph_with_entities(new_entities)
```

## The bridge to the next post

Knowledge graphs are the data layer. The next post is about using them for agentic reasoning:

- **This post:** Build a knowledge graph (data layer)
- **Next post:** Build an agent that reasons over the graph (reasoning layer)
- **Posts 11+:** Combine with logic engines (verification layer)

## The takeaway

A knowledge graph is not a replacement for vectors. It's a complement. Use vectors for fast similarity search. Use graphs for precise relationship navigation.

If your problem involves relationships (and most interesting problems do), consider adding a graph to your architecture.

The cost of adding a graph: moderate setup, worth it for accuracy and explainability.

The cost of not having one: your LLM hallucinates relationships.

**Next in this series:** [Agentic KnowledgeGraph Engineering 101](/post/2025/08/agentic-knowledgegraph-engineering-101/)

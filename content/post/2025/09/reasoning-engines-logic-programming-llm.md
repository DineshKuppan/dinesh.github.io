---
title: "Reasoning Engines: Combining Logic Programming (Prolog/Datalog) with LLM Inference"
date: 2025-08-30T09:00:00+05:30
description: "When LLMs aren't enough, add formal logic. Hybrid reasoning for problems that need provable correctness."
tags: [reasoning, prolog, datalog, logic-programming, formal-verification]
categories: [Advanced, Architecture]
series: "Agentic AI & Neuro-Symbolic AI"
slug: reasoning-engines-logic-programming-llm
estimated_read_time: 11 minutes
last_validated: April 2026
---

## Your LLM approved a transaction that violates policy

You deployed an LLM to approve or reject loan applications. It uses RAG to fetch relevant policies, and it's remarkably accurate — 95% approval rate matches your historical baseline.

Then it approved a loan that violates explicit policy: "No loans > $100k without 2 manager approvals." The loan was $150k with 1 approval.

The LLM had the policy in context. It just didn't apply it correctly.

This is where logic engines help. They're not smarter than LLMs, they're just deterministic. They can't make judgment calls, but they can enforce rules.

## The difference: Reasoning vs. Verification

**Reasoning (what LLMs do):**
- Read context
- Make probabilistic judgments
- Return a best guess
- Good at ambiguity, bad at hard rules

**Verification (what logic engines do):**
- Take facts and rules
- Derive conclusions mechanically
- Return "definitely true" or "definitely false"
- Good at hard rules, bad at ambiguity

The best systems use both.

## Three types of logic engines

### 1. Prolog (logic programming)

Prolog is a language where you define facts and rules, then ask questions.

```prolog
% Facts
manager(alice).
manager(bob).
loan_approved_by(loan_123, alice).

% Rules
requires_two_approvals(Loan) :- 
    loan_amount(Loan, Amount), 
    Amount > 100000.

has_required_approvals(Loan) :- 
    requires_two_approvals(Loan),
    loan_approved_by(Loan, Manager1),
    loan_approved_by(Loan, Manager2),
    Manager1 \= Manager2.

can_fund(Loan) :- has_required_approvals(Loan).
can_fund(Loan) :- 
    \+ requires_two_approvals(Loan),
    loan_approved_by(Loan, _).
```

Now query:

```prolog
?- can_fund(loan_123).
false.  % Because only 1 approval, needs 2

?- can_fund(loan_456).
true.   % Because < $100k, needs only 1 approval
```

**Strengths:**
- Deterministic (Prolog proves whether something is true, doesn't guess)
- Handles negation and complex logic
- Can backtrack and explore all solutions

**Weaknesses:**
- You must hand-code all rules
- Doesn't handle ambiguity
- Slow on large datasets (but fast on small ones)

### 2. Datalog (logic queries)

Datalog is like Prolog but optimized for database queries.

```datalog
% Facts (stored in database)
manager(alice).
manager(bob).
loan_approved_by(loan_123, alice).

% Rules
requires_two_approvals(Loan) :- 
    loan(Loan, Amount), 
    Amount > 100000.

has_required_approvals(Loan) :- 
    requires_two_approvals(Loan),
    loan_approved_by(Loan, Manager1),
    loan_approved_by(Loan, Manager2),
    Manager1 != Manager2.

can_fund(Loan) :- has_required_approvals(Loan).
can_fund(Loan) :- 
    loan(Loan, Amount),
    Amount <= 100000,
    loan_approved_by(Loan, _).

% Query: Find all fundable loans
?- can_fund(Loan).
```

Datalog is to Prolog as SQL is to full logic programming. Simpler, faster, often enough.

### 3. Constraint solvers

For optimization problems ("find the best assignment").

```python
# Example: Assign salesreps to customers
from ortools.linear_solver import pywraplp

solver = pywraplp.Solver.CreateSolver('SCIP')

# Variables: assignment[rep][customer] = 1 if rep assigned to customer
assignments = {}
for rep in reps:
    for customer in customers:
        assignments[(rep, customer)] = solver.IntVar(0, 1, f'{rep}_{customer}')

# Constraints
# 1. Each customer gets exactly 1 rep
for customer in customers:
    solver.Add(sum(assignments[(rep, customer)] for rep in reps) == 1)

# 2. No rep has more than 10 customers
for rep in reps:
    solver.Add(sum(assignments[(rep, customer)] for customer in customers) <= 10)

# 3. Minimize travel distance
objective = solver.Objective()
for rep in reps:
    for customer in customers:
        objective.SetCoefficient(
            assignments[(rep, customer)], 
            distance(rep, customer)
        )
objective.SetMinimization()

# Solve
status = solver.Solve()
# Get optimal assignment
```

## Hybrid: LLM + Logic engine

**Pattern 1: LLM generates facts, logic engine verifies**

```
User: "Should we approve this loan?"
  ↓
LLM reads application, extracts:
  - loan_amount: 150000
  - approvals: [alice]
  - collateral: house
  ↓
Logic engine checks:
  - requires_two_approvals(150000)? true
  - has_two_approvals([alice])? false
  - Result: DENY
  ↓
LLM explains: "This loan needs 2 manager approvals, 
              you have 1. Needs 1 more approval."
```

**Pattern 2: Logic engine generates options, LLM ranks**

```
Problem: Assign salesreps to customers (100 possibilities)
  ↓
Logic engine generates all valid assignments
(that satisfy constraints)
  ↓
LLM ranks them:
  - Option A: Low travel distance but unbalanced workload
  - Option B: Balanced workload, medium travel distance
  ↓
LLM recommends: "Option B is better because..."
```

## Real example: Compliance checking

**Setup:**
- Rules database: Hundreds of regulatory rules (Prolog/Datalog)
- Facts database: Transaction details, customer info
- LLM: Extracts facts from applications, explains results

**Transaction:** "Transfer $500k to new beneficiary in Belarus"

**LLM extracts facts:**
```prolog
transaction_amount(tx_001, 500000).
transaction_type(tx_001, wire_transfer).
beneficiary_country(tx_001, belarus).
customer_aml_status(tx_001, verified).
```

**Logic engine runs rules:**
```prolog
% Rule 1: Large transfers need AML check
triggers_aml_check(Tx) :- transaction_amount(Tx, Amt), Amt > 250000.

% Rule 2: High-risk countries need extra scrutiny
high_risk_country(belarus).
triggers_enhanced_check(Tx) :- 
    beneficiary_country(Tx, Country),
    high_risk_country(Country).

% Rule 3: Enhanced check requires approval
requires_approval(Tx) :- triggers_enhanced_check(Tx).
requires_approval(Tx) :- triggers_aml_check(Tx).

% Query: Is tx_001 compliant?
?- compliant(tx_001).
false.  % Because triggers_enhanced_check AND triggers_aml_check
```

**LLM explains:**
"This transaction is flagged for 2 reasons: 1) Amount ($500k) exceeds AML threshold ($250k), 2) Belarus is high-risk. Requires manager approval before processing."

## When to use logic engines

**Use logic engines when:**
- You need deterministic correctness (compliance, safety)
- Rules are well-defined (policies, regulations, contracts)
- There are hard constraints (budgets, deadlines)
- You can't afford to guess

**Don't use them when:**
- The problem is inherently ambiguous
- Rules are vague or frequently change
- You need to learn from data

## Building your first logic engine

**Step 1: Write facts (your data)**

```prolog
% Your data
customer(alice, verified).
customer(bob, unverified).
product(pro, 100).
product(free, 0).
purchase(alice, pro, 5).  % Alice bought Pro 5 times
```

**Step 2: Write rules (your logic)**

```prolog
% Your rules
is_power_user(Customer) :- purchase(Customer, _, Times), Times > 3.
can_upgrade(Customer) :- 
    customer(Customer, verified),
    is_power_user(Customer).
```

**Step 3: Query (ask questions)**

```prolog
?- can_upgrade(alice).
true.

?- can_upgrade(bob).
false.
```

## Tools

**Prolog:** SWI-Prolog (free, open source)
```bash
apt-get install swi-prolog
swipl
?- consult('rules.pl').  % Load your rules
```

**Datalog:** Souffle (fast, used in security tools)
```bash
brew install souffle
souffle -o program rules.dl
```

**Constraint solvers:** OR-Tools (free, works with Python)
```python
pip install ortools
```

## Common mistakes

### Mistake 1: Treating logic engines as smart

They're not. They just follow rules you write.

```
Bad logic: "If the customer is verified AND has spent > $1k, approve them"
Problem: What if they just spent that today and got verified yesterday?

Good logic: "IF verified 30+ days ago AND spent $1k before verification THEN approve"
```

### Mistake 2: Not handling incomplete information

```
Bad rule: has_required_approvals(Loan) :- loan_approved_by(Loan, Manager1), loan_approved_by(Loan, Manager2).
Problem: If you only have 1 approval, this returns false (good), but the system crashes if the data is incomplete

Good rule: 
count_approvals(Loan, Count) :- Count = count(Manager | loan_approved_by(Loan, Manager)).
has_required_approvals(Loan) :- 
    requires_two_approvals(Loan), 
    count_approvals(Loan, Count), 
    Count >= 2.
```

### Mistake 3: Over-specifying rules

Start simple, add complexity as needed.

```
Bad: 
rule(Tx) :- transaction_amount > 1000, 
            customer_aml_verified, 
            NOT in_high_risk_country,
            NOT on_sanctions_list,
            NOT has_recent_fraud_claim,
            account_age > 30,
            previous_transactions > 5,
            ... (20 more conditions)

Good: 
high_risk(Tx) :- transaction_amount > 100000, in_high_risk_country.
high_risk(Tx) :- on_sanctions_list.
requires_review(Tx) :- high_risk(Tx).
requires_review(Tx) :- NOT customer_aml_verified.
```

## The bridge to production systems

This post covered reasoning engines as a standalone tool. The next post shows how to combine them with agents and graphs in a production system:

- **This post:** Logic engines verify correctness
- **Next post:** Integrate with agents, graphs, LLMs in production
- **Final post:** Case studies and what comes next

## The takeaway

Logic engines aren't replacements for LLMs. They're complements. Use them for:

1. **Verification:** "Does this decision comply with all rules?"
2. **Constraint solving:** "Find the best assignment given constraints"
3. **Explainability:** "Here's the exact rule that led to this decision"

LLMs are great at reasoning. Logic engines are great at verification. Together, they're stronger than either alone.

**Next in this series:** [Neuro-Symbolic Agents in Production: Constraint Solvers, Rule Engines, and LLM Planners](/post/2025/09/neuro-symbolic-agents-production/)

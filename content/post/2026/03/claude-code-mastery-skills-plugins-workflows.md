---
title: "Claude Code Mastery: Skills, Plugins, Daily Staff-Engineer Workflows"
date: 2026-03-22T09:00:00+05:30
description: "Using Claude Code as your development partner. Skills, custom plugins, loops, and shipping faster."
tags: [claude-code, developer-tools, productivity, automation, ai-workflow]
categories: [Tools, Productivity]
series: "Agentic AI & Neuro-Symbolic AI"
slug: claude-code-mastery-skills-plugins-workflows
estimated_read_time: 13 minutes
last_validated: March 2026
---

## You just wasted 2 hours on a task an AI could have done in 2 minutes

You were refactoring a Go service. Simple task: rename a function across 40 files, update all tests, fix all imports. You could use find-and-replace, but it's error-prone. Instead, you did it manually, file by file, paranoid about breaking something.

Halfway through, you realized: Claude Code could have done this in a loop, validated the build, and made sure it worked.

You didn't ask because you weren't sure how. Most developers aren't.

## What changed: Skills and plugins

Claude Code (claude.ai/code) started as a code completion tool. In the last year, it became a development platform.

**Skills** let you teach Claude Code to do your repetitive workflows. Instead of explaining the same test pattern 50 times, you write a SKILL.md that says "here's how we test in this codebase" and Claude Code reads it.

**Plugins** (formerly called connectors) let Claude Code interact with external systems. GitHub, Linear, Slack, your own APIs. Claude Code can now read from your issues, write code, commit, and post updates to Slack.

**Loops** let you automate recurring tasks. "Run tests every 5 minutes until they pass" or "Check the build status every hour and alert me if it fails."

Put them together and you have a development partner that can:
- Understand your codebase patterns (Skills)
- Interact with your tools (Plugins)
- Keep working while you sleep (Loops)

## Three workflows that save hours

### Workflow 1: The refactoring loop

**Scenario:** You want to rename a function across your codebase and you're paranoid about breaking something.

**Old way:**
1. Use find-and-replace
2. Manually verify each hit
3. Run tests
4. Pray you didn't miss anything
5. Time: 1-2 hours

**New way with Claude Code:**
```
/loop "Refactor: Rename authenticate() to verifyCredentials(). 
       Use grep to find all occurrences. 
       Check tests pass after each change.
       Ask me before making risky changes."
```

Claude Code:
1. Finds all occurrences of `authenticate()`
2. Shows them to you for approval
3. Renames them in batches
4. Runs tests after each batch
5. Reports results
6. Keeps looping until done

Time: 15 minutes of your time (mostly approving changes)

### Workflow 2: The test-driven debugging loop

**Scenario:** You have a flaky test that passes sometimes, fails sometimes. You can't figure out why.

```
/loop "Debug flaky test: tests/e2e/payment_test.go::TestPaymentWebhook
       Run the test 10 times and show me which ones fail.
       When you see a failure pattern, hypothesize what's wrong.
       Suggest a fix, have me review it, then run tests again.
       Stop when the test passes 10x in a row."
```

Claude Code:
1. Runs the test 10 times, logs results
2. Finds the failure pattern (fails when database is slow, etc.)
3. Suggests a fix (add retry logic, mock the delay, etc.)
4. Applies the fix (with your approval)
5. Runs the test 10 more times to validate
6. Reports: "Test now passes 10x in a row, likely fixed"

Time: 30 minutes vs 3 hours of manual debugging

### Workflow 3: The automated PR review and iteration

**Scenario:** You have 5 PRs from teammates. You want to review them, run tests, request changes, and track progress.

Setup: Create a Skill that defines your code review checklist.

```
/loop "Review all open PRs. For each PR:
       1. Read the code and check the REVIEW_CHECKLIST skill
       2. Run tests via GitHub Actions
       3. Comment on the PR with findings
       4. After fixes, re-run tests
       Stop when all PRs are approved"
```

With plugins:
- Claude Code reads from GitHub (open PRs)
- Leaves comments on the PR (found 3 issues, here's why)
- Tracks status in Linear (PR #1 → needs fixes, PR #2 → approved)
- Posts a summary to Slack (#eng-reviews: "4 of 5 PRs approved")

Time: Fully automated, you sleep while it works

## Creating your first Skill

Skills are just markdown files that explain your project's patterns.

**Example Skill for a Go service:**

```markdown
---
name: go-test-pattern
description: How to write and run tests in this codebase
---

## Testing Pattern

This codebase uses:
- Table-driven tests (see examples in tests/)
- Docker Compose for integration tests (docker-compose.yml)
- Test database seeding in tests/fixtures/

## Run tests
\`\`\`bash
# Unit tests
go test ./...

# Integration tests (requires Docker)
docker-compose -f tests/docker-compose.yml up -d
go test -tags=integration ./...
docker-compose down
\`\`\`

## Common mistakes to avoid
- Don't test private functions
- Always clean up Docker containers after tests
- Use t.Cleanup() for resource cleanup
```

Now when Claude Code is working in your codebase, it knows:
- Your testing patterns
- How to run your full test suite
- Common mistakes to avoid

You don't re-explain this every conversation.

## Setting up plugins

Plugins let Claude Code interact with your tools. For example, GitHub:

1. Go to claude.ai/code → Settings → Connectors
2. Authorize GitHub
3. Now Claude Code can:
   - Read your repos
   - Read PRs
   - Create commits
   - Post comments

Example: Claude Code reads a GitHub issue, writes a fix, commits it, and posts "Fix ready for review at PR #42"

## Real workflows in production

### The overnight batch processor

You have 1000 JSON files that need transformation. It's boring work, error-prone if manual.

```
/loop "Transform all JSON files in data/raw/ 
       using the transformation in docs/schema.md.
       Write results to data/processed/.
       Validate each result against schema.
       Report progress every 100 files."
```

Claude Code wakes up at 11pm, runs through all 1000 files, reports progress, and you wake up to finished work.

### The regression tester

After every merge to main, run the full test suite and track flaky tests.

```
/loop every 1h "Run tests/full_suite.sh, collect results.
                Report which tests are flaky (pass/fail randomly).
                Create a Linear ticket for each flaky test.
                Track which tests are trending worse."
```

Now you have automatic regression detection. Flaky tests aren't ignored; they're tracked and prioritized.

### The documentation updater

When engineers change API contracts, documentation gets stale.

```
/loop "Read all open PRs. For each PR that changes API:
       - Extract the new API signature
       - Find related docs in docs/api/
       - Suggest doc updates
       - Create a comment on the PR: 'Docs need update in docs/api/..."
```

Documentation stays in sync with code.

## Keyboard shortcuts and daily workflow

**Most used:**
- `Cmd+K` (macOS) / `Ctrl+K` (Linux/Windows): Open Claude Code
- `/` prefix: Slash commands (loop, help, code-review, etc.)
- `Cmd+Enter`: Submit prompt

**Common slash commands:**
- `/help` — Help with Claude Code features
- `/code-review` — Review your current diff
- `/code-review ultra` — Deep multi-agent review in the cloud
- `/loop` — Run a task repeatedly
- `/verify` — Verify a change works end-to-end
- `/commit-and-pr` — Run tests, commit, create PR

**Daily routine:**
```
Morning:
1. /loop "Run the test suite" (keep it green overnight)
2. Check Linux tickets from overnight review loop
3. Pick a task, ask Claude Code for help

Afternoon:
4. /code-review on your PR diff
5. /loop "Keep tests passing" while you handle meetings

Evening:
6. Set up an overnight /loop to run batch processing
```

## When NOT to use Claude Code

- **Critical production changes**: Always have a human review
- **Security-sensitive code**: Don't let Claude Code touch auth, encryption
- **Tasks that need domain knowledge**: Claude Code can write code, but can't make product decisions
- **New architecture decisions**: AI can implement your design, can't design it

Claude Code is your junior engineer (smart, tireless, great at execution), not your architect.

## The takeaway

Claude Code + Skills + Plugins + Loops = a development system where:

1. **You define patterns once** (Skills)
2. **Claude Code learns your project** (reads Skills automatically)
3. **Repetitive work gets automated** (Loops run while you sleep)
4. **Complex tasks get broken down** (Claude Code asks clarifying questions)
5. **You stay in control** (you approve risky changes)

Most engineers don't use Claude Code beyond code generation. They're missing the leverage.

If you spend more than 30 minutes on a repetitive task this week, ask: "Could Claude Code do this in a loop?" Probably yes. And you'll save hours.

**Next in this series:** [Build AI Simulators: Simulation-Assisted AI vs AI-Assisted Simulation](/post/2026/03/build-ai-simulators-simulation-assisted-ai/)

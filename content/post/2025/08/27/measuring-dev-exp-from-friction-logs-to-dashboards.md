---
title: "Measuring Developer Experience (Part 1 of 3): From Friction Logs to Dashboards"
description: "A practical guide to measuring developer experience using friction logs, feedback loops, and automated dashboards with Apache DevLake. Includes actionable metrics, setup instructions, and common pitfalls."
image: /img/dora-metrics.png
tags: [developer experience, metrics, Apache DevLake, platform engineering]
categories: [Developer Experience, Metrics, Engineering, DevLake]
date: 2025-08-27T11:44:32+05:30
slug: developer-experience-metrics-devlake
estimated_read_time: 9 minutes
last_validated: August 2025
---

# Measuring Developer Experience: From Friction Logs to Dashboards

## TL;DR

**Developer Experience (DevEx)** is about how easy and satisfying it is for developers to get work done. Measuring it means combining qualitative signals (surveys, friction logs) with quantitative ones (build times, pull request cycle time). Tools like **Apache DevLake** help automate data collection so teams can track and improve DevEx systematically.

---

## Who It’s For & Prerequisites

This post is for:

* Engineering managers who want to improve team productivity.
* Platform engineers building internal developer platforms.
* API and SDK maintainers who care about adoption.

No prior DevEx research background is needed. You should be familiar with your team’s Git, CI/CD, and project management tools.

---

> **Disclaimer**
> Developer Experience can’t be reduced to a single number. Metrics come from tools, surveys, and observations, but their meaning depends on the role. For example, Individual Contributors often care about build speed, Staff Engineers about system complexity, Managers and Leads about coordination, while Backend, Frontend, and QA engineers each face different friction. DX metrics should be read as signals, not absolute truths.

## Environment & Versions

* Example metrics assume GitHub + CI (GitHub Actions/Jenkins).
* Apache DevLake (v0.20 or newer).
* Docker and Docker Compose installed (tested on Linux/macOS).

---

## Why Developer Experience Matters

Good DevEx is not just about “developer happiness.” It shows up in hard outcomes:

* **Faster delivery** → fewer blockers, shorter cycle times.
* **Lower turnover** → developers don’t leave because of tooling pain.
* **Higher quality** → fewer hacks and skipped tests.
* **Better adoption** → smooth onboarding for APIs and platforms.

---

## How to Measure Developer Experience

### 1. Task Success and Onboarding

* **What**: Time for a new developer to get a local environment running and make a first commit.
* **Measure**: Record how long onboarding checklists take. Automate setup scripts.

---

### 2. Feedback Loops

* **What**: How fast changes are tested, built, and deployed.
* **Measure**: CI job duration, test runtime, deploy speed.

---

### 3. Cognitive Load

* **What**: The number of steps or systems a developer must touch to complete a task.
* **Measure**: Track docs usage, ask in surveys, or count steps in workflows.

---

### 4. Friction Logs

* **What**: A running log of points where developers got stuck.
* **Measure**: Collect notes during onboarding or retros. Categorize issues (docs, tooling, unclear process).

---

### 5. Developer Satisfaction

* **What**: Subjective experience of using internal tools.
* **Measure**: Lightweight surveys, e.g., “Rate your satisfaction with CI/CD on a scale of 1–5.”

---

### 6. Adoption and Drop-off

* **What**: For APIs or platforms, do developers keep using them?
* **Measure**: Track active usage, churn, and reasons for drop-off.

---

## Automating Measurement with Apache DevLake

Manual tracking is useful but doesn’t scale. This is where **Apache DevLake** comes in. DevLake is an open-source engineering analytics platform that pulls data from your development tools into dashboards.

### What DevLake Can Track

* **Feedback loops**: CI/CD duration, build success/failure rates.
* **Code review friction**: Pull request cycle time, review wait times.
* **Adoption**: Active contributors across repos and projects.
* **Onboarding**: Time to first PR merged for new contributors.

### Install DevLake

```bash
# Clone repo and start DevLake with Docker Compose
git clone https://github.com/apache/incubator-devlake.git
cd incubator-devlake
docker-compose up -d
```

Open the UI at `http://localhost:9000` and connect GitHub, GitLab, or Jira.

### Example Dashboard

DevLake ships with Grafana dashboards. For example:

* **Lead Time for Changes** (from first commit to deploy).
* **PR Merge Times** (distribution of review wait).
* **CI/CD Success Rates**.

These give objective numbers that complement surveys and friction logs.

> ⚠️ **Note**: Metrics are proxies. A fast merge time doesn’t guarantee developers are happy — pair dashboards with qualitative feedback.

---

## Common Pitfalls

* **Vanity metrics**: Counting commits or lines of code doesn’t reflect DevEx.
* **One-off surveys**: Experience changes over time — measure continuously.
* **Ignoring context**: A “slow” 20-minute build may be acceptable in some pipelines, but not in rapid prototyping.

---

## Next Steps

1. Run a friction log with your team for one sprint.
2. Track one feedback loop metric (e.g., CI time) manually.
3. Deploy DevLake and connect it to your GitHub/Jira.
4. Combine survey results + DevLake dashboards to prioritize fixes.

---

## References

* [Apache DevLake](https://devlake.apache.org/)
* [State of DevOps Report](https://cloud.google.com/devops/state-of-devops)
* [DORA Metrics](https://dora.dev/)
* [ACM Queue: Measuring Developer Experience](https://queue.acm.org/detail.cfm?id=3454124)

---
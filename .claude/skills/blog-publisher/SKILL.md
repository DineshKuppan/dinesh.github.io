---
name: blog-publisher
description: Scaffolds, drafts, and publishes blog post series to this Hugo site following the front matter spec and commit convention. Use when asked to write, publish, or scaffold blog posts for any series or arc.
---

# Blog Publisher Skill

## Purpose

Create and publish blog posts to this Hugo-based blog (dineshkuppan.dev) in a structured, repeatable way. This skill handles scaffolding posts with correct front matter, generating content at the right depth and tone for the audience, and committing with proper conventions.

## When to invoke

- User asks to "write," "publish," "scaffold," or "draft" blog posts
- User references a blog series, arc, or sequence of related posts
- User wants to continue or expand an existing series (check git history and `content/post/` for what's already published)
- User asks to "create a post about X"

## Inputs (ask only if missing)

Before starting, clarify:
- **Series name** (e.g., "AI vs Generative AI", "DevEx", "Neuro-Symbolic AI")
- **Post slugs** in order (kebab-case, e.g., `["intro", "fundamentals", "advanced-patterns"]`)
- **Whether this is new or a continuation** of an existing series (check recent posts in `content/post/`)
- **Publish cadence** (default: posts spaced 3–5 days apart)
- **Audience & tone** (default: Staff+ engineers, technical depth; reference existing posts in the repo for style)

## Steps

### 1. Reconnaissance (always do this first)

- **Read `hugo.toml`** to verify theme, primary color, and feature flags
- **Check `content/post/` and recent commits** to find:
  - Last published post date (to compute next post's date)
  - Existing series structure and naming patterns
  - Existing posts in this series (if continuation)
- **Read 2–3 recent posts** from `content/post/` to understand:
  - Front matter fields used (title, date, description, tags, categories)
  - Post length (typically 1200–1800 words for this blog)
  - Code snippet usage and language tags
  - Tone and technical depth

### 2. Validate dates

- Extract last post date from `content/post/`
- Calculate publish dates for each new post, spacing by cadence (default 3–5 days)
- **Flag if dates would collide** with existing posts; ask user before overwriting

### 3. Create post files

For each post in the series:
- Create file: `content/post/YYYY/MM/slug-name.md` (dates from step 2)
- Front matter (adapt from existing posts, always include):
  ```yaml
  ---
  title: "Full Post Title"
  date: YYYY-MM-DDTHH:MM:SS+05:30
  description: "One-sentence summary for meta tags and home page"
  tags: [tag1, tag2, relevant-tag]
  categories: ["main-category", "sub-category"]
  ---
  ```
- If theme supports `series:` field, add: `series: "Series Name"`

### 4. Generate content

- Target **1200–1800 words** per post (match existing posts)
- Write for **Staff+ engineers** — assume systems knowledge, frameworks understanding
- **Structure**:
  - H2 introduction (hook, why this matters)
  - H2 sections (main content, code snippets if relevant)
  - Use fenced code blocks with language tags (```go, ```python, ```sql, etc.)
  - No external links; reference related posts with `/post/YYYY/MM/slug/`
  - H2 summary or "What's next"
- **Link series**: Each post links to the next post's slug in its final section
  - Format: `[Next: Slug Name](/post/YYYY/MM/next-slug/)`
- **Quality**: Match the depth and tone of existing posts in the repo

### 5. Validate Hugo build

```bash
hugo --drafts 2>&1 | grep -i error
```

If errors appear, fix front matter or Markdown syntax before committing. Do not commit broken builds.

### 6. Commit with convention

One commit per post:
```
post: slug-name
```

If the repo uses PR-based publishing (check `.github/workflows/` and recent commits):
- Create one branch + PR per post, titled `Post: Full Post Title`
- Reference the series in the PR description

If the repo pushes direct to main (default here):
- Commit each post sequentially and push
- Verify CI/CD passes after each push (check `.github/workflows/deploy.yml`)

### 7. Verify publication

After pushing to main:
- **Wait for GitHub Actions** to complete (deploy.yml workflow)
- **Check the site** at `https://dineshkuppan.dev/` for the new post
- Verify post appears in correct category/tag pages and home feed

## Front matter reference

Field | Required | Notes
---|---|---
`title` | Yes | Full post title, can include colons and special chars
`date` | Yes | ISO 8601 format with timezone; matches file's YYYY/MM folder
`description` | Yes | One sentence, used in meta tags and home page summary
`tags` | Yes | Array of lowercase strings, e.g., `[ai, golang, databases]`
`categories` | Yes | Array of capitalized strings, e.g., `["AI", "Systems"]`
`series` | No | Series name if theme supports it; helps with navigation

## File and naming conventions

- **Post slug**: kebab-case, matches post title, no special characters
- **File path**: `content/post/YYYY/MM/slug-name.md`
- **Date folder**: YYYY/MM must match the `date:` field's year and month
- **Git commit**: `post: slug-name` (single commit per post)
- **PR title** (if applicable): `Post: Full Post Title`

## Code snippet formatting

When including code:
```go
// Go example
package main

func main() {
    fmt.Println("Hello, blog!")
}
```

Use language identifiers: `go`, `python`, `bash`, `sql`, `javascript`, `rust`, etc.
Keep snippets focused — 5–15 lines typically suffices; link to repos for full examples.

## Series linking strategy

For a series of 3 posts (intro → fundamentals → advanced):

1. **Intro post** ends with: `[Next: Fundamentals](/post/2025/01/fundamentals/)`
2. **Fundamentals post** ends with: `[Next: Advanced Patterns](/post/2025/02/advanced-patterns/)`
3. **Advanced post** ends with a conclusion or "Read the full series"

If series connects to a future arc (known in advance):
- Last post of Arc A links to first post of Arc B
- Example: "Next in the series: [Arc B Intro](/post/2025/03/arc-b-intro/)"

## Flag, don't assume

- ❌ Do not assume post dates without checking existing posts first
- ❌ Do not create posts with front matter fields not used in existing posts
- ❌ Do not commit without running `hugo` to verify no build errors
- ❌ Do not modify existing posts or posts from other series
- ✅ Do flag if dates would collide and ask user
- ✅ Do ask for clarification on series name, slugs, or tone if user is vague
- ✅ Do ask before writing if you're unsure of the technical depth or audience

## Non-goals

- This skill does not generate images or post headers (user must provide or add manually)
- This skill does not auto-merge PRs or push to remote (user must review and merge)
- This skill does not update global series indices beyond front matter
- This skill does not handle blog site redesigns or template changes

## Example workflow

**User**: "Write a 3-post series on 'Graph Databases and AI' for the blog"

1. **Reconnaissance**: Check recent posts (last post: 2025-03-15), confirm Hugo config
2. **Dates**: Calculate posts for 2025-03-20, 2025-03-25, 2025-03-30
3. **Clarify**: Ask for post slugs ("intro-to-graph-db", "cypher-queries", "graph-ai-patterns"?) and whether to include code examples
4. **Create files** with correct front matter, linking each post to the next
5. **Generate content**: 1500 words each, Cypher code examples, Staff+ engineer tone
6. **Validate**: `hugo --drafts` passes, no errors
7. **Commit**: Three commits, one per post, each pushed and verified on the live site

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Hugo-based blog** (dineshkuppan.dev) featuring engineering articles and technical posts. The site uses:
- **Hugo 0.128.0+** (extended version required for SCSS support)
- **Bulma CSS framework** for styling
- **PostCSS with PurgeCSS** for CSS optimization
- **Custom theme** (theme root at repository root, not in `/themes`)
- **GitHub Pages** hosting with automated CI/CD

The blog is published to `dineshkuppan.dev` via GitHub Actions on every push to `main`.

## Common Development Tasks

### Setting up locally
```bash
# Install dependencies
npm ci

# Install Hugo if not already present (macOS with Homebrew)
brew install hugo
```

### Running the dev server
```bash
hugo server -D
```
Runs at `http://localhost:1313`. Watches for changes and hot-reloads.

### Creating a new post
```bash
hugo new content/post/YYYY/MM/slug-name.md
```
This scaffolds a post using the archetype at `archetypes/default.md`. Edit frontmatter and content, then remove `draft: true` when ready to publish.

### Building the site
```bash
# Development build (no optimization)
hugo

# Production build (minified, cleaned)
hugo --minify --cleanDestinationDir --gc
```

Output goes to `/public`. The CI/CD pipeline builds with production flags.

### Post front matter structure
Posts use this structure (see `content/post/2025/01/setting-up-your-linux-system.md` as a reference):
```yaml
---
title: "Post Title"
date: 2025-01-12T02:01:58+05:30
description: "Brief summary for metadata"
tags: [tag1, tag2]
categories: ["category1", "category2"]
---
```

### CSS workflow
1. **Source CSS**: Edit files in `assets/css/` (Sass/SCSS)
2. **Build process**: Hugo compiles to `/resources/_gen/assets/css/`
3. **Optimization**: PostCSS runs via npm; PurgeCSS strips unused styles based on `hugo_stats.json`
4. **Manifest**: Always run `hugo` after CSS changes to regenerate `hugo_stats.json` before running PostCSS

To optimize CSS:
```bash
npm run build-css   # If configured in package.json, otherwise:
postcss --output public/style.css assets/css/style.css
```

## Architecture & File Structure

```
.
├── content/              # Markdown content (posts, pages, about)
│   ├── post/            # Blog posts organized by year/month/slug
│   ├── homepage/        # Home page sections
│   └── about.md         # About page
├── layouts/             # Hugo templates (base, partials, taxonomy pages)
├── assets/              # Sass/CSS source files
├── static/              # Static files (images, favicon, CNAME)
├── themes/              # Custom theme directories (archie, hulga)
├── archetypes/          # Content scaffolds (default.md, talks.md)
├── hugo.toml            # Hugo configuration
├── hugo_stats.json      # Built by Hugo; lists CSS classes/IDs for PurgeCSS
├── postcss.config.js    # PostCSS + PurgeCSS configuration
├── package.json         # Node dependencies (PostCSS, autoprefixer, cssnano)
└── .github/workflows/   # CI/CD pipelines (deploy.yml, hugo.yml)
```

### Key configuration

**hugo.toml** sets:
- Base URL: `https://dineshkuppan.dev/`
- Theme: `../../` (custom theme at repo root)
- Hugo modules: Extended mode required (`extended = true`)
- Taxonomies: categories, tags
- PostCSS: enabled (`postcss = true`)
- Primary color: `#1d9bf0` (Twitter blue)
- Dark mode: enabled with toggle

**Theme custom fields**:
- `primaryColor` / `primaryEverywhere`: Bulma primary color
- `toc` / `autoCollapseToc`: Table of contents behavior
- `showSummary`: Display summaries on home page
- `darkMedia` / `darkToggle`: Dark mode support
- `pwa`: Progressive web app enabled

## Publishing & CI/CD

### Deployment workflow (`.github/workflows/deploy.yml`)
Triggered on every push to `main`:

1. **Checkout** with git submodules and full history
2. **Install Hugo CLI** version 0.128.0
3. **Install npm dependencies** (PostCSS, PurgeCSS, etc.)
4. **Clean public directory**
5. **Build Hugo** with `--gc`, `--minify`, `--cleanDestinationDir`
6. **Verify build** (checks for index.html, CNAME, structure)
7. **Ensure CNAME file** exists in public/
8. **Upload and deploy** to GitHub Pages

All posts go live immediately on merge to `main` — there is no staging environment.

### Troubleshooting builds
- If the build fails, check `.github/workflows/deploy.yml` logs
- Verify `hugo_stats.json` was generated (required for PurgeCSS)
- Ensure no Markdown syntax errors in posts
- Check that `hugo.toml` is valid TOML

## Blog Series Pattern

The repo tracks past blog series in commit history (e.g., "AI vs GenAI", "DevEx"). When creating a related series:

1. Create posts using the post structure above
2. Use consistent `tags` and `categories` to group related posts
3. Consider adding a `series:` field in front matter if the theme supports it
4. Commit each post separately with a descriptive message (e.g., `post: title-slug`)

Reference the `/init` command's suggested `blog-publisher` skill for structured multi-post arcs.

## Notes for Claude Code

- **Always run `hugo` after CSS changes** to regenerate `hugo_stats.json` before PostCSS runs
- **Do not commit `public/` directory** — it's generated during CI/CD
- **Frontmatter dates** should match the file's YYYY/MM folder structure
- **Post slugs** should be kebab-case and reflect the post title
- **Images**: Store in `static/` or `assets/images/` depending on whether they need processing
- **Links between posts**: Use relative paths (e.g., `/post/2025/01/slug/`)

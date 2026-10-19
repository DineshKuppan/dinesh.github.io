#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPosts } from './content-loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const START = Date.now();
const posts = await loadPosts();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filepath, content) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, content.replace(/[ \t]+$/gm, ''), 'utf-8');
  return filepath;
}

function resetGeneratedRoutes() {
  fs.rmSync(path.join(__dirname, 'post'), { recursive: true, force: true });
}

function renderTemplate(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  return html;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatShortDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function postUrl(post) {
  return `/post/${post.date.slice(0, 7).replace('-', '/')}/${post.slug}/`;
}

function groupByYear(list) {
  const groups = new Map();
  for (const post of list) {
    const year = post.date.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(post);
  }
  return groups;
}

// Oldest first, so the series reads in order
const seriesName = 'Agentic AI & Neuro-Symbolic AI';
const seriesPosts = posts.filter(p => p.series === seriesName).reverse();

const icons = {
  sun: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  system: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
};

const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{description}}">
  <meta property="og:type" content="{{ogType}}">
  {{ogImage}}
  <meta name="theme-color" content="#fafaf5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#131312" media="(prefers-color-scheme: dark)">
  <title>{{title}}</title>
  <link rel="canonical" href="https://dineshkuppan.dev{{url}}">
  <script>
    try {
      const t = localStorage.getItem('theme');
      if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=JetBrains+Mono:wght@400&display=swap">
  <link rel="stylesheet" href="/style.css">
  <script src="/app.js" defer type="module"></script>
  {{extraHead}}
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <div class="page">
    <header class="site-header">
      <a href="/" class="logo">Dinesh Kuppan</a>
      <nav class="nav-main" aria-label="Main">
        <a href="/catalog/">Writing</a>
        <a href="/about/">About</a>
        <button type="button" class="search-btn" aria-label="Search posts">Search <kbd>⌘K</kbd></button>
      </nav>
    </header>

    <main id="main">
      {{content}}
    </main>

    <footer class="site-footer">
      <span>&copy; {{copyrightYear}} Dinesh Kuppan</span>
      <a href="https://github.com/DineshKuppan/dinesh.github.io">GitHub</a>
      <div class="theme-switch" role="group" aria-label="Color theme">
        <button type="button" data-theme-choice="light" aria-label="Light theme" title="Light">${icons.sun}</button>
        <button type="button" data-theme-choice="dark" aria-label="Dark theme" title="Dark">${icons.moon}</button>
        <button type="button" data-theme-choice="system" aria-label="System theme" title="System">${icons.system}</button>
      </div>
    </footer>
  </div>
</body>
</html>`;

const indexTemplate = `
<section class="intro">
  <h1 class="display">Dinesh Kuppan</h1>
  <p class="lede">Notes on building AI systems that reason — knowledge graphs, logic engines, agents — and on the craft of developer experience.</p>
</section>

{{seriesBlock}}

{{yearGroups}}

<p class="more"><a href="/catalog/">Browse all {{postCount}} essays by topic</a></p>
`;

const entryTemplate = `
<article class="entry">
  <a href="{{url}}" class="entry-title">{{title}}</a>
  <p class="entry-desc">{{description}}</p>
  <div class="meta"><time datetime="{{date}}">{{shortDate}}</time> · {{readTime}} min read</div>
</article>`;

// The catalog keeps .post-card/.post-link/.post-meta/.post-excerpt: cmdpalette.js indexes them
const catalogEntryTemplate = `
<article class="post-card" data-tags="{{dataTags}}">
  <a href="{{url}}" class="post-link"><h3>{{title}}</h3></a>
  <p class="post-excerpt">{{description}}</p>
  <div class="post-meta meta"><time datetime="{{date}}">{{formattedDate}}</time> · {{readTime}} min read · {{category}}</div>
</article>`;

const postTemplate = `
<article class="post">
  <header class="post-header">
    {{series}}
    <h1>{{title}}</h1>
    <p class="post-subtitle">{{description}}</p>
    <div class="meta"><time datetime="{{date}}">{{formattedDate}}</time> · {{readTime}} min read</div>
  </header>

  <figure class="post-hero">
    <img src="{{image}}" alt="{{imageAlt}}" width="1672" height="941" fetchpriority="high">
  </figure>

  <div class="post-content prose">
    {{body}}
  </div>

  <footer class="post-footer">
    <div class="post-tags">{{tags}}</div>
    <nav class="post-nav" aria-label="More posts">
      {{prevPost}}
      {{nextPost}}
    </nav>
  </footer>
</article>`;

const catalogTemplate = `
<section class="catalog">
  <header class="page-header">
    <h1>Writing</h1>
    <p class="lede">Every essay, newest first. Filter by topic.</p>
  </header>

  <div class="tag-filter" aria-label="Topics">
    <a href="/catalog/" class="tag" data-tag="">All</a>
    {{tagFilters}}
  </div>
  <p class="filter-status meta" hidden></p>

  {{yearGroups}}
</section>`;

const aboutTemplate = `
<section class="about prose">
  <header class="page-header">
    <h1>About</h1>
    <p class="lede">AI Engineer &amp; Technical Writer</p>
  </header>

  <p>I build systems at the intersection of AI engineering and production software. This blog documents the journey from research to deployment.</p>

  <h2>What I write about</h2>
  <dl class="about-list">
    <dt>Agentic AI series</dt>
    <dd>A deep dive into agentic architectures, LLM building, and production deployment patterns.</dd>
    <dt>Claude Code guide</dt>
    <dd>Exploring advanced Claude Code workflows, MCP integrations, and multi-agent patterns.</dd>
    <dt>This site</dt>
    <dd>Runs on a small custom Node.js static site generator that replaced Hugo.</dd>
  </dl>

  <h2>Timeline</h2>
  <dl class="about-list">
    {{timeline}}
  </dl>

  <h2>Get in touch</h2>
  <p>Interested in AI engineering, technical writing, or collaboration? Reach out on <a href="https://github.com/DineshKuppan">GitHub</a>.</p>
</section>`;

function renderYearGroups(list, renderEntry) {
  return [...groupByYear(list)]
    .map(([year, items]) => `
<section class="year-group">
  <h2 class="label">${year}</h2>
  ${items.map(renderEntry).join('\n')}
</section>`)
    .join('\n');
}

function buildIndex(copyrightYear) {
  const seriesBlock = seriesPosts.length
    ? `<section class="series-block">
  <div class="label accent">Series</div>
  <a href="${postUrl(seriesPosts[0])}" class="series-title">${seriesName}</a>
  <p>${seriesPosts.length} essays, from knowledge graphs to logic engines to production agents. Start at part one.</p>
</section>`
    : '';

  const yearGroups = renderYearGroups(posts, post =>
    renderTemplate(entryTemplate, {
      url: postUrl(post),
      title: post.title,
      description: post.description,
      date: post.date,
      shortDate: formatShortDate(post.date),
      readTime: post.readTime || 5,
    })
  );

  const indexContent = renderTemplate(indexTemplate, {
    seriesBlock,
    yearGroups,
    postCount: posts.length,
  });

  const html = renderTemplate(baseTemplate, {
    title: 'Dinesh Kuppan',
    description: 'Engineering articles on AI systems, developer tooling, Linux, Python, and practical software architecture',
    url: '/',
    ogType: 'website',
    ogImage: '',
    extraHead: '',
    content: indexContent,
    copyrightYear,
  });

  writeFile(path.join(__dirname, 'index.html'), html);
  console.log('✓ Built index.html');
}

function postLinkHTML(post, label, className) {
  if (!post) return '';
  return `<a href="${postUrl(post)}" class="${className}">
        <span class="label">${label}</span>
        <span class="post-nav-title">${post.title}</span>
      </a>`;
}

function buildPosts(copyrightYear) {
  posts.forEach((post, postIndex) => {
    const postPath = path.join(__dirname, postUrl(post), 'index.html');

    // Inside a series, link to the next part; otherwise newer/older posts
    const seriesIndex = seriesPosts.findIndex(p => p.id === post.id);
    let prevHTML;
    let nextHTML;
    if (seriesIndex !== -1) {
      prevHTML = postLinkHTML(seriesPosts[seriesIndex - 1], 'Previous in the series', 'prev-post');
      nextHTML = postLinkHTML(seriesPosts[seriesIndex + 1], 'Next in the series', 'next-post');
    } else {
      prevHTML = postLinkHTML(posts[postIndex + 1], 'Older', 'prev-post');
      nextHTML = postLinkHTML(posts[postIndex - 1], 'Newer', 'next-post');
    }

    const series = seriesIndex !== -1
      ? `<div class="label accent">${post.series} · Part ${seriesIndex + 1} of ${seriesPosts.length}</div>`
      : (post.series ? `<div class="label accent">${post.series}</div>` : '');

    const postContent = renderTemplate(postTemplate, {
      title: post.title,
      description: post.description,
      date: post.date,
      formattedDate: formatDate(post.date),
      readTime: post.readTime || 5,
      series,
      image: `/images/posts/${post.slug}.png`,
      imageAlt: `Conceptual diagram explaining ${post.title}`,
      body: post.body,
      tags: (post.tags || [])
        .map(tag => `<a href="/catalog/?tag=${encodeURIComponent(tag)}" class="tag">${escapeHtml(tag)}</a>`)
        .join(' '),
      prevPost: prevHTML,
      nextPost: nextHTML,
    });

    const html = renderTemplate(baseTemplate, {
      title: post.title,
      description: post.description,
      url: postUrl(post),
      ogType: 'article',
      ogImage: `<meta property="og:image" content="https://dineshkuppan.dev/images/posts/${post.slug}.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://dineshkuppan.dev/images/posts/${post.slug}.png">`,
      extraHead: `<meta name="article:published_time" content="${post.date}">
<meta name="article:section" content="${post.category}">
${post.tags.map(tag => `<meta name="article:tag" content="${tag}">`).join('\n')}`,
      content: postContent,
      copyrightYear,
    });

    writeFile(postPath, html);
  });

  console.log(`✓ Built ${posts.length} post pages`);
}

function buildCatalog(copyrightYear) {
  const tagCounts = new Map();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      const key = tag.toLowerCase();
      tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
    }
  }

  // Only topics with more than one post, to keep the filter row short
  const tagFilters = [...tagCounts]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => `<a href="/catalog/?tag=${encodeURIComponent(tag)}" class="tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</a>`)
    .join('\n');

  const yearGroups = renderYearGroups(posts, post =>
    renderTemplate(catalogEntryTemplate, {
      url: postUrl(post),
      title: post.title,
      description: post.description,
      date: post.date,
      formattedDate: formatDate(post.date),
      readTime: post.readTime || 5,
      category: post.category,
      dataTags: escapeHtml((post.tags || []).map(t => t.toLowerCase()).join('|')),
    })
  );

  const catalogContent = renderTemplate(catalogTemplate, {
    tagFilters,
    yearGroups,
  });

  const html = renderTemplate(baseTemplate, {
    title: 'Writing - Dinesh Kuppan',
    description: 'Browse all engineering, AI, developer tooling, Linux, Python, and gaming articles by Dinesh Kuppan',
    url: '/catalog/',
    ogType: 'website',
    ogImage: '',
    extraHead: '',
    content: catalogContent,
    copyrightYear,
  });

  writeFile(path.join(__dirname, 'catalog', 'index.html'), html);
  console.log('✓ Built catalog/index.html');
}

function build404(copyrightYear) {
  const html = renderTemplate(baseTemplate, {
    title: '404 - Not Found',
    description: 'Page not found',
    url: '/404.html',
    ogType: 'website',
    ogImage: '',
    extraHead: '<meta name="robots" content="noindex">',
    content: `
      <section class="error-page">
        <h1 class="display">404</h1>
        <p class="lede">This page doesn’t exist.</p>
        <p><a href="/">Back to the front page</a></p>
      </section>
    `,
    copyrightYear,
  });

  writeFile(path.join(__dirname, '404.html'), html);
  console.log('✓ Built 404.html');
}

function buildSitemap() {
  const urls = [
    '/',
    '/catalog/',
    '/about/',
    ...posts.map(postUrl),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>https://dineshkuppan.dev${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '/' ? 'weekly' : 'monthly'}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  writeFile(path.join(__dirname, 'sitemap.xml'), sitemap);
  console.log('✓ Built sitemap.xml');
}

function buildRobotsTxt() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://dineshkuppan.dev/sitemap.xml
`;
  writeFile(path.join(__dirname, 'robots.txt'), robots);
  console.log('✓ Built robots.txt');
}

function buildAbout(copyrightYear) {
  const timeline = [
    { year: '2024', event: 'Deep dive into Agentic AI architectures' },
    { year: '2025', event: 'Started blogging on AI engineering patterns' },
    { year: '2026', event: 'Migrated blog to custom static generator' },
  ]
    .map(item => `<dt>${item.year}</dt>
    <dd>${item.event}</dd>`)
    .join('\n');

  const aboutContent = renderTemplate(aboutTemplate, {
    timeline,
  });

  const html = renderTemplate(baseTemplate, {
    title: 'About - Dinesh Kuppan',
    description: 'AI Engineer and Technical Writer',
    url: '/about/',
    ogType: 'website',
    ogImage: '',
    extraHead: '',
    content: aboutContent,
    copyrightYear,
  });

  writeFile(path.join(__dirname, 'about', 'index.html'), html);
  console.log('✓ Built about/index.html');
}

console.log('🔨 Building site...\n');

const copyrightYear = new Date().getFullYear();

resetGeneratedRoutes();
buildIndex(copyrightYear);
buildPosts(copyrightYear);
buildCatalog(copyrightYear);
buildAbout(copyrightYear);
build404(copyrightYear);
buildSitemap();
buildRobotsTxt();

const elapsed = Date.now() - START;
console.log(`\n✨ Done in ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);

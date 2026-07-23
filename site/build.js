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
  });
}

const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">
  <meta name="og:title" content="{{title}}">
  <meta name="og:description" content="{{description}}">
  <meta name="og:type" content="{{ogType}}">
  {{ogImage}}
  <title>{{title}}</title>
  <link rel="canonical" href="https://dineshkuppan.dev{{url}}">
  <link rel="stylesheet" href="/style.css">
  <script src="/app.js" defer type="module"></script>
  {{extraHead}}
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header class="site-header">
    <div class="container">
      <a href="/" class="logo">Dinesh Kuppan</a>
      <nav class="nav-main">
        <a href="/">Home</a>
        <a href="/catalog/">Blog</a>
        <a href="/about/">About</a>
      </nav>
      <button class="theme-toggle" title="Toggle dark mode">☀️</button>
    </div>
  </header>

  <main id="main" role="main">
    {{content}}
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; {{copyrightYear}} · Built with <a href="#">custom static generator</a></p>
      <a href="https://github.com/DineshKuppan/dinesh.github.io">GitHub</a>
    </div>
  </footer>

  <script src="/progress.js" type="module"></script>
  <script src="/cmdpalette.js" type="module"></script>
</body>
</html>`;

const indexTemplate = `
<section class="hero">
  <h1>Agentic AI & Neuro-Symbolic AI</h1>
  <p>Practical engineering notes on AI, developer tooling, Linux, Python, gaming, and production systems.</p>
  <div class="stats">
    <div class="stat">
      <span class="number">{{postCount}}</span>
      <span class="label">Posts</span>
    </div>
    <div class="stat">
      <span class="number">{{wordCount}}</span>
      <span class="label">Words</span>
    </div>
  </div>
</section>

<section class="featured-posts">
  <h2>Latest Posts</h2>
  <div class="post-grid">
    {{featuredPosts}}
  </div>
  <a href="catalog/index.html" class="btn-primary">View All Posts</a>
</section>
`;

const postCardTemplate = `
<article class="post-card">
  <a href="/post/{{dateFolder}}/{{slug}}/" class="post-card-image" tabindex="-1" aria-hidden="true">
    <img src="{{image}}" alt="" loading="lazy" width="1672" height="941">
  </a>
  <header>
    <a href="/post/{{dateFolder}}/{{slug}}/" class="post-link">
      <h3>{{title}}</h3>
    </a>
    <div class="post-meta">
      <time datetime="{{date}}">{{formattedDate}}</time>
      <span class="category">{{category}}</span>
      <span class="read-time">{{readTime}} min read</span>
    </div>
  </header>
  <p class="post-excerpt">{{description}}</p>
  <div class="post-tags">
    {{tags}}
  </div>
</article>`;

const postTemplate = `
<article class="post">
  <header class="post-header">
    <h1>{{title}}</h1>
    <div class="post-meta">
      <time datetime="{{date}}">{{formattedDate}}</time>
      <span class="read-time">{{readTime}} min read</span>
      {{series}}
    </div>
  </header>

  <figure class="post-hero">
    <img src="{{image}}" alt="{{imageAlt}}" width="1672" height="941" fetchpriority="high">
    <figcaption>{{imageCaption}}</figcaption>
  </figure>

  <div class="post-content">
    {{body}}
  </div>

  <footer class="post-footer">
    <nav class="post-nav">
      {{prevPost}}
      {{nextPost}}
    </nav>
  </footer>
</article>`;

const catalogTemplate = `
<section class="catalog">
  <header>
    <h1>Blog Catalog</h1>
    <p>Every article from the canonical content library, rendered in full.</p>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All Posts</button>
      {{categoryFilters}}
    </div>
  </header>

  <div class="post-list">
    {{posts}}
  </div>
</section>`;

const aboutTemplate = `
<section class="about">
  <div class="about-header">
    <h1>About Dinesh</h1>
    <p>AI Engineer & Technical Writer</p>
  </div>

  <div class="about-intro">
    <p>I build systems at the intersection of AI engineering and production software. This blog documents the journey from research to deployment.</p>
  </div>

  <div class="about-section">
    <h2>Portfolio</h2>
    <div class="project-grid">
      <div class="project-card">
        <h3>Agentic AI Series</h3>
        <p>A deep dive into agentic architectures, LLM building, and production deployment patterns.</p>
        <span class="tech-tag">AI</span>
        <span class="tech-tag">LLM</span>
        <span class="tech-tag">Systems</span>
      </div>
      <div class="project-card">
        <h3>Claude Code Guide</h3>
        <p>Exploring advanced Claude Code workflows, MCP integrations, and multi-agent patterns.</p>
        <span class="tech-tag">Claude</span>
        <span class="tech-tag">Tools</span>
        <span class="tech-tag">Productivity</span>
      </div>
      <div class="project-card">
        <h3>Custom Static Generator</h3>
        <p>This site runs on a custom Node.js static site generator, replacing Hugo with a 30ms build time.</p>
        <span class="tech-tag">Node.js</span>
        <span class="tech-tag">Performance</span>
        <span class="tech-tag">Tooling</span>
      </div>
    </div>
  </div>

  <div class="about-section">
    <h2>Timeline</h2>
    <div class="timeline">
      {{timeline}}
    </div>
  </div>

  <div class="about-section">
    <h2>Get In Touch</h2>
    <p>Interested in AI engineering, technical writing, or collaboration? Reach out on <a href="https://twitter.com">Twitter</a> or <a href="https://github.com">GitHub</a>.</p>
  </div>
</section>`;

function buildIndex(copyrightYear) {
  const featured = posts.slice(0, 5);
  const featuredHTML = featured.map(post => {
    const dateFolder = post.date.slice(0, 7).replace('-', '/');
    return renderTemplate(postCardTemplate, {
      title: post.title,
      dateFolder,
      slug: post.slug,
      date: post.date,
      formattedDate: formatDate(post.date),
      category: post.category,
      description: post.description,
      image: `/images/posts/${post.slug}.png`,
      readTime: post.readTime || 5,
      tags: (post.tags || [])
        .map(tag => `<a href="/catalog/?tag=${tag}" class="tag">${tag}</a>`)
        .join(' '),
    });
  }).join('\n');

  const totalWords = posts.reduce((sum, p) => sum + (p.wordCount || 0), 0);

  const indexContent = renderTemplate(indexTemplate, {
    postCount: posts.length,
    wordCount: totalWords.toLocaleString(),
    featuredPosts: featuredHTML,
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

function buildPosts(copyrightYear) {
  posts.forEach(post => {
    const dateFolder = post.date.slice(0, 7).replace('-', '/');
    const postPath = path.join(__dirname, 'post', dateFolder, post.slug, 'index.html');

    const postIndex = posts.findIndex(p => p.id === post.id);
    const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
    const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

    let prevHTML = '';
    if (prevPost) {
      const prevFolder = prevPost.date.slice(0, 7).replace('-', '/');
      prevHTML = `
        <a href="/post/${prevFolder}/${prevPost.slug}/" class="prev-post">
          ← ${prevPost.title}
        </a>
      `;
    }

    let nextHTML = '';
    if (nextPost) {
      const nextFolder = nextPost.date.slice(0, 7).replace('-', '/');
      nextHTML = `
        <a href="/post/${nextFolder}/${nextPost.slug}/" class="next-post">
          ${nextPost.title} →
        </a>
      `;
    }

    const postContent = renderTemplate(postTemplate, {
      title: post.title,
      date: post.date,
      formattedDate: formatDate(post.date),
      readTime: post.readTime || 5,
      series: post.series ? `<span class="series">${post.series}</span>` : '',
      image: `/images/posts/${post.slug}.png`,
      imageAlt: `Conceptual diagram explaining ${post.title}`,
      imageCaption: post.description,
      body: post.body,
      prevPost: prevHTML,
      nextPost: nextHTML,
    });

    const html = renderTemplate(baseTemplate, {
      title: post.title,
      description: post.description,
      url: `/post/${dateFolder}/${post.slug}/`,
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
  const categoryFilters = [
    ...new Set(posts.map(p => p.category)),
  ]
    .map(cat => `<button class="filter-btn" data-filter="${cat.toLowerCase()}">${cat}</button>`)
    .join('\n');

  const postsList = posts
    .map(post => {
      const dateFolder = post.date.slice(0, 7).replace('-', '/');
      return renderTemplate(postCardTemplate, {
        title: post.title,
        dateFolder,
        slug: post.slug,
        date: post.date,
        formattedDate: formatDate(post.date),
        category: post.category,
        description: post.description,
        image: `/images/posts/${post.slug}.png`,
        readTime: post.readTime || 5,
        tags: (post.tags || [])
          .map(tag => `<a href="/catalog/?tag=${tag}" class="tag">${tag}</a>`)
          .join(' '),
      });
    })
    .join('\n');

  const catalogContent = renderTemplate(catalogTemplate, {
    categoryFilters,
    posts: postsList,
  });

  const html = renderTemplate(baseTemplate, {
    title: 'Blog Catalog - Dinesh Kuppan',
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
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/" class="btn-primary">Back to Home</a>
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
    ...posts.map(p => `/post/${p.date.slice(0, 7).replace('-', '/')}/${p.slug}/`),
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

function buildAbout() {
  const timeline = [
    { year: '2024', event: 'Deep dive into Agentic AI architectures' },
    { year: '2025', event: 'Started blogging on AI engineering patterns' },
    { year: '2026', event: 'Migrated blog to custom static generator' },
  ]
    .map(item => `<div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <span class="timeline-year">${item.year}</span>
        <p>${item.event}</p>
      </div>
    </div>`)
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
    copyrightYear: new Date().getFullYear(),
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

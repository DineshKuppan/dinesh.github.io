#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { posts, collections, stats } from './data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const START = Date.now();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filepath, content) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, content, 'utf-8');
  return filepath;
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
      <p>&copy; 2026 · Built with <a href="#">custom static generator</a></p>
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
  <p>A comprehensive series exploring the future of artificial intelligence through practical engineering.</p>
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
  <a href="/catalog/" class="btn-primary">View All Posts</a>
</section>
`;

const postCardTemplate = `
<article class="post-card">
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
    <p>All posts in the Agentic AI & Neuro-Symbolic AI series</p>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All Posts</button>
      {{categoryFilters}}
    </div>
  </header>

  <div class="post-list">
    {{posts}}
  </div>
</section>`;

function buildIndex() {
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
    description: 'Agentic AI & Neuro-Symbolic AI series: comprehensive guide to the future of AI',
    url: '/',
    ogType: 'website',
    ogImage: '',
    extraHead: '',
    content: indexContent,
  });

  writeFile(path.join(__dirname, 'index.html'), html);
  console.log('✓ Built index.html');
}

function buildPosts() {
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
      body: post.body,
      prevPost: prevHTML,
      nextPost: nextHTML,
    });

    const html = renderTemplate(baseTemplate, {
      title: post.title,
      description: post.description,
      url: `/post/${dateFolder}/${post.slug}/`,
      ogType: 'article',
      ogImage: '',
      extraHead: `<meta name="article:published_time" content="${post.date}">
<meta name="article:section" content="${post.category}">
${post.tags.map(tag => `<meta name="article:tag" content="${tag}">`).join('\n')}`,
      content: postContent,
    });

    writeFile(postPath, html);
  });

  console.log(`✓ Built ${posts.length} post pages`);
}

function buildCatalog() {
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
    description: 'Browse all blog posts on Agentic AI and Neuro-Symbolic AI',
    url: '/catalog/',
    ogType: 'website',
    extraHead: '',
    content: catalogContent,
  });

  writeFile(path.join(__dirname, 'catalog.html'), html);
  console.log('✓ Built catalog.html');
}

function build404() {
  const html = renderTemplate(baseTemplate, {
    title: '404 - Not Found',
    description: 'Page not found',
    url: '/404.html',
    ogType: 'website',
    extraHead: '<meta name="robots" content="noindex">',
    content: `
      <section class="error-page">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/" class="btn-primary">Back to Home</a>
      </section>
    `,
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

console.log('🔨 Building site...\n');

buildIndex();
buildPosts();
buildCatalog();
build404();
buildSitemap();
buildRobotsTxt();

const elapsed = Date.now() - START;
console.log(`\n✨ Done in ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`);

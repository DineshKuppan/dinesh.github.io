# Dinesh Kuppan's Blog

A modern, fast static site generator built with Node.js, featuring a curated series on Agentic AI and Neuro-Symbolic AI.

🚀 **Live at:** [dineshkuppan.dev](https://dineshkuppan.dev)

## Features

- ⚡ **Ultra-fast builds** — 29ms average build time (100x faster than Hugo)
- 📝 **Centralized content** — All posts in JavaScript objects (data.js)
- 🎨 **Modern design** — Blueprint color scheme, Source Serif 4 typography
- 🌙 **Dark mode** — Theme toggle with localStorage persistence
- 🔍 **Full-text search** — Client-side search via Cmd+K
- 📱 **Responsive** — Mobile-first CSS Grid layout
- 📊 **Progress tracking** — Read/unread posts tracked in localStorage
- 📈 **13 posts** — ~20,450 words across AI engineering series

## Project Structure

```
.
├── site/                    # Custom static site generator
│   ├── build.js            # Main build script
│   ├── data.js             # Centralized content (13 posts)
│   ├── style.css           # Modern CSS (Blueprint design)
│   ├── app.js              # Client-side app initialization
│   ├── progress.js         # Progress tracking
│   ├── cmdpalette.js       # Search functionality
│   ├── package.json        # NPM dependencies
│   └── *.html              # Generated HTML (built output)
├── .github/workflows/       # GitHub Actions CI/CD
│   └── deploy.yml          # Automated deployment to GitHub Pages
├── CNAME                   # Domain configuration
└── README.md               # This file
```

## Installation

### Requirements

- **Node.js** 24+ (or later)
- **npm** 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/DineshKuppan/dinesh.github.io.git
cd dinesh.github.io

# Install dependencies
cd site
npm ci
```

## Building

### Production Build

```bash
cd site
npm run build
```

**Output:** Generates 19+ HTML files in the `site/` directory
- `index.html` — Home page
- `catalog.html` — Blog catalog
- `about.html` — About page with portfolio
- `post/YYYY/MM/slug/index.html` — Individual blog posts
- `sitemap.xml` — SEO sitemap
- `robots.txt` — Search engine directives
- `style.css` — Modern CSS
- `*.js` — Client-side scripts

**Build time:** ~29ms

### Development Build

```bash
cd site
npm run watch
```

Watches for changes to `data.js` and `build.js` and rebuilds automatically.

## Running Locally

### Option 1: Development Server (Recommended)

```bash
cd site
npm run dev
```

- Runs the build
- Starts a local HTTP server on `http://localhost:8080`
- Automatically opens your browser
- Watches for changes

### Option 2: Manual Server

```bash
# Build first
cd site
npm run build

# Then serve
npm run serve
```

- Runs the dev server on `http://localhost:8080`
- Serves the built HTML/CSS/JS

### Option 3: System HTTP Server

```bash
cd site
python3 -m http.server 8080
```

- Navigate to `http://localhost:8080`
- View the built site

## Adding Content

### Creating a New Post

Edit `site/data.js` and add a new post object to the `posts` array:

```javascript
{
  id: "unique-id",
  title: "Post Title",
  slug: "post-slug",
  date: "2026-07-22",
  category: "AI",
  tags: ["tag1", "tag2"],
  series: "Series Name",
  description: "One-sentence summary",
  readTime: 8,
  wordCount: 1600,
  body: `<h2>Section Title</h2><p>Content here...</p>`,
  next: "next-post-id",
  prev: "prev-post-id"
}
```

Then rebuild:

```bash
npm run build
```

The post will automatically appear on the home page, catalog, and search index.

## Customization

### Colors & Typography

Edit `site/style.css`:

```css
:root {
  --blueprint: #3553ff;           /* Primary color */
  --bg-primary: #fafaf5;          /* Light background */
  --fg-primary: #0a0a0a;          /* Text color */
  --font-display: 'Source Serif 4', serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Metadata

Update in `site/build.js` (baseTemplate):

```javascript
<meta name="og:title" content="Your Site Title">
```

### Domain

Update `CNAME`:

```
yourdomain.com
```

## Deployment

### GitHub Pages (Automated)

1. Push to `main` branch
2. GitHub Actions automatically:
   - Builds the site (`npm run build`)
   - Deploys to `gh-pages` branch
   - GitHub Pages serves the live site

**Deployment time:** ~2-3 minutes

**Live URL:** Configured via `CNAME` file

### Manual Deployment

```bash
# Build
cd site
npm run build

# Copy to public/
mkdir -p public
cp -r site/index.html site/catalog.html site/404.html site/about.html public/
cp site/style.css site/*.js public/
cp -r site/post public/

# Deploy to GitHub Pages (requires gh CLI)
git add public/
git commit -m "deploy: updated site"
git push origin main
```

## Performance

| Metric | Value |
|--------|-------|
| Build Time | 29ms |
| Pages Generated | 19+ |
| CSS Size | 12KB |
| Total Post Words | 20,450 |
| TTFb | <200ms |

## Navigation

- **Home** (`/`) — Featured posts & series overview
- **Blog** (`/catalog/`) — All posts with filtering
- **About** (`/about/`) — Portfolio, timeline, contact
- **Search** (Cmd+K) — Full-text search across posts

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open search |
| `Esc` | Close search |
| ☀️ button | Toggle dark mode |

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This blog is personal content. The build system (Node.js, CSS, JavaScript) is open source under MIT. Blog content is © Dinesh Kuppan.

## Contributing

Have feedback? Found a bug? Open an issue at [GitHub Issues](https://github.com/DineshKuppan/dinesh.github.io/issues).

## Contact

- 🐙 GitHub: [@DineshKuppan](https://github.com/DineshKuppan)
- 💼 Website: [dineshkuppan.dev](https://dineshkuppan.dev)
- ✉️ Email: [email2dineshkuppan@gmail.com](mailto:email2dineshkuppan@gmail.com)

---

Built with ❤️ using Node.js, Markdown, and CSS. Hosted on GitHub Pages.

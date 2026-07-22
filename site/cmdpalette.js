// site/cmdpalette.js - Command palette and search

export class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.posts = [];
    this.init();
  }

  async init() {
    try {
      const response = await fetch('/catalog.html');
      const html = await response.text();
      this.extractPosts(html);
      this.createUI();
      this.setupListeners();
    } catch (e) {
      console.error('Failed to initialize command palette:', e);
    }
  }

  extractPosts(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const cards = doc.querySelectorAll('.post-card');

    this.posts = Array.from(cards).map(card => {
      const link = card.querySelector('.post-link');
      const title = card.querySelector('h3')?.textContent || '';
      const meta = card.querySelector('.post-meta');
      const excerpt = card.querySelector('.post-excerpt')?.textContent || '';
      const href = link?.getAttribute('href') || '';

      return { title, href, excerpt, meta: meta?.textContent || '' };
    });
  }

  createUI() {
    const html = `
      <div class="cmd-palette-overlay">
        <div class="cmd-palette">
          <input type="text" placeholder="Search posts... (Cmd+K)" class="cmd-input" autocomplete="off">
          <div class="cmd-results"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this.overlay = document.querySelector('.cmd-palette-overlay');
    this.input = this.overlay.querySelector('.cmd-input');
    this.results = this.overlay.querySelector('.cmd-results');
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.input.addEventListener('input', (e) => this.search(e.target.value));

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  open() {
    this.isOpen = true;
    this.overlay.style.display = 'flex';
    this.input.focus();
    this.renderAll();
  }

  close() {
    this.isOpen = false;
    this.overlay.style.display = 'none';
    this.input.value = '';
  }

  search(query) {
    if (!query) {
      this.renderAll();
      return;
    }

    const q = query.toLowerCase();
    const results = this.posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.meta.toLowerCase().includes(q)
    );

    this.renderResults(results);
  }

  renderAll() {
    this.renderResults(this.posts);
  }

  renderResults(results) {
    if (!results.length) {
      this.results.innerHTML = '<p class="no-results">No posts found</p>';
      return;
    }

    this.results.innerHTML = results
      .map(
        post => `
        <a href="${post.href}" class="cmd-result">
          <div class="cmd-result-title">${post.title}</div>
          <div class="cmd-result-meta">${post.meta}</div>
        </a>
      `
      )
      .join('');

    this.results.querySelectorAll('.cmd-result').forEach(el => {
      el.addEventListener('click', () => this.close());
    });
  }
}

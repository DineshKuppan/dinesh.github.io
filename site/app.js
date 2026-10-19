// site/app.js - Main app logic
import { ProgressTracker } from './progress.js';
import { CommandPalette } from './cmdpalette.js';

const THEMES = ['light', 'dark', 'system'];

class BlogApp {
  constructor() {
    this.progress = new ProgressTracker();
    this.palette = new CommandPalette();
    this.init();
  }

  init() {
    this.setupThemeSwitch();
    this.setupSearchButton();
    this.setupTagFilter();
    this.setupProgressTracking();
  }

  setupThemeSwitch() {
    const buttons = document.querySelectorAll('[data-theme-choice]');
    if (!buttons.length) return;

    let saved = 'system';
    try {
      saved = localStorage.getItem('theme') || 'system';
    } catch {}
    this.setTheme(THEMES.includes(saved) ? saved : 'system');

    buttons.forEach(button => {
      button.addEventListener('click', () => this.setTheme(button.dataset.themeChoice));
    });
  }

  setTheme(theme) {
    // "system" removes the override so prefers-color-scheme decides
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    try {
      localStorage.setItem('theme', theme);
    } catch {}

    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
  }

  setupSearchButton() {
    const button = document.querySelector('.search-btn');
    if (!button) return;

    button.addEventListener('click', () => {
      if (this.palette.overlay) this.palette.open();
    });
  }

  setupTagFilter() {
    const filter = document.querySelector('.tag-filter');
    if (!filter) return;

    const tag = (new URLSearchParams(window.location.search).get('tag') || '').toLowerCase();

    filter.querySelectorAll('.tag').forEach(link => {
      const active = link.dataset.tag === tag;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
    });

    if (!tag) return;

    let shown = 0;
    document.querySelectorAll('.catalog .year-group').forEach(group => {
      let groupShown = 0;
      group.querySelectorAll('.post-card').forEach(card => {
        const match = (card.dataset.tags || '').split('|').includes(tag);
        card.hidden = !match;
        if (match) groupShown++;
      });
      group.hidden = groupShown === 0;
      shown += groupShown;
    });

    const status = document.querySelector('.filter-status');
    if (status) {
      status.textContent = `${shown} ${shown === 1 ? 'essay' : 'essays'} tagged “${tag}”`;
      status.hidden = false;
    }
  }

  setupProgressTracking() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const slug = window.location.pathname.split('/').filter(Boolean).pop();
    window.addEventListener('scroll', () => {
      if (slug && window.scrollY + window.innerHeight > postContent.offsetTop + postContent.offsetHeight * 0.8) {
        this.progress.markAsRead(slug);
      }
    }, { passive: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BlogApp());
} else {
  new BlogApp();
}

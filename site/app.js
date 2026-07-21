// site/app.js - Main app logic
import { ProgressTracker } from './progress.js';
import { CommandPalette } from './cmdpalette.js';

class BlogApp {
  constructor() {
    this.progress = new ProgressTracker();
    this.palette = new CommandPalette();
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupProgressTracking();
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      this.setTheme(next);
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  setupProgressTracking() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    window.addEventListener('scroll', () => {
      const postLink = document.querySelector('.post-link');
      if (postLink && window.scrollY > postContent.offsetTop + postContent.offsetHeight * 0.8) {
        const slug = postLink.getAttribute('href').split('/').filter(Boolean).pop();
        this.progress.markAsRead(slug);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BlogApp());
} else {
  new BlogApp();
}

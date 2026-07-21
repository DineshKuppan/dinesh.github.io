// site/progress.js - Progress tracking with localStorage

export class ProgressTracker {
  constructor() {
    this.loadProgress();
  }

  loadProgress() {
    try {
      this.data = JSON.parse(localStorage.getItem('blog-progress') || '{}');
    } catch {
      this.data = {};
    }
  }

  saveProgress() {
    localStorage.setItem('blog-progress', JSON.stringify(this.data));
  }

  markAsRead(postId) {
    if (!this.data[postId]) {
      this.data[postId] = { status: 'completed', timestamp: Date.now() };
      this.saveProgress();
    }
  }

  markAsReading(postId) {
    this.data[postId] = { status: 'in-progress', timestamp: Date.now() };
    this.saveProgress();
  }

  isRead(postId) {
    return this.data[postId]?.status === 'completed';
  }

  getStats() {
    const completed = Object.values(this.data).filter(p => p.status === 'completed').length;
    return {
      completed,
      total: Object.keys(this.data).length,
      percentage: Object.keys(this.data).length > 0 ? Math.round((completed / Object.keys(this.data).length) * 100) : 0,
    };
  }
}

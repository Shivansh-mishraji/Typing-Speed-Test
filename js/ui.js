// ============================================================
// SOUND ENGINE — Web Audio API based sound effects
// ============================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this._init();
  }

  _init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  _resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _beep(freq, duration, type = 'sine', vol = 0.08) {
    if (!this.enabled || !this.ctx) return;
    this._resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  keyClick() { this._beep(800, 0.04, 'square', 0.04); }
  errorBeep() { this._beep(200, 0.12, 'sawtooth', 0.06); }
  wordComplete() { this._beep(1200, 0.06, 'sine', 0.05); }
  testComplete() {
    // Fanfare
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this._beep(f, 0.15, 'sine', 0.08), i * 120);
    });
  }
  newBest() {
    [784, 988, 1175, 1568].forEach((f, i) => {
      setTimeout(() => this._beep(f, 0.2, 'sine', 0.1), i * 100);
    });
  }
}

// ============================================================
// UI MANAGER — DOM rendering and animations
// ============================================================

class UIManager {
  constructor() {
    this.sound = new SoundEngine();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Render word display
  renderWords(words, typedHistory, currentWordIndex, currentInput) {
    const container = document.getElementById('word-display');
    if (!container) return;

    let html = '';
    words.forEach((word, wi) => {
      const typed = wi < currentWordIndex ? typedHistory[wi] : (wi === currentWordIndex ? currentInput : '');
      let wordHtml = '';
      const isActive = wi === currentWordIndex;
      const isPast = wi < currentWordIndex;
      const correct = typed === word && isPast;
      const incorrect = typed !== word && isPast;

      // Characters
      for (let ci = 0; ci < Math.max(word.length, typed.length); ci++) {
        const expected = word[ci] || '';
        const actual = typed[ci] || '';
        let cls = '';

        if (wi < currentWordIndex) {
          // Past word
          if (!actual && expected) cls = 'missed';
          else if (actual && !expected) cls = 'extra';
          else if (actual === expected) cls = 'correct';
          else cls = 'incorrect';
        } else if (isActive) {
          if (ci < typed.length) {
            cls = (actual === expected && expected) ? 'correct' : 'incorrect';
            if (!expected) cls = 'extra';
          } else if (ci === typed.length) {
            cls = 'caret';
          }
        }

        const char = (wi < currentWordIndex || isActive) ? (expected || actual) : expected;
        if (isActive && ci === typed.length) {
          wordHtml += `<span class="char caret-char">${char || '&nbsp;'}</span>`;
        } else {
          wordHtml += `<span class="char ${cls}">${expected || actual}</span>`;
        }
      }

      // Caret at end if typing past word length (only if we haven't rendered the caret in the loop above)
      if (isActive && typed.length >= word.length && Math.max(word.length, typed.length) === typed.length) {
        wordHtml += `<span class="char caret-char extra">&nbsp;</span>`;
      }

      const wordCls = `word ${isActive ? 'active' : ''} ${isPast ? (correct ? 'word-correct' : 'word-incorrect') : ''}`;
      html += `<div class="${wordCls}" data-index="${wi}">${wordHtml}</div>`;
    });

    container.innerHTML = html;

    // Scroll active word into view
    const activeWord = container.querySelector('.word.active');
    if (activeWord) {
      const containerTop = container.scrollTop;
      const wordTop = activeWord.offsetTop;
      const wordBottom = wordTop + activeWord.offsetHeight;
      const containerBottom = containerTop + container.clientHeight;
      if (wordTop < containerTop + 40 || wordBottom > containerBottom - 40) {
        container.scrollTo({ top: wordTop - container.clientHeight / 3, behavior: 'smooth' });
      }
    }
  }

  // Render a quote
  renderQuote(quoteObj, typedHistory, currentWordIndex, currentInput) {
    const words = quoteObj.text.split(' ');
    this.renderWords(words, typedHistory, currentWordIndex, currentInput);
    const authorEl = document.getElementById('quote-author');
    if (authorEl) authorEl.textContent = '— ' + quoteObj.author;
  }

  updateTimer(remaining, total) {
    const el = document.getElementById('timer-display');
    if (!el) return;
    el.textContent = remaining;
    el.style.color = remaining <= 10 ? '#f87171' : '';
    const progress = document.getElementById('progress-bar');
    if (progress) {
      progress.style.width = ((total - remaining) / total * 100) + '%';
    }
  }

  updateWordTimer(elapsed) {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = elapsed + 's';
  }

  updateLiveStats(wpm, accuracy) {
    const wpmEl = document.getElementById('live-wpm');
    const accEl = document.getElementById('live-accuracy');
    if (wpmEl) wpmEl.textContent = wpm;
    if (accEl) accEl.textContent = accuracy + '%';
  }

  showResults(result, isNewBest) {
    const overlay = document.getElementById('result-overlay');
    if (!overlay) return;
    overlay.classList.add('visible');

    document.getElementById('res-wpm').textContent = result.wpm;
    document.getElementById('res-raw').textContent = result.rawWpm;
    document.getElementById('res-accuracy').textContent = result.accuracy + '%';
    document.getElementById('res-consistency').textContent = result.consistency + '%';
    document.getElementById('res-correct').textContent = result.charStats.correct;
    document.getElementById('res-incorrect').textContent = result.charStats.incorrect;
    document.getElementById('res-time').textContent = result.timeElapsed + 's';
    document.getElementById('res-words').textContent = result.wordsTyped;

    const gradeEl = document.getElementById('res-grade');
    gradeEl.textContent = result.grade;
    gradeEl.className = `grade grade-${result.grade.toLowerCase()}`;

    const newBestEl = document.getElementById('new-best-badge');
    if (newBestEl) newBestEl.style.display = isNewBest ? 'inline-flex' : 'none';

    // Animate numbers
    this._animateNumber('res-wpm', result.wpm, 800);
    this._animateNumber('res-raw', result.rawWpm, 800);

    // Draw chart
    setTimeout(() => {
      const canvas = document.getElementById('wpm-chart');
      if (canvas && result.wpmHistory.length > 1) {
        const chart = new ResultsChart(canvas);
        chart.draw(result.wpmHistory);
      }
    }, 300);
  }

  hideResults() {
    const overlay = document.getElementById('result-overlay');
    if (overlay) overlay.classList.remove('visible');
  }

  _animateNumber(id, target, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const startTime = performance.now();
    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * ease);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  showLeaderboard(mode) {
    const entries = Storage.getLeaderboard(mode);
    const container = document.getElementById('leaderboard-list');
    if (!container) return;
    if (entries.length === 0) {
      container.innerHTML = '<div class="lb-empty">No entries yet. Complete a test to appear here!</div>';
      return;
    }
    container.innerHTML = entries.map((e, i) => `
      <div class="lb-entry ${i === 0 ? 'lb-first' : i === 1 ? 'lb-second' : i === 2 ? 'lb-third' : ''}">
        <span class="lb-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1)}</span>
        <span class="lb-name">${e.name}</span>
        <span class="lb-wpm">${e.wpm} WPM</span>
        <span class="lb-acc">${e.accuracy}%</span>
        <span class="lb-date">${this._formatDate(e.timestamp)}</span>
      </div>
    `).join('');
  }

  showHistory() {
    const results = Storage.getResults();
    const container = document.getElementById('history-list');
    if (!container) return;
    if (results.length === 0) {
      container.innerHTML = '<div class="lb-empty">No history yet.</div>';
      return;
    }
    container.innerHTML = results.slice(0, 20).map(r => `
      <div class="history-entry">
        <span class="hist-wpm">${r.wpm}</span>
        <span class="hist-label">WPM</span>
        <span class="hist-acc">${r.accuracy}%</span>
        <span class="hist-mode">${r.mode}</span>
        <span class="hist-date">${this._formatDate(r.timestamp)}</span>
      </div>
    `).join('');
  }

  _formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  setActiveOption(group, value) {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === String(value));
    });
  }
}

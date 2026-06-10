// ============================================================
// APP CONTROLLER — Main application logic
// ============================================================

class App {
  constructor() {
    this.engine = new TypingEngine();
    this.ui = new UIManager();
    this.settings = Storage.getSettings();
    this.currentQuote = null;
    this.currentWords = [];
    this.inputEl = document.getElementById('typing-input');
    this.isTestActive = false;

    this._init();
  }

  _init() {
    this.ui.applyTheme(this.settings.theme);
    this._bindEvents();
    this._loadSettings();
    this._updatePersonalBests();
    this.newTest();
  }

  _loadSettings() {
    // Apply saved settings to UI toggles
    this.ui.setActiveOption('mode', this.settings.testMode);
    this.ui.setActiveOption('time', this.settings.timeMode);
    this.ui.setActiveOption('words', this.settings.wordMode);
    this.ui.setActiveOption('difficulty', this.settings.difficulty);
    this.ui.setActiveOption('theme', this.settings.theme);

    document.getElementById('toggle-numbers').classList.toggle('active', this.settings.includeNumbers);
    document.getElementById('toggle-punct').classList.toggle('active', this.settings.includePunctuation);
    document.getElementById('toggle-sound').classList.toggle('active', this.settings.sound);
    this.ui.sound.enabled = this.settings.sound;

    const nameInput = document.getElementById('player-name');
    if (nameInput) nameInput.value = this.settings.playerName;

    this._showModeOptions();
  }

  _showModeOptions() {
    const mode = this.settings.testMode;
    document.getElementById('time-options').style.display = mode === 'time' ? 'flex' : 'none';
    document.getElementById('word-options').style.display = mode === 'words' ? 'flex' : 'none';
    document.getElementById('quote-options').style.display = mode === 'quote' ? 'flex' : 'none';
    document.getElementById('custom-options').style.display = mode === 'custom' ? 'flex' : 'none';
    document.getElementById('difficulty-options').style.display = (mode === 'time' || mode === 'words') ? 'flex' : 'none';
    // Show/hide custom text area
    const customArea = document.getElementById('custom-options-area');
    if (customArea) customArea.style.display = mode === 'custom' ? 'block' : 'none';
    // Show/hide quote author
    const quoteAuthor = document.getElementById('quote-author');
    if (quoteAuthor) quoteAuthor.style.display = mode === 'quote' ? 'block' : 'none';
  }

  _bindEvents() {
    // Typing input
    this.inputEl.addEventListener('input', (e) => this._handleInput(e));
    this.inputEl.addEventListener('keydown', (e) => this._handleKeydown(e));

    // Click on word display focuses input
    document.getElementById('word-display').addEventListener('click', () => {
      this.inputEl.focus();
    });

    // Mode buttons
    document.querySelectorAll('[data-group="mode"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.testMode = btn.dataset.value;
        Storage.updateSetting('testMode', this.settings.testMode);
        this.ui.setActiveOption('mode', this.settings.testMode);
        this._showModeOptions();
        this.newTest();
      });
    });

    // Time buttons
    document.querySelectorAll('[data-group="time"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.timeMode = parseInt(btn.dataset.value);
        Storage.updateSetting('timeMode', this.settings.timeMode);
        this.ui.setActiveOption('time', this.settings.timeMode);
        this.newTest();
      });
    });

    // Word count buttons
    document.querySelectorAll('[data-group="words"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.wordMode = parseInt(btn.dataset.value);
        Storage.updateSetting('wordMode', this.settings.wordMode);
        this.ui.setActiveOption('words', this.settings.wordMode);
        this.newTest();
      });
    });

    // Difficulty buttons
    document.querySelectorAll('[data-group="difficulty"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.difficulty = btn.dataset.value;
        Storage.updateSetting('difficulty', this.settings.difficulty);
        this.ui.setActiveOption('difficulty', this.settings.difficulty);
        this.newTest();
      });
    });

    // Theme buttons
    document.querySelectorAll('[data-group="theme"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.theme = btn.dataset.value;
        Storage.updateSetting('theme', this.settings.theme);
        this.ui.setActiveOption('theme', this.settings.theme);
        this.ui.applyTheme(this.settings.theme);
      });
    });

    // Toggles
    document.getElementById('toggle-numbers').addEventListener('click', (e) => {
      this.settings.includeNumbers = !this.settings.includeNumbers;
      e.currentTarget.classList.toggle('active', this.settings.includeNumbers);
      Storage.updateSetting('includeNumbers', this.settings.includeNumbers);
      this.newTest();
    });

    document.getElementById('toggle-punct').addEventListener('click', (e) => {
      this.settings.includePunctuation = !this.settings.includePunctuation;
      e.currentTarget.classList.toggle('active', this.settings.includePunctuation);
      Storage.updateSetting('includePunctuation', this.settings.includePunctuation);
      this.newTest();
    });

    document.getElementById('toggle-sound').addEventListener('click', (e) => {
      this.settings.sound = !this.settings.sound;
      e.currentTarget.classList.toggle('active', this.settings.sound);
      Storage.updateSetting('sound', this.settings.sound);
      this.ui.sound.enabled = this.settings.sound;
    });

    // Restart button
    document.getElementById('btn-restart').addEventListener('click', () => this.newTest());
    document.getElementById('btn-restart-result').addEventListener('click', () => {
      this.ui.hideResults();
      this.newTest();
    });
    document.getElementById('btn-new-test').addEventListener('click', () => {
      this.ui.hideResults();
      this.newTest();
    });

    // Tab to restart
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.newTest();
      }
      if (e.key === 'Escape') {
        this.ui.hideResults();
        document.getElementById('leaderboard-panel').classList.remove('open');
        document.getElementById('history-panel').classList.remove('open');
        document.getElementById('settings-panel').classList.remove('open');
      }
    });

    // Leaderboard
    document.getElementById('btn-leaderboard').addEventListener('click', () => {
      const panel = document.getElementById('leaderboard-panel');
      const isOpen = panel.classList.toggle('open');
      if (isOpen) {
        this.ui.showLeaderboard(this._getModeKey());
      }
    });

    // History
    document.getElementById('btn-history').addEventListener('click', () => {
      const panel = document.getElementById('history-panel');
      const isOpen = panel.classList.toggle('open');
      if (isOpen) this.ui.showHistory();
    });

    // Settings panel
    document.getElementById('btn-settings').addEventListener('click', () => {
      document.getElementById('settings-panel').classList.toggle('open');
    });

    // Clear leaderboard
    document.getElementById('btn-clear-lb').addEventListener('click', () => {
      if (confirm('Clear all leaderboard data?')) {
        Storage.clearLeaderboard();
        this.ui.showLeaderboard(this._getModeKey());
      }
    });

    // Clear history
    document.getElementById('btn-clear-history').addEventListener('click', () => {
      if (confirm('Clear all history?')) {
        Storage.clearResults();
        this.ui.showHistory();
      }
    });

    // Submit leaderboard entry
    document.getElementById('btn-submit-score').addEventListener('click', () => {
      this._submitToLeaderboard();
    });

    // Player name
    document.getElementById('player-name').addEventListener('change', (e) => {
      this.settings.playerName = e.target.value || 'Anonymous';
      Storage.updateSetting('playerName', this.settings.playerName);
    });

    // Custom text
    document.getElementById('btn-start-custom').addEventListener('click', () => {
      this.newTest();
    });

    // Quote new
    document.getElementById('btn-new-quote').addEventListener('click', () => {
      this.newTest();
    });

    // Share result
    document.getElementById('btn-share').addEventListener('click', () => {
      this._shareResult();
    });

    // Panel close buttons
    document.querySelectorAll('.panel-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.side-panel').classList.remove('open');
      });
    });
  }

  newTest() {
    this.engine.forceFinish();
    this.engine = new TypingEngine();
    this.ui.hideResults();
    this.isTestActive = false;
    this.inputEl.value = '';
    this.inputEl.disabled = false;
    this.lastResult = null;

    const mode = this.settings.testMode;

    if (mode === 'time') {
      const count = Math.max(this.settings.timeMode * 3, 200);
      this.currentWords = generateWordList(
        this.settings.difficulty, count,
        this.settings.includeNumbers,
        this.settings.includePunctuation
      );
      this.engine.loadWords(this.currentWords);
      this._showTimer(this.settings.timeMode);
      this._updateTimerDisplay(this.settings.timeMode);

    } else if (mode === 'words') {
      this.currentWords = generateWordList(
        this.settings.difficulty, this.settings.wordMode,
        this.settings.includeNumbers,
        this.settings.includePunctuation
      );
      this.engine.loadWords(this.currentWords);
      this._showWordProgress();
      this._updateTimerDisplay('–');

    } else if (mode === 'quote') {
      this.currentQuote = getRandomQuote();
      this.currentWords = this.currentQuote.text.split(' ');
      this.engine.loadWords(this.currentWords);
      this._showWordProgress();
      this._updateTimerDisplay('–');

    } else if (mode === 'custom') {
      const customText = document.getElementById('custom-text').value.trim();
      if (!customText) {
        this.currentWords = ['Type', 'your', 'custom', 'text', 'above', 'and', 'click', 'Start'];
      } else {
        this.currentWords = customText.split(/\s+/).filter(Boolean);
      }
      this.engine.loadWords(this.currentWords);
      this._showWordProgress();
      this._updateTimerDisplay('–');
    }

    // Set engine callbacks
    this.engine.onTick = ({ remaining, wpm, accuracy }) => {
      this.ui.updateTimer(remaining, this.settings.timeMode);
      this.ui.updateLiveStats(wpm, accuracy);
    };
    this.engine.onComplete = (result) => this._onComplete(result);

    // Render
    this._renderCurrentState();
    this._updateWordProgress();
    document.getElementById('start-hint').style.display = 'block';
    // Reset live stats
    this.ui.updateLiveStats(0, 100);
    // Focus input
    this.inputEl.focus();

    // Update PBs display
    this._updatePersonalBests();
  }

  _renderCurrentState() {
    const mode = this.settings.testMode;
    // renderWords handles all modes; renderQuote also updates the author element
    if (mode === 'quote' && this.currentQuote) {
      this.ui.renderQuote(this.currentQuote, this.engine.typedHistory, this.engine.currentWordIndex, '');
    } else {
      this.ui.renderWords(this.currentWords, this.engine.typedHistory, this.engine.currentWordIndex, '');
    }
  }

  _handleInput(e) {
    if (this.engine.isFinished) return;
    const val = this.inputEl.value;
    const lastChar = val[val.length - 1];

    // Start engine on first keypress
    if (!this.engine.isRunning && val.length > 0) {
      this._startTest();
    }

    if (lastChar === ' ') {
      // Submit word
      this.engine.type(' ', val.trimEnd());
      this.inputEl.value = '';
      this.ui.sound.wordComplete();
      this._updateWordProgress();
    } else {
      this.engine.type(lastChar, val);
      this.ui.sound.keyClick();
    }

    // Re-render
    const currentInput = this.inputEl.value;
    this.ui.renderWords(
      this.currentWords,
      this.engine.typedHistory,
      this.engine.currentWordIndex,
      currentInput
    );

    // Live stats update
    this.ui.updateLiveStats(this.engine.getLiveWPM(), this.engine.getAccuracy());

    // For word/quote modes, update elapsed time
    if (this.settings.testMode !== 'time') {
      this.ui.updateWordTimer(this.engine.getTimeElapsed());
    }
  }

  _handleKeydown(e) {
    if (e.key === 'Backspace') {
      const val = this.inputEl.value;
      this.engine.backspace(val);
    }
  }

  _startTest() {
    document.getElementById('start-hint').style.display = 'none';
    this.isTestActive = true;
    const mode = this.settings.testMode;
    this.engine.start(
      mode === 'time' ? this.settings.timeMode : 9999,
      mode
    );

    // For word/quote/custom modes, update timer display manually
    if (mode !== 'time') {
      this._startElapsedTimer();
    }
  }

  _startElapsedTimer() {
    const interval = setInterval(() => {
      if (!this.engine.isRunning) {
        clearInterval(interval);
        return;
      }
      this.ui.updateWordTimer(this.engine.getTimeElapsed());
      this.ui.updateLiveStats(this.engine.getLiveWPM(), this.engine.getAccuracy());
    }, 500);
  }

  _onComplete(result) {
    this.lastResult = result;
    this.inputEl.disabled = true;

    // Save result
    const modeKey = this._getModeKey();
    Storage.addResult({ ...result, mode: modeKey });

    // Personal best
    const isNewBest = Storage.updatePersonalBest(modeKey, result.wpm, result.accuracy);

    // Sounds
    if (isNewBest) this.ui.sound.newBest();
    else this.ui.sound.testComplete();

    // Show results
    setTimeout(() => {
      this.ui.showResults(result, isNewBest);
      this._updatePersonalBests();
    }, 400);
  }

  _getModeKey() {
    const { testMode, timeMode, wordMode, difficulty } = this.settings;
    if (testMode === 'time') return `time-${timeMode}-${difficulty}`;
    if (testMode === 'words') return `words-${wordMode}-${difficulty}`;
    if (testMode === 'quote') return 'quote';
    return 'custom';
  }

  _updatePersonalBests() {
    const pbs = Storage.getAllPersonalBests();
    const container = document.getElementById('pb-list');
    if (!container) return;
    const entries = Object.entries(pbs).sort((a, b) => b[1].wpm - a[1].wpm).slice(0, 5);
    if (entries.length === 0) {
      container.innerHTML = '<span class="pb-empty">No records yet</span>';
      return;
    }
    container.innerHTML = entries.map(([key, val]) =>
      `<div class="pb-entry">
        <span class="pb-mode">${key}</span>
        <span class="pb-wpm">${val.wpm} WPM</span>
        <span class="pb-acc">${val.accuracy}%</span>
      </div>`
    ).join('');
  }

  _showTimer(seconds) {
    this._updateTimerDisplay(seconds);
    document.getElementById('progress-bar-wrap').style.display = 'block';
    document.getElementById('timer-display').style.color = '';
  }

  _showWordProgress() {
    document.getElementById('progress-bar-wrap').style.display = 'none';
  }

  _updateTimerDisplay(val) {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = val;
  }

  _updateWordProgress() {
    const el = document.getElementById('word-progress');
    if (!el) return;
    const total = this.currentWords.length;
    const done = this.engine.currentWordIndex;
    if (this.settings.testMode === 'words' || this.settings.testMode === 'quote' || this.settings.testMode === 'custom') {
      el.textContent = `${done} / ${total}`;
    } else {
      el.textContent = '';
    }
  }

  _submitToLeaderboard() {
    if (!this.lastResult) return;
    const name = document.getElementById('player-name').value.trim() || 'Anonymous';
    Storage.addLeaderboardEntry(this._getModeKey(), name, this.lastResult.wpm, this.lastResult.accuracy);
    this.ui.showLeaderboard(this._getModeKey());
    document.getElementById('leaderboard-panel').classList.add('open');
    document.getElementById('result-overlay').classList.remove('visible');
  }

  _shareResult() {
    if (!this.lastResult) return;
    const r = this.lastResult;
    const text = `⌨️ Typing Speed Test Result\n🚀 ${r.wpm} WPM | 🎯 ${r.accuracy}% Accuracy | Grade: ${r.grade}\n\nBeaten with TypeMaster Pro!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-share');
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = orig, 2000);
      });
    }
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

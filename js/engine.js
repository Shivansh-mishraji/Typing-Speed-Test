// ============================================================
// TYPING ENGINE — WPM, accuracy, timer, character tracking
// ============================================================

class TypingEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.words = [];
    this.currentWordIndex = 0;
    this.currentCharIndex = 0;
    this.typedHistory = []; // per-word typed strings
    this.startTime = null;
    this.endTime = null;
    this.timer = null;
    this.timeLimit = 60;
    this.timeElapsed = 0;
    this.isRunning = false;
    this.isFinished = false;
    this.wpmHistory = []; // [{time, wpm}] for chart
    this.charStats = { correct: 0, incorrect: 0, extra: 0, missed: 0 };
    this.keyStats = {}; // key => { correct, incorrect }
    this.rawInput = ''; // cumulative raw typed chars
    this.onTick = null;
    this.onComplete = null;
    this.mode = 'time'; // 'time' | 'words' | 'quote' | 'custom'
    this.wordCount = 25;
  }

  loadWords(words) {
    this.words = words;
    this.typedHistory = new Array(words.length).fill('');
  }

  start(timeLimit, mode) {
    if (this.isRunning) return;
    this.timeLimit = timeLimit;
    this.mode = mode;
    this.startTime = performance.now();
    this.isRunning = true;

    if (mode === 'time') {
      this._startCountdown();
    }
  }

  _startCountdown() {
    this.timer = setInterval(() => {
      this.timeElapsed = Math.floor((performance.now() - this.startTime) / 1000);
      const remaining = this.timeLimit - this.timeElapsed;

      // Record WPM snapshot every second
      const wpm = this.getLiveWPM();
      this.wpmHistory.push({ time: this.timeElapsed, wpm });

      if (this.onTick) this.onTick({ remaining, wpm, accuracy: this.getAccuracy() });

      if (remaining <= 0) {
        this.finish();
      }
    }, 1000);
  }

  type(char, currentInput) {
    if (!this.isRunning || this.isFinished) return;

    const word = this.words[this.currentWordIndex];
    if (!word) return;

    this.typedHistory[this.currentWordIndex] = currentInput;
    this.rawInput += char;

    // Track key stats
    if (char !== ' ') {
      const expectedChar = word[currentInput.length - 1];
      const isCorrect = char === expectedChar;
      if (!this.keyStats[char]) this.keyStats[char] = { correct: 0, incorrect: 0 };
      if (isCorrect) this.keyStats[char].correct++;
      else this.keyStats[char].incorrect++;
    }

    // Space pressed = submit word
    if (char === ' ') {
      this._submitWord(currentInput.trimEnd());
    }
  }

  _submitWord(typed) {
    const word = this.words[this.currentWordIndex];
    // Count char stats for this word
    for (let i = 0; i < Math.max(word.length, typed.length); i++) {
      if (i >= word.length) this.charStats.extra++;
      else if (i >= typed.length) this.charStats.missed++;
      else if (word[i] === typed[i]) this.charStats.correct++;
      else this.charStats.incorrect++;
    }

    this.currentWordIndex++;
    this.currentCharIndex = 0;

    // Word mode completion
    if (this.mode === 'words' || this.mode === 'quote' || this.mode === 'custom') {
      if (this.currentWordIndex >= this.words.length) {
        this.finish();
      }
    }
  }

  backspace(currentInput) {
    if (!this.isRunning || this.isFinished) return;
    this.typedHistory[this.currentWordIndex] = currentInput;
  }

  getLiveWPM() {
    if (!this.startTime) return 0;
    const elapsed = (performance.now() - this.startTime) / 1000 / 60; // minutes
    if (elapsed === 0) return 0;
    const correctChars = this.charStats.correct + (this.typedHistory[this.currentWordIndex] || '').length;
    return Math.round(correctChars / 5 / elapsed);
  }

  getRawWPM() {
    if (!this.startTime) return 0;
    const elapsed = (performance.now() - this.startTime) / 1000 / 60;
    if (elapsed === 0) return 0;
    return Math.round(this.rawInput.length / 5 / elapsed);
  }

  getAccuracy() {
    const total = this.charStats.correct + this.charStats.incorrect;
    if (total === 0) return 100;
    return Math.round((this.charStats.correct / total) * 100);
  }

  getConsistency() {
    if (this.wpmHistory.length < 2) return 100;
    const wpms = this.wpmHistory.map(w => w.wpm);
    const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, Math.round(100 - (stdDev / (avg || 1)) * 100));
    return consistency;
  }

  getGrade(wpm, accuracy) {
    const score = wpm * (accuracy / 100);
    if (score >= 100) return 'S';
    if (score >= 70) return 'A';
    if (score >= 50) return 'B';
    if (score >= 30) return 'C';
    return 'D';
  }

  getTimeElapsed() {
    if (!this.startTime) return 0;
    return Math.floor((performance.now() - this.startTime) / 1000);
  }

  getTimeRemaining() {
    return Math.max(0, this.timeLimit - this.getTimeElapsed());
  }

  finish() {
    if (this.isFinished) return;
    this.isFinished = true;
    this.isRunning = false;
    this.endTime = performance.now();
    if (this.timer) clearInterval(this.timer);

    // Final char stats for current word
    const currentTyped = this.typedHistory[this.currentWordIndex] || '';
    const currentWord = this.words[this.currentWordIndex] || '';
    for (let i = 0; i < Math.max(currentWord.length, currentTyped.length); i++) {
      if (i >= currentWord.length) this.charStats.extra++;
      else if (i >= currentTyped.length) this.charStats.missed++;
      else if (currentWord[i] === currentTyped[i]) this.charStats.correct++;
      else this.charStats.incorrect++;
    }

    const result = {
      wpm: this.getLiveWPM(),
      rawWpm: this.getRawWPM(),
      accuracy: this.getAccuracy(),
      consistency: this.getConsistency(),
      charStats: { ...this.charStats },
      wpmHistory: [...this.wpmHistory],
      keyStats: { ...this.keyStats },
      timeElapsed: Math.round((this.endTime - this.startTime) / 1000),
      wordsTyped: this.currentWordIndex,
      mode: this.mode
    };
    result.grade = this.getGrade(result.wpm, result.accuracy);

    if (this.onComplete) this.onComplete(result);
  }

  forceFinish() {
    if (this.timer) clearInterval(this.timer);
    this.isFinished = true;
    this.isRunning = false;
  }
}

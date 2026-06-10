// ============================================================
// STORAGE — localStorage wrapper for history, leaderboard, settings
// ============================================================

const Storage = (() => {
  const KEYS = {
    results: 'tst_results',
    leaderboard: 'tst_leaderboard',
    settings: 'tst_settings',
    personalBest: 'tst_pb'
  };

  function get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch {
      return null;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  // Results history (last 50)
  function addResult(result) {
    const results = get(KEYS.results) || [];
    results.unshift({ ...result, timestamp: Date.now() });
    if (results.length > 50) results.pop();
    set(KEYS.results, results);
  }

  function getResults() {
    return get(KEYS.results) || [];
  }

  function clearResults() {
    set(KEYS.results, []);
  }

  // Personal Best
  function getPersonalBest(mode) {
    const pb = get(KEYS.personalBest) || {};
    return pb[mode] || null;
  }

  function updatePersonalBest(mode, wpm, accuracy) {
    const pb = get(KEYS.personalBest) || {};
    const current = pb[mode];
    let isNew = false;
    if (!current || wpm > current.wpm) {
      pb[mode] = { wpm, accuracy, timestamp: Date.now() };
      set(KEYS.personalBest, pb);
      isNew = true;
    }
    return isNew;
  }

  function getAllPersonalBests() {
    return get(KEYS.personalBest) || {};
  }

  // Leaderboard (top 10 per mode key)
  function getLeaderboard(mode) {
    const lb = get(KEYS.leaderboard) || {};
    return (lb[mode] || []).sort((a, b) => b.wpm - a.wpm).slice(0, 10);
  }

  function addLeaderboardEntry(mode, name, wpm, accuracy) {
    const lb = get(KEYS.leaderboard) || {};
    if (!lb[mode]) lb[mode] = [];
    lb[mode].push({ name, wpm, accuracy, timestamp: Date.now() });
    lb[mode] = lb[mode].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
    set(KEYS.leaderboard, lb);
  }

  function clearLeaderboard() {
    set(KEYS.leaderboard, {});
  }

  // Settings
  const defaultSettings = {
    theme: 'dark',
    sound: true,
    caretStyle: 'line',
    showLiveWpm: true,
    showProgress: true,
    difficulty: 'medium',
    timeMode: 60,
    wordMode: 25,
    testMode: 'time',
    includeNumbers: false,
    includePunctuation: false,
    playerName: 'Anonymous'
  };

  function getSettings() {
    const saved = get(KEYS.settings) || {};
    return { ...defaultSettings, ...saved };
  }

  function saveSettings(settings) {
    set(KEYS.settings, settings);
  }

  function updateSetting(key, value) {
    const s = getSettings();
    s[key] = value;
    saveSettings(s);
  }

  return {
    addResult, getResults, clearResults,
    getPersonalBest, updatePersonalBest, getAllPersonalBests,
    getLeaderboard, addLeaderboardEntry, clearLeaderboard,
    getSettings, saveSettings, updateSetting
  };
})();

# ⌨️ TypeMaster Pro — Premium Typing Speed Test

**🌍 Live Demo:** [TypeMaster Pro](https://typing-speed-test-two-eta.vercel.app/)

Welcome to **TypeMaster Pro**, a fully featured, highly polished typing speed test web application built entirely with HTML, CSS, and Vanilla JavaScript. It requires no backend, no databases, and no complex setup to run.

![TypeMaster Pro](https://via.placeholder.com/800x400.png?text=TypeMaster+Pro)

## 🚀 Features

- **Advanced Typing Engine:** 
  - Real-time character-by-character color highlighting (Correct, Incorrect, Extra, Missed).
  - Smooth animated caret tracking your typing position.
  - Live WPM (Words Per Minute) and Accuracy tracking that updates dynamically as you type.
  - Full backspace support for error correction within active words.
- **Multiple Test Modes:** 
  - **Time Mode:** Race against the clock (15s, 30s, 60s, 120s).
  - **Words Mode:** Type a set number of words (10, 25, 50, 100).
  - **Quote Mode:** Practice typing famous historical quotes.
  - **Custom Mode:** Paste your own text to practice specific content.
- **Difficulty & Modifiers:** 
  - Easy, Medium, and Hard word banks.
  - Toggles to include numbers and punctuation for an extra challenge.
- **Stunning UI & 4 Themes:** 
  - Premium Glassmorphism design with an animated particle background.
  - **Dark Mode** (Default)
  - **Light Mode**
  - **Hacker Mode** (Retro green terminal)
  - **Ocean Mode**
- **Rich Analytics & Progress Tracking:**
  - Detailed result screen with WPM, Raw WPM, Accuracy, Consistency, and a visual grade (S/A/B/C/D).
  - Beautiful, dependency-free Canvas WPM line chart showing your speed fluctuations.
  - Local Storage persistence for your **Personal Bests**, **Leaderboard (Top 10)**, and **Test History**.
- **Immersive Audio:** Mechanical keyboard sounds, error beeps, and success fanfares powered by the Web Audio API (can be toggled).

## 🛠️ How to Use

Since TypeMaster Pro is a purely frontend web application, running it is incredibly simple:

1. **Clone or Download** the repository to your local machine.
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Start typing! 

Alternatively, if you have Python installed and want to run it on a local server, you can use:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
Typing-Speed-Test/
├── index.html          # Main HTML semantic shell and structure
├── css/
│   └── style.css       # Complete styling, variables, glassmorphism, themes
├── js/
│   ├── words.js        # Word banks and quote database
│   ├── engine.js       # Core logic for typing, WPM calculation, and stats
│   ├── ui.js           # DOM manipulation, theme handling, sounds, and animations
│   ├── chart.js        # Custom pure-Canvas line chart renderer
│   ├── storage.js      # LocalStorage wrapper for settings and persistence
│   └── app.js          # Main application controller
└── file.py             # The original basic CLI version (kept for legacy reference)
```

## 📜 Origin

This project originated as a basic 50-line Python CLI script (`file.py`) that calculated simple typing speeds in the console. It has since been upgraded into its "Extreme Standard" as a full-fledged, professional web application.

## 🤝 Contributing

Feel free to fork the repository, make improvements, and submit pull requests. New themes, additional quotes, and UI enhancements are always welcome!

## 📄 License

This project is open-source and free to use, modify, and distribute.

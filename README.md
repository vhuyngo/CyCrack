# CyCrack 🔐

[![GitHub](https://img.shields.io/badge/GitHub-vhuyngo-181717?logo=github)](https://github.com/vhuyngo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cryptography-themed password guessing game where players decode encrypted passwords using various cipher techniques. Test your cryptanalysis skills across 5 progressively challenging levels!

**[Play CyCrack](https://vhuyngo.github.io/cycrack/)** | **[View Source](https://github.com/vhuyngo/cycrack)**

## Features

### Gameplay
- **5 Difficulty Levels**: Rookie → Initiate → Hacker → Expert → Master
- **17 Cipher Types**: From simple reversals to combined encryption methods
- **Progressive Unlocking**: Complete levels to unlock new challenges
- **Random Word Generation**: Unique random letter sequences generated based on game start time
- **Educational Focus**: Cipher name shown upfront with progressive hints
- **Streak Bonuses**: Chain correct answers for multiplied scores
- **Count-Up Timer**: Points decrease as time increases - solve quickly for maximum score

### Educational Hint System
The game focuses on teaching cryptography. The cipher name is **always shown upfront**, and hints help you learn how to decode it:

| Hint | What It Reveals | Score Multiplier |
|------|-----------------|------------------|
| **Hint 1** | Detailed description of how the cipher works | ×0.9 |
| **Hint 2** | Example showing transformation of the **first letter** of the word | ×0.7 |
| **Hint 3** | Python code framework - complete and run to decode | ×0.4 |

Hints must be used in order and each progressively reduces your score multiplier.

### Interactive Python IDE
- **Real Python Runtime**: Uses Pyodide (CPython compiled to WebAssembly) for authentic Python execution
- **Full Python Support**: All standard library functions, loops, string operations, etc.
- **Built-in Code Editor**: Write and run actual Python code to decode ciphers
- **Keyboard Shortcuts**: Tab for indentation, Ctrl+/ for comments
- **Almost-Complete Templates**: Hint 3 provides working code with small gaps to fill
- **Reopen Anytime**: Button available to reopen the IDE after closing

### Scratch Notepad
- **Always Visible**: Dedicated scratch notepad panel on the right side
- **Persistent Notes**: Notes saved during your session
- **Perfect for**: Working out cipher logic, tracking letter mappings, testing theories

### Cipher Types by Level

| Level | Difficulty | Ciphers |
|-------|------------|---------|
| **1. Rookie** | Easy | Reversed, ROT13, Simple Shift |
| **2. Initiate** | Easy-Medium | Caesar, Atbash, A1Z26 |
| **3. Hacker** | Medium | Vigenère, Rail Fence, Morse, Binary |
| **4. Expert** | Hard | Affine, Substitution, Columnar, Hexadecimal |
| **5. Master** | Expert | Double Caesar, Reverse+Caesar, Atbash+Vigenère |

### Give Up Feature
Stuck on a puzzle? You can:
- Click "Give Up & Reveal Password" to see the answer
- Confirmation popup prevents accidental reveals
- Start a new game immediately after

### Visual Enhancements
- **Confetti Celebrations**: Particle effects when you solve a challenge
- **Level Complete Screens**: Custom congratulatory messages for each level
- **Animated UI**: Smooth transitions, glowing effects, and pulsing animations
- **Previous Attempts Tracking**: See all your guesses in the left sidebar with green highlighting for correct characters
- **Score Multiplier Display**: Real-time feedback on potential points
- **3-Column Layout**: Cipher info, main game, and toggleable scratch notes side by side
- **No Attempt Limit**: Focus on learning - unlimited guesses per challenge

### Statistics & Persistence
- **Comprehensive Stats**: Games played, passwords cracked, highest score, best streak
- **Cipher Mastery**: Track success rate for each cipher type (solved/attempts)
- **Game History**: View your last 10 games with scores and accuracy
- **Time Tracking**: Total time spent playing
- **Progress Saved**: All statistics persist in localStorage

## How to Play

1. **Select a Level**: Choose your starting difficulty (locked levels require completing 5 challenges from the previous level)
2. **Decode the Password**: You'll see an encrypted password - no hints about what the word is!
3. **Use Cipher Hints**: Hover over the `?` button to see what the next hint reveals, then click to use it
4. **Submit Your Guess**: Type your answer and press Enter or click "Crack It"
5. **Unlimited Attempts**: No attempt limit - keep trying until you crack it!
6. **Complete 5 Challenges**: Complete all 5 challenges in a level to unlock the next stage
7. **Track Your Progress**: Previous attempts shown in the left sidebar with green highlighting for correct character positions
8. **Use Scratch Notes**: Toggle the notepad (📝 icon) to take notes - persists through the level
9. **Beat the Clock**: Faster solutions earn bonus points
10. **Press Enter**: Quick navigation - press Enter on result screens to continue

## Scoring System

```
Final Score = (Base Points - Time Penalty) × Hint Multiplier × Attempt Bonus × Streak Bonus
```

- **Base Points**: 100 (Rookie) → 500 (Master)
- **Time Penalty**: Points decrease as time increases (solve quickly!)
- **Hint Multiplier**: ×1.0 (no hints) → ×0.4 (all hints)
- **Attempt Bonus**: 1.5× (first try) → 0.85× (max attempts)
- **Streak Bonus**: Increases with consecutive correct answers

### Random Word Generation
Words are randomly generated letter sequences (not dictionary words):
- **Rookie**: 3 random letters
- **Initiate**: 5 random letters
- **Hacker**: 8 random letters
- **Expert**: 10 random letters
- **Master**: 20 random letters

Each game session uses a seed based on start time, ensuring reproducible randomness.

## Running the Game

Simply open `index.html` in any modern web browser. The game will automatically load the Python runtime (Pyodide) for the code editor.

```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server
```

Then navigate to `http://localhost:8000`

## Deploying to GitHub Pages

This game is fully compatible with GitHub Pages. Follow these steps to deploy:

### Option 1: Deploy from Main Branch

1. Push your code to a GitHub repository
2. Go to your repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Choose `main` branch and `/ (root)` folder
5. Click Save
6. Your game will be live at `https://yourusername.github.io/repository-name/`

### Option 2: Using GitHub Actions

1. Push your code to GitHub
2. Go to Settings → Pages
3. Under "Source", select "GitHub Actions"
4. The default static site workflow will work

### Files Included for GitHub Pages

- `.nojekyll` - Disables Jekyll processing (faster builds)
- `404.html` - Redirects unknown routes to the main page

## Project Structure

```
cycrack/
├── index.html      # Main HTML structure with all screens and modals
├── styles.css      # Modern dark theme with animations and effects
├── ciphers.js      # Cipher implementations with getExample() methods
├── levels.js       # Level config, word lists, scoring, hint multipliers
├── app.js          # Game logic, state, UI, confetti, Pyodide integration
├── .nojekyll       # Disables Jekyll for GitHub Pages
├── 404.html        # 404 redirect page for GitHub Pages
└── README.md       # This file

External Dependencies (loaded via CDN):
└── Pyodide v0.24.1 # Python runtime for WebAssembly
```

## Educational Value

This game teaches:
- **Classical Ciphers**: Caesar, Vigenère, Atbash, and more
- **Transposition Ciphers**: Rail Fence, Columnar
- **Encoding Schemes**: Morse, Binary, Hexadecimal, A1Z26
- **Combined Ciphers**: Multi-step encryption
- **Frequency Analysis**: Visual letter frequency display
- **Cryptanalysis Basics**: Pattern recognition and deduction

## Browser Support

Works in all modern browsers that support WebAssembly:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: The Python code editor uses Pyodide (CPython compiled to WebAssembly), which requires a modern browser with WASM support. The first time you use the Python editor, it will take a moment to load the runtime (~10MB download, cached after first load).

## Author

**Vinh-Huy Ngo** - [@vhuyngo](https://github.com/vhuyngo)

## License

MIT License - Feel free to modify and share!

---

Made with ❤️ for cryptography enthusiasts

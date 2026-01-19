# 🎮 Sudoka - Sudoku Game

A complete Sudoku puzzle game built with vanilla HTML, CSS, and JavaScript.

🔗 **Play now:** [https://sm219uv.github.io/Sudoka](https://sm219uv.github.io/Sudoka)

---

## 📖 About This Project

This is my learning project for web development. The goal was to create a Sudoku game that my grandmother could play on her phone or tablet.

### What I Built:
- Complete Sudoku game with puzzle generation
- 3 difficulty levels (Easy, Medium, Hard)
- Timer and mistake counter
- Pencil mode for notes
- Save/Load game progress
- Responsive design for all devices
- Progressive Web App (PWA) for offline play

---

## 🎯 What I Learned

### HTML
- Semantic HTML structure
- Meta tags for PWA and mobile
- Linking CSS and JavaScript files

### CSS
- Flexbox and CSS Grid layouts
- Responsive design with media queries
- CSS animations and transitions
- Mobile-first approach

### JavaScript
- DOM manipulation
- Event listeners and handling
- Local Storage API
- Backtracking algorithm (puzzle solver)
- Modular code organization
- Service Workers for offline support

### Web Development Concepts
- Progressive Web Apps (PWA)
- Manifest.json configuration
- Service Worker caching
- Responsive breakpoints
- User experience design

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🎲 Puzzle Generator | Creates unique puzzles with backtracking algorithm |
| ⏱️ Timer | Tracks solving time |
| ❌ Mistake Counter | Max 3 mistakes before game over |
| ✏️ Pencil Mode | Add notes to cells |
| ↩️ Undo | Revert last move (Ctrl+Z) |
| 💡 Hint | Get help when stuck |
| 🏆 Leaderboard | Best times for each difficulty |
| 💾 Auto-Save | Continue where you left off |
| 🎊 Confetti | Celebration animation on win |
| 📱 Responsive | Works on mobile, tablet, desktop |
| 📴 Offline | Play without internet (PWA) |

---

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling, Grid, Flexbox, Animations
- **JavaScript** - Game logic, DOM manipulation
- **Web APIs** - localStorage, Service Worker, Vibration API
- **PWA** - Manifest, Service Worker for offline support

---

## 📁 Project Structure

```
Sudoka/
├── index.html          # Main game page
├── privacy.html        # Privacy policy (for app stores)
├── manifest.json       # PWA configuration
├── sw.js              # Service Worker for offline
├── css/
│   └── style.css      # All styles (860+ lines)
├── js/
│   ├── main.js        # App initialization, events
│   ├── grid.js        # Grid rendering, cell selection
│   ├── generator.js   # Puzzle generation
│   ├── solver.js      # Backtracking solver
│   └── storage.js     # LocalStorage operations
└── icons/
    └── icon.svg       # App icon
```

---

## 🎮 How to Play

1. Choose difficulty (Easy, Medium, Hard)
2. Click a cell to select it
3. Click a number (1-9) to fill it
4. Use Pencil mode for notes
5. Complete the puzzle before 3 mistakes!

### Controls:
- **Numbers 1-9** - Enter number
- **Backspace/Delete** - Clear cell
- **Arrow keys** - Move selection
- **Ctrl+Z** - Undo last move
- **Escape** - Go back to menu

---

## 🏃 Run Locally

```bash
# Clone the repository
git clone https://github.com/sm219uv/Sudoka.git
cd Sudoka

# Start a local server
python3 -m http.server 3000

# Open in browser
# http://localhost:3000
```

---

## 📱 Install as App

This is a Progressive Web App! You can install it:

1. Open [https://sm219uv.github.io/Sudoka](https://sm219uv.github.io/Sudoka)
2. Chrome: Click "Install" in address bar
3. Or: Menu → "Add to Home Screen"

---

## 🙏 Acknowledgments

- Built with ❤️ for my grandmother who loves Sudoku
- Confetti animation by [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 📄 License

This project is open source and available for learning purposes.

---

Made with ☕ and 💜

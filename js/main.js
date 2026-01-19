/* ============================================
   MAIN.JS - Hlavný súbor, spúšťa hru
   ============================================ */

// === GLOBÁLNE PREMENNÉ ===
let currentPuzzle = null;      // Aktuálny stav hry
let currentSolution = null;    // Riešenie
let fixedCells = null;         // Ktoré políčka sú fixné
let currentDifficulty = 'easy';

// Timer
let timerInterval = null;
let elapsedTime = 0;

// Mistake counter
let mistakeCount = 0;
const MAX_MISTAKES = 3;

// Pencil mode
let pencilMode = false;
let pencilMarks = null; // 9x9 pole setov

// Screens
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');

// === INICIALIZÁCIA ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Sudoku sa spúšťa...');
    
    // Vytvor mriežku
    createGrid();
    
    // Nastav event listenery
    setupEventListeners();
    
    // Aktualizuj leaderboard
    updateLeaderboard();
    
    // Skontroluj či existuje uložená hra
    const savedGame = loadGame();
    if (savedGame) {
        // Ukáž tlačidlo pokračovať
        document.getElementById('continue-section').style.display = 'block';
    }
    
    // Support banner - skontroluj či bol zatvorený
    setupSupportBanner();
    
    // Zostaň na menu screen
    showScreen('menu');
    
    console.log('✅ Sudoku pripravené!');
});

/**
 * Setup support banner
 */
function setupSupportBanner() {
    const banner = document.getElementById('support-banner');
    const closeBtn = document.getElementById('close-support');
    const watchAdBtn = document.getElementById('watch-ad-btn');
    
    // Check if user closed the banner
    if (localStorage.getItem('supportBannerClosed') === 'true') {
        banner.classList.add('hidden');
    }
    
    // Close banner
    closeBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
        localStorage.setItem('supportBannerClosed', 'true');
    });
    
    // Watch ad button
    watchAdBtn.addEventListener('click', () => {
        showRewardedAd();
    });
}

/**
 * Show rewarded ad
 * Replace this with actual ad network integration (AdMob, Unity Ads, etc.)
 */
function showRewardedAd() {
    // Placeholder - shows a thank you message
    // TODO: Integrate with actual ad network like Google AdMob
    
    const adOverlay = document.createElement('div');
    adOverlay.className = 'ad-overlay';
    adOverlay.innerHTML = `
        <div class="ad-container">
            <div class="ad-content">
                <h2>📺 Ad Placeholder</h2>
                <p>Thank you for wanting to support!</p>
                <p class="ad-timer">Ad will close in <span id="ad-countdown">5</span>s</p>
                <div class="ad-progress">
                    <div class="ad-progress-bar" id="ad-progress-bar"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(adOverlay);
    
    // Countdown timer
    let seconds = 5;
    const countdown = document.getElementById('ad-countdown');
    const progressBar = document.getElementById('ad-progress-bar');
    
    const timer = setInterval(() => {
        seconds--;
        countdown.textContent = seconds;
        progressBar.style.width = ((5 - seconds) / 5 * 100) + '%';
        
        if (seconds <= 0) {
            clearInterval(timer);
            adOverlay.remove();
            
            // Show thank you message
            alert('🙏 Thank you for your support!');
            
            // Track ad views
            const adViews = parseInt(localStorage.getItem('adViews') || '0') + 1;
            localStorage.setItem('adViews', adViews.toString());
        }
    }, 1000);
}

/**
 * Prepne medzi obrazovkami
 */
function showScreen(screen) {
    if (screen === 'menu') {
        menuScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        stopTimer();
    } else {
        menuScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
    }
}

/**
 * Nastaví všetky event listenery
 */
function setupEventListeners() {
    // Tlačidlá výberu obťažnosti
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            startNewGame(difficulty);
            showScreen('game');
        });
    });
    
    // Tlačidlo pokračovať
    document.getElementById('continue-btn').addEventListener('click', () => {
        continueGame();
    });
    
    // Tlačidlo späť
    document.getElementById('back-btn').addEventListener('click', () => {
        goBack();
    });
    
    // Číslovník (1-9 a mazanie)
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const num = parseInt(btn.dataset.num);
            setNumber(num);
        });
    });
    
    // Tlačidlo Undo
    document.getElementById('undo-btn').addEventListener('click', () => {
        undoMove();
    });
    
    // Tlačidlo Pomôcka (Hint)
    document.getElementById('hint-btn').addEventListener('click', () => {
        giveHint();
    });
    
    // Tlačidlo Vzdať sa
    document.getElementById('give-up-btn').addEventListener('click', () => {
        giveUp();
    });
    
    // Tlačidlo Ceruzka (Pencil mode)
    document.getElementById('pencil-btn').addEventListener('click', () => {
        togglePencilMode();
    });
    
    // Klávesnica
    document.addEventListener('keydown', handleKeyPress);
}

/**
 * Pokračovať v uloženej hre
 */
function continueGame() {
    const savedGame = loadGame();
    if (savedGame) {
        currentPuzzle = savedGame.puzzle;
        currentSolution = savedGame.solution;
        fixedCells = savedGame.fixed;
        elapsedTime = savedGame.time || 0;
        currentDifficulty = savedGame.difficulty || 'easy';
        mistakeCount = savedGame.mistakes || 0;
        
        // Inicializuj pencil marks
        pencilMarks = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
        if (savedGame.pencilMarks) {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (savedGame.pencilMarks[r][c]) {
                        pencilMarks[r][c] = new Set(savedGame.pencilMarks[r][c]);
                    }
                }
            }
        }
        
        renderGrid(currentPuzzle, fixedCells);
        updateAllPencilMarks();
        updateTimerDisplay();
        updateMistakeDisplay();
        updateNumberButtons();
        updateDifficultyDisplay();
        startTimer();
        
        showScreen('game');
        console.log('Pokračujem v uloženej hre');
    }
}

/**
 * Return to menu
 */
function goBack() {
    if (confirm('Are you sure you want to leave? Your game will be saved.')) {
        saveGame();
        stopTimer();
        showScreen('menu');
        updateLeaderboard();
        document.getElementById('continue-section').style.display = 'block';
    }
}

/**
 * Give Up
 */
function giveUp() {
    if (confirm('Are you sure you want to give up? Progress will not be saved.')) {
        stopTimer();
        clearSave();
        showScreen('menu');
        updateLeaderboard();
        document.getElementById('continue-section').style.display = 'none';
    }
}

/**
 * Updates difficulty display in game
 */
function updateDifficultyDisplay() {
    const names = {
        easy: '😊 Easy',
        medium: '🤔 Medium',
        hard: '😈 Hard'
    };
    document.getElementById('current-difficulty').textContent = names[currentDifficulty] || 'Easy';
}

/**
 * Aktualizuje leaderboard
 */
function updateLeaderboard() {
    const bestTimes = getBestTimes();
    
    document.getElementById('best-easy').textContent = 
        bestTimes.easy ? formatTime(bestTimes.easy) : '--:--';
    document.getElementById('best-medium').textContent = 
        bestTimes.medium ? formatTime(bestTimes.medium) : '--:--';
    document.getElementById('best-hard').textContent = 
        bestTimes.hard ? formatTime(bestTimes.hard) : '--:--';
}

/**
 * Spracuje stlačenie klávesy
 * @param {KeyboardEvent} e
 */
function handleKeyPress(e) {
    // Ignoruj ak sme na menu
    if (gameScreen.style.display === 'none') return;
    
    // Ctrl+Z = Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoMove();
        return;
    }
    
    // Čísla 1-9
    if (e.key >= '1' && e.key <= '9') {
        setNumber(parseInt(e.key));
    }
    // Backspace alebo Delete = vymazať
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setNumber(0);
    }
    // Šípky na pohyb
    else if (e.key.startsWith('Arrow')) {
        moveSelection(e.key);
    }
    // Escape = späť
    else if (e.key === 'Escape') {
        goBack();
    }
}
/**
 * Pohyb výberu šípkami
 * @param {string} key - ArrowUp, ArrowDown, ArrowLeft, ArrowRight
 */
function moveSelection(key) {
    if (!selectedCell) return;
    
    let row = parseInt(selectedCell.dataset.row);
    let col = parseInt(selectedCell.dataset.col);
    
    switch (key) {
        case 'ArrowUp':    row = Math.max(0, row - 1); break;
        case 'ArrowDown':  row = Math.min(8, row + 1); break;
        case 'ArrowLeft':  col = Math.max(0, col - 1); break;
        case 'ArrowRight': col = Math.min(8, col + 1); break;
    }
    
    // Nájdi políčko na novej pozícii
    const newCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (newCell) {
        selectCell(newCell);
    }
}

/**
 * Začne novú hru
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 */
function startNewGame(difficulty) {
    console.log(`Začínam novú hru: ${difficulty}`);
    
    // Zastaví timer
    stopTimer();
    
    // Generuj puzzle
    const { puzzle, solution, fixed } = generatePuzzle(difficulty);
    
    currentPuzzle = puzzle;
    currentSolution = solution;
    fixedCells = fixed;
    currentDifficulty = difficulty;
    
    // Vykresli mriežku
    renderGrid(currentPuzzle, fixedCells);
    
    // Reset timer
    elapsedTime = 0;
    updateTimerDisplay();
    startTimer();
    
    // Reset mistake counter
    mistakeCount = 0;
    updateMistakeDisplay();
    
    // Reset pencil marks
    pencilMarks = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));
    
    // Reset pencil mode
    pencilMode = false;
    updatePencilButton();
    
    // Reset Undo history
    clearMoveHistory();
    
    // Update number buttons (exhausted numbers)
    updateNumberButtons();
    
    // Update difficulty display
    updateDifficultyDisplay();
    
    // Vymaž starú uloženú hru
    clearSave();
    
    // Odstráň výhernú triedu
    gridElement.classList.remove('won');
    
    // Odznač výber
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
}

/**
 * Dá hráčovi pomôcku (vyplní náhodné prázdne políčko)
 */
function giveHint() {
    // Nájdi všetky prázdne políčka
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentPuzzle[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    // Ak nie sú prázdne políčka, skonči
    if (emptyCells.length === 0) {
        console.log('Žiadne prázdne políčka');
        return;
    }
    
    // Vyber náhodné prázdne políčko
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    
    // Vyplň správnou hodnotou
    currentPuzzle[row][col] = currentSolution[row][col];
    fixedCells[row][col] = true;
    
    // Aktualizuj zobrazenie
    renderGrid(currentPuzzle, fixedCells);
    
    console.log(`Pomôcka: ${row + 1},${col + 1} = ${currentSolution[row][col]}`);
    
    saveGame();
    checkWin();
}

/**
 * Show full solution
 */
function showSolution() {
    if (confirm('Are you sure you want to see the solution?')) {
        currentPuzzle = copyGrid(currentSolution);
        renderGrid(currentPuzzle, fixedCells);
        stopTimer();
        clearSave();
    }
}

// === TIMER ===

/**
 * Spustí timer
 */
function startTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        elapsedTime++;
        updateTimerDisplay();
    }, 1000);
}

/**
 * Zastaví timer
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Aktualizuje zobrazenie timera
 */
function updateTimerDisplay() {
    document.getElementById('timer-display').textContent = formatTime(elapsedTime);
}

/**
 * Aktualizuje zobrazenie chýb
 */
function updateMistakeDisplay() {
    document.getElementById('mistake-display').textContent = `${mistakeCount}/${MAX_MISTAKES}`;
}

/**
 * Prepne pencil mode
 */
function togglePencilMode() {
    pencilMode = !pencilMode;
    updatePencilButton();
}

/**
 * Updates pencil button
 */
function updatePencilButton() {
    const btn = document.getElementById('pencil-btn');
    if (pencilMode) {
        btn.textContent = '✏️ Pencil: ON';
        btn.classList.add('active');
    } else {
        btn.textContent = '✏️ Pencil: OFF';
        btn.classList.remove('active');
    }
}

/**
 * Aktualizuje číslovník - stmaví vyčerpané čísla
 */
function updateNumberButtons() {
    for (let num = 1; num <= 9; num++) {
        const count = countNumber(num);
        const btn = document.querySelector(`.num-btn[data-num="${num}"]`);
        
        if (count >= 9) {
            btn.classList.add('exhausted');
        } else {
            btn.classList.remove('exhausted');
        }
    }
}

/**
 * Spočíta koľkokrát sa číslo vyskytuje v mriežke
 */
function countNumber(num) {
    let count = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentPuzzle[row][col] === num) {
                count++;
            }
        }
    }
    return count;
}

/**
 * Odstráni číslo z pencil marks v rovnakom riadku, stĺpci a boxe
 */
function removePencilMarksFor(row, col, num) {
    // Odstráň z riadku
    for (let c = 0; c < 9; c++) {
        pencilMarks[row][c].delete(num);
    }
    
    // Odstráň zo stĺpca
    for (let r = 0; r < 9; r++) {
        pencilMarks[r][col].delete(num);
    }
    
    // Odstráň z 3x3 boxu
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            pencilMarks[r][c].delete(num);
        }
    }
}

console.log('Main.js načítaný');

/* ============================================
   GRID.JS - Vykreslenie Sudoku mriežky
   ============================================ */

// Referencia na HTML element mriežky
const gridElement = document.getElementById('sudoku-grid');

// Aktuálne vybraté políčko
let selectedCell = null;

// História ťahov pre Undo
let moveHistory = [];

// Zvukové efekty
const sounds = {
    place: null,
    error: null,
    win: null
};

/**
 * Inicializuj zvuky (lazy loading)
 */
function initSounds() {
    // Vytvoríme zvuky pomocou Web Audio API (bez externých súborov)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    sounds.ctx = new AudioContext();
}

/**
 * Prehrá zvuk
 */
function playSound(type) {
    if (!sounds.ctx) initSounds();
    if (!sounds.ctx) return;
    
    const ctx = sounds.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'place') {
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialDecayTo && gain.gain.exponentialDecayTo(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'error') {
        osc.frequency.value = 200;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'win') {
        // Víťazná melódia
        [523, 659, 784, 1047].forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
            o.start(ctx.currentTime + i * 0.15);
            o.stop(ctx.currentTime + i * 0.15 + 0.15);
        });
    }
}

/**
 * Vibrácia (pre mobily)
 */
function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

/**
 * Vytvorí 81 políčok v mriežke
 * Toto sa volá raz pri načítaní stránky
 */
function createGrid() {
    // Vyprázdni mriežku (keby tam niečo bolo)
    gridElement.innerHTML = '';
    
    // Vytvor 81 políčok (9 riadkov × 9 stĺpcov)
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // Vytvor nový div element
            const cell = document.createElement('div');
            
            // Pridaj triedu "cell"
            cell.classList.add('cell');
            
            // Ulož pozíciu do data atribútov
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Pridaj event listener pre kliknutie
            cell.addEventListener('click', () => selectCell(cell));
            
            // Vlož do mriežky
            gridElement.appendChild(cell);
        }
    }
    
    console.log('Mriežka vytvorená: 81 políčok');
}

/**
 * Vykreslí čísla do mriežky podľa puzzle
 * @param {number[][]} puzzle - 2D pole 9x9 s číslami (0 = prázdne)
 * @param {number[][]} fixedCells - 2D pole označujúce fixné políčka
 */
function renderGrid(puzzle, fixedCells) {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = puzzle[row][col];
        
        // Vymaž predchádzajúce triedy
        cell.classList.remove('fixed', 'error', 'highlight', 'selected');
        
        // Nastav hodnotu
        if (value !== 0) {
            cell.textContent = value;
        } else {
            cell.textContent = '';
        }
        
        // Označ fixné políčka
        if (fixedCells && fixedCells[row][col]) {
            cell.classList.add('fixed');
        }
    });
}

/**
 * Vyberie políčko po kliknutí
 * @param {HTMLElement} cell - Kliknuté políčko
 */
function selectCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Zvýrazni riadok, stĺpec a box
    highlightRelatedCells(row, col);
    
    // Zvýrazni rovnaké čísla (aj pre fixné políčka)
    highlightSameNumbers(cell.textContent);
    
    // Ak je fixné, nevyberaj pre editáciu, ale ukonči
    if (cell.classList.contains('fixed')) {
        // Odznač predchádzajúce vybrané
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            selectedCell = null;
        }
        return;
    }
    
    // Odznač predchádzajúce vybrané
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    
    // Označ nové
    cell.classList.add('selected');
    selectedCell = cell;
    
    console.log(`Vybrané políčko: riadok ${cell.dataset.row}, stĺpec ${cell.dataset.col}`);
}

/**
 * Zvýrazní riadok, stĺpec a 3x3 box pre dané políčko
 */
function highlightRelatedCells(selectedRow, selectedCol) {
    const cells = document.querySelectorAll('.cell');
    
    // Vypočítaj 3x3 box
    const boxRow = Math.floor(selectedRow / 3) * 3;
    const boxCol = Math.floor(selectedCol / 3) * 3;
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Odznač predchádzajúce zvýraznenie
        cell.classList.remove('related');
        
        // Zvýrazni ak je v rovnakom riadku, stĺpci alebo boxe
        const sameRow = row === selectedRow;
        const sameCol = col === selectedCol;
        const sameBox = row >= boxRow && row < boxRow + 3 && 
                        col >= boxCol && col < boxCol + 3;
        
        if (sameRow || sameCol || sameBox) {
            cell.classList.add('related');
        }
    });
}

/**
 * Zvýrazní všetky políčka s rovnakým číslom
 * @param {string} number - Číslo na zvýraznenie
 */
function highlightSameNumbers(number) {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        cell.classList.remove('highlight');
        
        if (number && cell.textContent === number) {
            cell.classList.add('highlight');
        }
    });
}

/**
 * Vloží číslo do vybraného políčka
 * @param {number} num - Číslo 1-9 (0 = vymazať)
 */
function setNumber(num) {
    if (!selectedCell) {
        console.log('Žiadne políčko nie je vybrané');
        return;
    }
    
    if (selectedCell.classList.contains('fixed')) {
        console.log('Toto políčko sa nedá zmeniť');
        return;
    }
    
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    
    // PENCIL MODE
    if (pencilMode && num !== 0) {
        // Ak už je v políčku číslo, ignoruj
        if (currentPuzzle[row][col] !== 0) {
            return;
        }
        
        // Toggle pencil mark
        if (pencilMarks[row][col].has(num)) {
            pencilMarks[row][col].delete(num);
        } else {
            pencilMarks[row][col].add(num);
        }
        
        // Aktualizuj zobrazenie pencil marks
        renderPencilMarks(selectedCell, pencilMarks[row][col]);
        saveGame();
        return;
    }
    
    // Ak mazanie, povol
    if (num === 0) {
        selectedCell.textContent = '';
        selectedCell.innerHTML = '';
        currentPuzzle[row][col] = 0;
        pencilMarks[row][col].clear();
        highlightSameNumbers('');
        updateNumberButtons();
        saveGame();
        return;
    }
    
    // Skontroluj či je číslo správne podľa riešenia
    if (currentSolution[row][col] !== num) {
        // Nesprávne číslo - pridaj chybu
        mistakeCount++;
        updateMistakeDisplay();
        
        // Blikni červeno + vibrácia
        selectedCell.classList.add('error');
        vibrate([100, 50, 100]);
        playSound('error');
        setTimeout(() => {
            selectedCell.classList.remove('error');
        }, 500);
        
        console.log(`Chyba! ${mistakeCount}/${MAX_MISTAKES}`);
        
        // Check if out of attempts
        if (mistakeCount >= MAX_MISTAKES) {
            stopTimer();
            setTimeout(() => {
                alert('❌ Game Over! Too many mistakes.\n\nTry a new game.');
            }, 300);
        }
        return;
    }
    
    // Ulož do histórie pre Undo
    const oldValue = currentPuzzle[row][col];
    const oldPencilMarks = new Set(pencilMarks[row][col]);
    moveHistory.push({
        row,
        col,
        oldValue,
        newValue: num,
        oldPencilMarks
    });
    
    // Správne číslo - vlož ho
    selectedCell.textContent = num;
    currentPuzzle[row][col] = num;
    
    // Zvuk
    playSound('place');
    
    // Vymaž pencil marks z tohto políčka
    pencilMarks[row][col].clear();
    
    // Odstráň toto číslo z pencil marks v riadku/stĺpci/boxe
    removePencilMarksFor(row, col, num);
    
    // Aktualizuj zobrazenie pencil marks
    updateAllPencilMarks();
    
    // Zvýrazni rovnaké čísla
    highlightSameNumbers(selectedCell.textContent);
    
    // Aktualizuj číslovník (vyčerpané čísla)
    updateNumberButtons();
    
    // Ulož hru
    saveGame();
    
    // Skontroluj výhru
    checkWin();
}

/**
 * Vykreslí pencil marks do políčka
 */
function renderPencilMarks(cell, marks) {
    if (marks.size === 0) {
        cell.innerHTML = '';
        cell.classList.remove('has-pencil');
        return;
    }
    
    cell.classList.add('has-pencil');
    
    // Vytvor mriežku 3x3 pre pencil marks
    let html = '<div class="pencil-grid">';
    for (let n = 1; n <= 9; n++) {
        if (marks.has(n)) {
            html += `<span class="pencil-num">${n}</span>`;
        } else {
            html += '<span class="pencil-num"></span>';
        }
    }
    html += '</div>';
    
    cell.innerHTML = html;
}

/**
 * Aktualizuje zobrazenie všetkých pencil marks
 */
function updateAllPencilMarks() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Ak políčko má číslo, preskočí
        if (currentPuzzle[row][col] !== 0) {
            return;
        }
        
        renderPencilMarks(cell, pencilMarks[row][col]);
    });
}

/**
 * Zobrazí chyby v mriežke
 */
function showErrors() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        cell.classList.remove('error');
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = currentPuzzle[row][col];
        
        if (value !== 0 && !isValidMove(currentPuzzle, row, col, value)) {
            cell.classList.add('error');
        }
    });
}

/**
 * Skontroluje či hráč vyhral
 */
function checkWin() {
    // Skontroluj či sú všetky políčka vyplnené
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentPuzzle[row][col] === 0) {
                return false;
            }
            if (!isValidMove(currentPuzzle, row, col, currentPuzzle[row][col])) {
                return false;
            }
        }
    }
    
    // WIN!
    console.log('🎉 CONGRATULATIONS! You won!');
    gridElement.classList.add('won');
    stopTimer();
    
    // 🎊 CONFETTI and SOUND!
    launchConfetti();
    playSound('win');
    
    // Save best time
    const isNewBest = saveBestTime(currentDifficulty, elapsedTime);
    clearSave();
    
    const timeStr = document.getElementById('timer-display').textContent;
    const newBestMsg = isNewBest ? '\n\n🏆 NEW RECORD!' : '';
    
    setTimeout(() => {
        alert(`🎉 CONGRATULATIONS! You solved the Sudoku!\n\nTime: ${timeStr}${newBestMsg}`);
        showScreen('menu');
        updateLeaderboard();
        document.getElementById('continue-section').style.display = 'none';
    }, 2000);
    
    return true;
}

/**
 * Spustí konfety animáciu
 */
function launchConfetti() {
    // Skontroluj či je knižnica načítaná
    if (typeof confetti !== 'function') {
        console.error('Confetti knižnica nie je načítaná!');
        return;
    }
    
    console.log('🎊 Spúšťam konfety!');
    
    // Prvá vlna - stred
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 9999
    });
    
    // Druhá vlna - zľava
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            zIndex: 9999
        });
    }, 250);
    
    // Tretia vlna - zprava
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            zIndex: 9999
        });
    }, 400);
    
    // Štvrtá vlna - veľká
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#667eea', '#764ba2', '#f5af19', '#f12711'],
            zIndex: 9999
        });
    }, 600);
}

/**
 * Undo - vráti posledný ťah
 */
function undoMove() {
    if (moveHistory.length === 0) {
        console.log('Žiadny ťah na vrátenie');
        return;
    }
    
    const move = moveHistory.pop();
    const { row, col, oldValue, oldPencilMarks } = move;
    
    // Vráť hodnotu
    currentPuzzle[row][col] = oldValue;
    pencilMarks[row][col] = oldPencilMarks;
    
    // Aktualizuj zobrazenie
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        if (oldValue === 0) {
            if (oldPencilMarks.size > 0) {
                renderPencilMarks(cell, oldPencilMarks);
            } else {
                cell.textContent = '';
                cell.innerHTML = '';
            }
        } else {
            cell.textContent = oldValue;
        }
    }
    
    updateAllPencilMarks();
    updateNumberButtons();
    saveGame();
    
    console.log('Undo: vrátený ťah');
}

/**
 * Vymaž históriu (pri novej hre)
 */
function clearMoveHistory() {
    moveHistory = [];
}

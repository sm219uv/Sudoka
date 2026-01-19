/* ============================================
   STORAGE.JS - Ukladanie a načítanie hry
   ============================================ */

// Kľúč pre localStorage
const STORAGE_KEY = 'sudoku-save';
const BEST_TIMES_KEY = 'sudoku-best-times';

/**
 * Uloží aktuálnu hru do localStorage
 */
function saveGame() {
    // Konvertuj Sets na Arrays pre JSON
    const pencilMarksArray = pencilMarks.map(row => 
        row.map(cell => Array.from(cell))
    );
    
    const gameData = {
        puzzle: currentPuzzle,
        solution: currentSolution,
        fixed: fixedCells,
        time: elapsedTime,
        difficulty: currentDifficulty,
        mistakes: mistakeCount,
        pencilMarks: pencilMarksArray
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    console.log('Hra uložená');
}

/**
 * Načíta uloženú hru z localStorage
 * @returns {object|null} - Dáta hry alebo null
 */
function loadGame() {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (!saved) {
        console.log('Žiadna uložená hra');
        return null;
    }
    
    try {
        const gameData = JSON.parse(saved);
        console.log('Hra načítaná');
        return gameData;
    } catch (e) {
        console.error('Chyba pri načítaní:', e);
        return null;
    }
}

/**
 * Vymaže uloženú hru
 */
function clearSave() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Uložená hra vymazaná');
}

/**
 * Uloží najlepší čas pre danú obťažnosť
 * @param {string} difficulty
 * @param {number} time - Čas v sekundách
 */
function saveBestTime(difficulty, time) {
    const bestTimes = getBestTimes();
    
    if (!bestTimes[difficulty] || time < bestTimes[difficulty]) {
        bestTimes[difficulty] = time;
        localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(bestTimes));
        console.log(`Nový najlepší čas pre ${difficulty}: ${formatTime(time)}`);
        return true;
    }
    
    return false;
}

/**
 * Získa najlepšie časy
 * @returns {object}
 */
function getBestTimes() {
    const saved = localStorage.getItem(BEST_TIMES_KEY);
    return saved ? JSON.parse(saved) : {};
}

/**
 * Formátuje čas na MM:SS
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

console.log('Storage načítaný');

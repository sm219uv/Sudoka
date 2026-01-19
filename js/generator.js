/* ============================================
   GENERATOR.JS - Generovanie Sudoku puzzle
   ============================================ */

/**
 * Zamiešaj pole (Fisher-Yates shuffle)
 * @param {array} array - Pole na zamiešanie
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Vytvor prázdnu 9x9 mriežku
 * @returns {number[][]}
 */
function createEmptyGrid() {
    return Array(9).fill(null).map(() => Array(9).fill(0));
}

/**
 * Vyplní diagonálne 3x3 boxy (sú nezávislé)
 * @param {number[][]} grid
 */
function fillDiagonalBoxes(grid) {
    for (let box = 0; box < 9; box += 3) {
        const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let idx = 0;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                grid[box + i][box + j] = nums[idx++];
            }
        }
    }
}

/**
 * Vygeneruje kompletné vyriešené Sudoku
 * @returns {number[][]}
 */
function generateSolution() {
    const grid = createEmptyGrid();
    
    // Vyplň diagonálne boxy (rýchlejšie)
    fillDiagonalBoxes(grid);
    
    // Vyrieš zvyšok
    solveSudokuRandom(grid);
    
    return grid;
}

/**
 * Rieši Sudoku s náhodným poradím čísel (pre generátor)
 * @param {number[][]} grid
 * @returns {boolean}
 */
function solveSudokuRandom(grid) {
    const empty = findEmptyCell(grid);
    
    if (!empty) {
        return true;
    }
    
    const { row, col } = empty;
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of nums) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveSudokuRandom(grid)) {
                return true;
            }
            
            grid[row][col] = 0;
        }
    }
    
    return false;
}

/**
 * Odstráni čísla z vyriešeného Sudoku
 * @param {number[][]} solution - Vyriešené Sudoku
 * @param {number} count - Počet políčok na odstránenie
 * @returns {object} - { puzzle, fixed }
 */
function removeNumbers(solution, count) {
    const puzzle = copyGrid(solution);
    const fixed = Array(9).fill(null).map(() => Array(9).fill(true));
    
    // Vytvor zoznam všetkých pozícií
    const positions = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            positions.push({ row, col });
        }
    }
    
    // Zamiešaj pozície
    shuffleArray(positions);
    
    let removed = 0;
    
    for (const pos of positions) {
        if (removed >= count) break;
        
        const { row, col } = pos;
        const backup = puzzle[row][col];
        
        // Odstráň číslo
        puzzle[row][col] = 0;
        
        // Over že puzzle má stále jediné riešenie
        const testGrid = copyGrid(puzzle);
        if (countSolutions(testGrid, 2) === 1) {
            fixed[row][col] = false;
            removed++;
        } else {
            // Vráť číslo späť
            puzzle[row][col] = backup;
        }
    }
    
    console.log(`Odstránených ${removed} čísel`);
    
    return { puzzle, fixed };
}

/**
 * Vygeneruje nové Sudoku puzzle
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {object} - { puzzle, solution, fixed }
 */
function generatePuzzle(difficulty = 'easy') {
    // Počet políčok na odstránenie podľa obťažnosti
    const removeCount = {
        easy: 35,
        medium: 45,
        hard: 55
    };
    
    const count = removeCount[difficulty] || 35;
    
    console.log(`Generujem ${difficulty} puzzle...`);
    
    // Vygeneruj riešenie
    const solution = generateSolution();
    
    // Odstráň čísla
    const { puzzle, fixed } = removeNumbers(solution, count);
    
    console.log('Puzzle vygenerované!');
    
    return { puzzle, solution, fixed };
}

console.log('Generator načítaný');

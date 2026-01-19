/* ============================================
   SOLVER.JS - Validácia a riešenie Sudoku
   ============================================ */

/**
 * Skontroluje či je číslo platné v riadku
 * @param {number[][]} grid - Sudoku mriežka
 * @param {number} row - Riadok
 * @param {number} num - Číslo na kontrolu
 * @param {number} excludeCol - Stĺpec ktorý vynechať (aktuálna pozícia)
 * @returns {boolean}
 */
function isValidRow(grid, row, num, excludeCol) {
    for (let col = 0; col < 9; col++) {
        if (col !== excludeCol && grid[row][col] === num) {
            return false;
        }
    }
    return true;
}

/**
 * Skontroluje či je číslo platné v stĺpci
 * @param {number[][]} grid - Sudoku mriežka
 * @param {number} col - Stĺpec
 * @param {number} num - Číslo na kontrolu
 * @param {number} excludeRow - Riadok ktorý vynechať
 * @returns {boolean}
 */
function isValidCol(grid, col, num, excludeRow) {
    for (let row = 0; row < 9; row++) {
        if (row !== excludeRow && grid[row][col] === num) {
            return false;
        }
    }
    return true;
}

/**
 * Skontroluje či je číslo platné v 3x3 boxe
 * @param {number[][]} grid - Sudoku mriežka
 * @param {number} row - Riadok
 * @param {number} col - Stĺpec
 * @param {number} num - Číslo na kontrolu
 * @returns {boolean}
 */
function isValidBox(grid, row, col, num) {
    // Nájdi začiatok 3x3 boxu
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            // Preskočí aktuálnu pozíciu
            if (i === row && j === col) continue;
            
            if (grid[i][j] === num) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Skontroluje či je ťah platný (riadok + stĺpec + box)
 * @param {number[][]} grid - Sudoku mriežka
 * @param {number} row - Riadok
 * @param {number} col - Stĺpec
 * @param {number} num - Číslo na kontrolu
 * @returns {boolean}
 */
function isValidMove(grid, row, col, num) {
    return isValidRow(grid, row, num, col) &&
           isValidCol(grid, col, num, row) &&
           isValidBox(grid, row, col, num);
}

/**
 * Nájde prvé prázdne políčko v mriežke
 * @param {number[][]} grid - Sudoku mriežka
 * @returns {object|null} - {row, col} alebo null ak nie je prázdne
 */
function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return { row, col };
            }
        }
    }
    return null;
}

/**
 * Vyrieši Sudoku pomocou backtracking algoritmu
 * @param {number[][]} grid - Sudoku mriežka (modifikuje sa)
 * @returns {boolean} - true ak sa podarilo vyriešiť
 */
function solveSudoku(grid) {
    // Nájdi prázdne políčko
    const empty = findEmptyCell(grid);
    
    // Ak nie je prázdne políčko, sudoku je vyriešené!
    if (!empty) {
        return true;
    }
    
    const { row, col } = empty;
    
    // Skús čísla 1-9
    for (let num = 1; num <= 9; num++) {
        // Skontroluj či je číslo platné
        if (isValidMove(grid, row, col, num)) {
            // Vlož číslo
            grid[row][col] = num;
            
            // Rekurzívne pokračuj
            if (solveSudoku(grid)) {
                return true;
            }
            
            // Ak sa nepodarilo, backtrack (vráť späť)
            grid[row][col] = 0;
        }
    }
    
    // Žiadne číslo nefungovalo - backtrack
    return false;
}

/**
 * Vytvorí kópiu 2D poľa
 * @param {number[][]} grid - Pôvodné pole
 * @returns {number[][]} - Kópia
 */
function copyGrid(grid) {
    return grid.map(row => [...row]);
}

/**
 * Spočíta počet riešení (pre overenie unikátnosti)
 * @param {number[][]} grid - Sudoku mriežka
 * @param {number} limit - Maximum riešení na hľadanie
 * @returns {number} - Počet riešení
 */
function countSolutions(grid, limit = 2) {
    const empty = findEmptyCell(grid);
    
    if (!empty) {
        return 1;
    }
    
    const { row, col } = empty;
    let count = 0;
    
    for (let num = 1; num <= 9 && count < limit; num++) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            count += countSolutions(grid, limit - count);
            grid[row][col] = 0;
        }
    }
    
    return count;
}

console.log('Solver načítaný');

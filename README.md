# 🎮 Sudoku pre Babku

Webová hra Sudoku - môj učebný projekt.

---

## 📦 1. ENVIRONMENT SETUP

### Potrebuješ:
- [x] VS Code (už máš)
- [ ] Node.js (pre lokálny server) - https://nodejs.org/
- [ ] Live Server extension vo VS Code

### Inštalácia:

```bash
# 1. Nainštaluj Node.js (ak nemáš)
sudo apt install nodejs npm

# 2. Over inštaláciu
node --version
npm --version
```

### VS Code Extensions:
1. Otvor VS Code
2. Ctrl+Shift+X (Extensions)
3. Nainštaluj:
   - **Live Server** - spustí lokálny server
   - **Prettier** - formátovanie kódu
   - **JavaScript (ES6) code snippets** - pomôcky

---

## 📁 2. ŠTRUKTÚRA PROJEKTU

Vytvor tieto súbory:

```
Sudoka/
├── index.html      # Hlavná HTML stránka
├── css/
│   └── style.css   # Všetky štýly
├── js/
│   ├── main.js     # Hlavný súbor - spúšťa hru
│   ├── grid.js     # Vykreslenie mriežky
│   ├── generator.js # Generovanie Sudoku
│   ├── solver.js   # Riešenie (backtracking)
│   └── storage.js  # Ukladanie do localStorage
└── README.md
```

---

## ✅ 3. CHECKLIST ÚLOH

### Fáza 1: HTML Základy (1-2 dni)
- [ ] Nauč sa HTML basics (tagy, atribúty, štruktúra)
- [ ] Vytvor `index.html` s základnou štruktúrou
- [ ] Pridaj `<div>` pre hraciu plochu
- [ ] Pridaj tlačidlá (Nová hra, Skontrolovať, Obťažnosť)
- [ ] Pridaj timer display

**Zdroje:**
- https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML

### Fáza 2: CSS Štýlovanie (2-3 dni)
- [ ] Nauč sa CSS basics (selektory, box model, flexbox/grid)
- [ ] Vytvor `css/style.css`
- [ ] Nastýluj mriežku 9x9 s CSS Grid
- [ ] Oddeľ 3x3 bloky hrubšími čiarami
- [ ] Štýluj tlačidlá
- [ ] Pridaj hover efekty
- [ ] Sprav responzívny dizajn (mobile-friendly)
- [ ] Použi veľké písmo (pre babku!)

**Zdroje:**
- https://developer.mozilla.org/en-US/docs/Learn/CSS
- https://css-tricks.com/snippets/css/complete-guide-grid/

### Fáza 3: JavaScript Základy (1-2 týždne)
- [ ] Nauč sa JS basics (premenné, funkcie, podmienky, cykly)
- [ ] Nauč sa pracovať s DOM (document.querySelector, addEventListener)
- [ ] Nauč sa polia a objekty
- [ ] Vytvor `js/main.js` - základný event handling

**Zdroje:**
- https://javascript.info/ (najlepší zdroj!)
- Kapitoly 1-6 sú povinné

### Fáza 4: Vykreslenie Mriežky (2-3 dni)
- [ ] Vytvor `js/grid.js`
- [ ] Funkcia `createGrid()` - vytvorí 81 políčok v DOM
- [ ] Funkcia `renderGrid(puzzle)` - vyplní čísla
- [ ] Rozlíš fixné políčka (zadané) vs. editovateľné
- [ ] Kliknutie na políčko ho zvýrazní
- [ ] Číslovník (1-9) na zadávanie čísel

### Fáza 5: Validácia (2-3 dni)
- [ ] Vytvor validačné funkcie:
  - [ ] `isValidRow(grid, row, num)` - číslo v riadku
  - [ ] `isValidCol(grid, col, num)` - číslo v stĺpci  
  - [ ] `isValidBox(grid, row, col, num)` - číslo v 3x3 boxe
  - [ ] `isValidMove(grid, row, col, num)` - kombinácia všetkých
- [ ] Zvýrazni neplatné ťahy červenou
- [ ] Zvýrazni konflikty v riadku/stĺpci/boxe

### Fáza 6: Generátor Sudoku (3-5 dní)
- [ ] Vytvor `js/generator.js`
- [ ] Funkcia `generateSolution()` - vytvorí vyriešené Sudoku
- [ ] Funkcia `removeNumbers(solution, difficulty)` - odstráni čísla
- [ ] 3 obťažnosti: Ľahká (35), Stredná (45), Ťažká (55) prázdnych
- [ ] Over že puzzle má jediné riešenie

### Fáza 7: Solver - Backtracking (2-3 dni)
- [ ] Vytvor `js/solver.js`
- [ ] Funkcia `solveSudoku(grid)` - rekurzívny backtracking
- [ ] Funkcia `findEmptyCell(grid)` - nájdi prázdne políčko
- [ ] Tlačidlo "Ukáž riešenie"

### Fáza 8: Herné Funkcie (2-3 dni)
- [ ] Timer - počítaj čas hry
- [ ] Detekcia výhry - gratulačná správa
- [ ] Tlačidlo "Skontrolovať" - ukáž chyby
- [ ] Tlačidlo "Hint" - ukáž jedno správne číslo

### Fáza 9: Ukladanie (1-2 dni)
- [ ] Vytvor `js/storage.js`
- [ ] `saveGame()` - ulož do localStorage
- [ ] `loadGame()` - načítaj uloženú hru
- [ ] Auto-save pri každom ťahu
- [ ] Ulož najlepšie časy

### Fáza 10: Polish (2-3 dni)
- [ ] Pridaj zvuky (voliteľné)
- [ ] Animácie (CSS transitions)
- [ ] Tmavý/svetlý režim
- [ ] Testuj na mobile
- [ ] Testuj s babkou! 👵

### Fáza 11: Deploy (1 deň)
- [ ] Vytvor GitHub repozitár
- [ ] Nahraj kód
- [ ] Zapni GitHub Pages (Settings → Pages)
- [ ] Pošli link babke! 🎉

---

## 🧠 4. ALGORITMY KTORÉ SA NAUČÍŠ

### Backtracking (riešenie Sudoku)
```
1. Nájdi prázdne políčko
2. Skús čísla 1-9
3. Ak je číslo platné, vlož ho a pokračuj rekurzívne
4. Ak sa dostaneš do slepej uličky, vráť sa (backtrack)
5. Ak nie je prázdne políčko, Sudoku je vyriešené
```

### Validácia
```
Pre každé číslo skontroluj:
- Nie je v tom istom riadku
- Nie je v tom istom stĺpci
- Nie je v tom istom 3x3 boxe
```

---

## 🚀 5. AKO ZAČAŤ

```bash
# 1. Otvor priečinok vo VS Code
cd /home/sams/personal/Sudoka
code .

# 2. Vytvor základné súbory
touch index.html
mkdir css js
touch css/style.css
touch js/main.js

# 3. Spusti Live Server
# Klikni pravým na index.html → "Open with Live Server"
```

---

## 📖 6. ODPORÚČANÉ TUTORIÁLY

1. **HTML/CSS za 1 hodinu:** https://www.youtube.com/watch?v=G3e-cpL7ofc
2. **JavaScript za 1 hodinu:** https://www.youtube.com/watch?v=W6NZfCO5SIk
3. **JavaScript.info (detailne):** https://javascript.info/
4. **CSS Grid:** https://css-tricks.com/snippets/css/complete-guide-grid/

---

## 💡 7. TIPY

1. **Commit často** - po každej funkcii urob git commit
2. **Testuj priebežne** - po každej zmene pozri výsledok
3. **Používaj console.log()** - na debugovanie
4. **Google je kamarát** - keď nevieš, hľadaj
5. **Neponáhľaj sa** - lepšie pochopiť než rýchlo nakopírovať

---

## 📅 8. ČASOVÝ ODHAD

| Fáza | Čas |
|------|-----|
| HTML/CSS základy | 1 týždeň |
| JavaScript základy | 1-2 týždne |
| Sudoku implementácia | 2-3 týždne |
| **Celkovo** | **4-6 týždňov** |

---

Veľa šťastia! Keď budeš mať otázky, pýtaj sa. 🎯

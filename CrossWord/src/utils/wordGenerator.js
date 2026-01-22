// 8 directions: horizontal, vertical, and 4 diagonals (both forward and backward)
const DIRECTIONS = [
  { dx: 0, dy: 1 },   // Horizontal right
  { dx: 0, dy: -1 },  // Horizontal left
  { dx: 1, dy: 0 },   // Vertical down
  { dx: -1, dy: 0 },  // Vertical up
  { dx: 1, dy: 1 },   // Diagonal down-right
  { dx: -1, dy: -1 }, // Diagonal up-left
  { dx: 1, dy: -1 },  // Diagonal down-left
  { dx: -1, dy: 1 }   // Diagonal up-right
];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Check if word can be placed at given position in given direction
 */
const canPlaceWord = (grid, word, row, col, direction, gridSize) => {
  const { dx, dy } = direction;
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dx;
    const newCol = col + i * dy;
    
    // Check bounds
    if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
      return false;
    }
    
    // Check if cell is empty or has the same letter
    const currentCell = grid[newRow][newCol];
    if (currentCell !== '' && currentCell !== word[i]) {
      return false;
    }
  }
  
  return true;
};

/**
 * Place word in grid at given position and direction
 */
const placeWord = (grid, word, row, col, direction) => {
  const { dx, dy } = direction;
  const positions = [];
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dx;
    const newCol = col + i * dy;
    grid[newRow][newCol] = word[i];
    positions.push({ row: newRow, col: newCol });
  }
  
  return positions;
};

/**
 * Try to place a word randomly in the grid
 */
const tryPlaceWord = (grid, word, gridSize, maxAttempts = 100) => {
  const wordUpper = word.toUpperCase();
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Random starting position
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    
    // Random direction
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    
    if (canPlaceWord(grid, wordUpper, row, col, direction, gridSize)) {
      const positions = placeWord(grid, wordUpper, row, col, direction);
      return {
        word: word,
        wordUpper: wordUpper,
        positions: positions,
        startRow: row,
        startCol: col,
        direction: direction
      };
    }
  }
  
  return null;
};

/**
 * Fill empty cells with random letters
 */
const fillEmptyCells = (grid, gridSize) => {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)].toUpperCase();
      }
    }
  }
};

/**
 * Generate a word search puzzle
 * @param {Array<string>} words - Array of words to place
 * @param {number} gridSize - Size of the grid (gridSize x gridSize)
 * @returns {Object} - Generated grid and word placement info
 */
export const generateWordSearchGrid = (words, gridSize) => {
  // Initialize empty grid
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  
  const placedWords = [];
  const unplacedWords = [];
  
  // Sort words by length (longer words first for better placement)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  // Try to place each word
  for (const word of sortedWords) {
    const placement = tryPlaceWord(grid, word, gridSize);
    
    if (placement) {
      placedWords.push(placement);
    } else {
      unplacedWords.push(word);
    }
  }
  
  // Fill remaining empty cells with random letters
  fillEmptyCells(grid, gridSize);
  
  return {
    grid,
    placedWords,
    unplacedWords,
    gridSize
  };
};

/**
 * Validate if selected cells form a valid word
 * @param {Array<Object>} selectedCells - Array of {row, col} objects
 * @param {Array<Object>} placedWords - Array of placed word objects
 * @returns {Object|null} - Found word object or null
 */
export const validateWordSelection = (selectedCells, placedWords) => {
  if (selectedCells.length < 2) return null;
  
  // Create a string key for the selection for easy comparison
  const createKey = (cells) => {
    return cells.map(c => `${c.row},${c.col}`).join('|');
  };
  
  const selectionKey = createKey(selectedCells);
  const reverseSelectionKey = createKey([...selectedCells].reverse());
  
  // Check against all placed words
  for (const wordObj of placedWords) {
    const wordKey = createKey(wordObj.positions);
    
    if (selectionKey === wordKey || reverseSelectionKey === wordKey) {
      return wordObj;
    }
  }
  
  return null;
};

/**
 * Get letter from grid at position
 */
export const getLetterAt = (grid, row, col) => {
  if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
    return grid[row][col];
  }
  return '';
};

/**
 * Check if two cells are adjacent or in a line (for drag selection)
 */
export const areCellsInLine = (cell1, cell2) => {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  
  // Same row, column, or diagonal
  return rowDiff === colDiff || rowDiff === 0 || colDiff === 0;
};

/**
 * Get all cells between two points (for drag selection)
 */
export const getCellsBetween = (startCell, endCell) => {
  const cells = [];
  
  const rowDiff = endCell.row - startCell.row;
  const colDiff = endCell.col - startCell.col;
  
  // Determine direction
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
  
  if (steps === 0) {
    return [startCell];
  }
  
  const rowStep = rowDiff === 0 ? 0 : rowDiff / steps;
  const colStep = colDiff === 0 ? 0 : colDiff / steps;
  
  for (let i = 0; i <= steps; i++) {
    cells.push({
      row: Math.round(startCell.row + i * rowStep),
      col: Math.round(startCell.col + i * colStep)
    });
  }
  
  return cells;
};

class GridGenerator {
  generateGrid(size, words) {
    // Combine all words into a single string
    const allLetters = words.join('').toUpperCase().split('');
    this.shuffleArray(allLetters);
    // Flatten grid as 1D array of tiles
    const totalCells = size * size;
    const gridArray = [];

    for (let i = 0; i < totalCells; i++) {
      if (i < allLetters.length) {
        gridArray.push(allLetters[i]);
      } else {
        gridArray.push(''); // empty if word letters are finished
      }
    }

    // Convert to 2D grid
    const grid = [];
    for (let i = 0; i < size; i++) {
      grid.push(gridArray.slice(i * size, (i + 1) * size));
    }

    return grid;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

export default new GridGenerator();

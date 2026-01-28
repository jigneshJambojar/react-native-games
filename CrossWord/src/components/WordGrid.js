import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { validateWordSelection } from '../utils/wordGenerator';

const { width } = Dimensions.get('window');
const GRID_PADDING = 25;

const GridCell = ({ letter, isSelected, isFound, cellSize, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { width: cellSize, height: cellSize },
        isFound && styles.cellFound,
        isSelected && !isFound && styles.cellSelected,
        isSelected && isFound && styles.cellSelectedAndFound
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.cellText, isFound && styles.cellTextFound]}>
        {letter}
      </Text>
    </TouchableOpacity>
  );
};

const WordGrid = ({ onHeight }) => {
  const { gameState, markWordAsFound, isWordFound } = useGame();
  const { grid, gridSize, placedWords } = gameState;

  const [selectedCells, setSelectedCells] = useState([]);

  const cellSize = useMemo(() => {
    if (gridSize === 0) return 0;
    return (width - GRID_PADDING * 2) / gridSize;
  }, [gridSize]);

  // Check if two cells are adjacent (8 directions)
  const isAdjacent = (cell1, cell2) => {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    // Adjacent means max 1 step in any direction
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0);
  };

  // Check if new cell continues in the same direction
  const isSameDirection = (cell1, cell2, cell3) => {
    const dx1 = cell2.row - cell1.row;
    const dy1 = cell2.col - cell1.col;
    const dx2 = cell3.row - cell2.row;
    const dy2 = cell3.col - cell2.col;
    // Direction must match exactly
    return dx1 === dx2 && dy1 === dy2;
  };

  const handleCellPress = (row, col) => {
    const newCell = { row, col };

    // ALLOW selection through found cells (removed block)
    // This allows selecting overlapping words

    // If no cells selected, start new selection
    if (selectedCells.length === 0) {
      setSelectedCells([newCell]);
      return;
    }

    const lastCell = selectedCells[selectedCells.length - 1];

    // Check if clicking the same cell (deselect)
    if (lastCell.row === row && lastCell.col === col) {
      if (selectedCells.length === 1) {
        setSelectedCells([]);
      } else {
        setSelectedCells(selectedCells.slice(0, -1));
      }
      return;
    }

    // Check if cell is already in selection (allow backtracking)
    const cellIndex = selectedCells.findIndex(c => c.row === row && c.col === col);
    if (cellIndex !== -1 && cellIndex < selectedCells.length - 1) {
      setSelectedCells(selectedCells.slice(0, cellIndex + 1));
      return;
    }

    // Check if new cell is adjacent to last cell
    if (!isAdjacent(lastCell, newCell)) {
      // Not adjacent - reset and start new selection
      setSelectedCells([newCell]);
      return;
    }

    // If we have 2+ cells, check direction consistency
    if (selectedCells.length >= 2) {
      const secondLast = selectedCells[selectedCells.length - 2];
      if (!isSameDirection(secondLast, lastCell, newCell)) {
        // Direction changed - reset and start new selection
        setSelectedCells([newCell]);
        return;
      }
    }

    // Add cell to selection
    const newSelection = [...selectedCells, newCell];
    setSelectedCells(newSelection);

    // Validate if we have at least 2 cells
    if (newSelection.length >= 2) {
      const foundWord = validateWordSelection(newSelection, placedWords);

      if (foundWord && !isWordFound(foundWord.word)) {
        // Valid word found!
        markWordAsFound(foundWord.word);
        setSelectedCells([]);
      }
    }
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellFound = (row, col) => {
    return placedWords.some(wordObj => {
      if (!isWordFound(wordObj.word)) return false;
      return wordObj.positions.some(pos => pos.row === row && pos.col === col);
    });
  };

  if (!grid || grid.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No game loaded</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={(e) => onHeight(e.nativeEvent.layout.height)}>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((letter, colIndex) => (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                letter={letter}
                isSelected={isCellSelected(rowIndex, colIndex)}
                isFound={isCellFound(rowIndex, colIndex)}
                cellSize={cellSize}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: GRID_PADDING,
    position: 'relative',
    paddingTop: 15
  },
  grid: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  row: {
    flexDirection: 'row'
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    margin: 1,
    borderRadius: 4
  },
  cellSelected: {
    backgroundColor: '#ffc107'
  },
  cellFound: {
    backgroundColor: '#4caf50'
  },
  cellSelectedAndFound: {
    backgroundColor: '#ff9800', // Orange to show selection over found
    borderWidth: 2,
    borderColor: '#ffc107'
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  cellTextFound: {
    color: '#fff'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: '#999'
  }
});

export default WordGrid;

import { Pressable, StyleSheet } from 'react-native';
import { COORDINATES_MAP } from '../engine/constants';

const GRID_SIZE = 15;

export function PlayerPiece({
  position,
  color,
  highlighted,
  onPress,
  boardSize,
}) {
  const [gridX, gridY] = COORDINATES_MAP[position];

  const tileSize = boardSize / GRID_SIZE;
  const pieceSize = tileSize * 0.6;

  const left = gridX * tileSize + tileSize / 2;
  const top = gridY * tileSize + tileSize / 2;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.piece,
        {
          width: pieceSize,
          height: pieceSize,
          left,
          top,
          backgroundColor: color,
          borderStyle: highlighted ? 'dashed' : 'solid',
          transform: [
            { translateX: -pieceSize / 2 },
            { translateY: -pieceSize / 2 },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 999,
    zIndex: 10,
  },
});

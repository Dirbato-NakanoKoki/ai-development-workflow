import type { Tetromino, GameField, TetrominoType, Position } from '@/app/types/tetris';
import { TETROMINO_SHAPES, TETROMINO_COLORS, FIELD_WIDTH, FIELD_HEIGHT } from '@/app/constants/tetrominos';

export function createEmptyField(): GameField {
  return Array.from({ length: FIELD_HEIGHT }, () =>
    Array.from({ length: FIELD_WIDTH }, () => null)
  );
}

export function createRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    type,
    shape: TETROMINO_SHAPES[type],
    color: TETROMINO_COLORS[type],
    position: {
      x: Math.floor(FIELD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[type][0].length / 2),
      y: 0,
    },
  };
}

export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const n = tetromino.shape.length;
  const rotated: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = tetromino.shape[i][j];
    }
  }

  return {
    ...tetromino,
    shape: rotated,
  };
}

export function checkCollision(
  tetromino: Tetromino,
  field: GameField,
  offset: Position = { x: 0, y: 0 }
): boolean {
  const { shape, position } = tetromino;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x + offset.x;
        const newY = position.y + y + offset.y;

        // Check boundaries
        if (newX < 0 || newX >= FIELD_WIDTH || newY >= FIELD_HEIGHT) {
          return true;
        }

        // Check collision with existing blocks
        if (newY >= 0 && field[newY][newX]) {
          return true;
        }
      }
    }
  }

  return false;
}

export function mergePieceToField(tetromino: Tetromino, field: GameField): GameField {
  const newField = field.map(row => [...row]);
  const { shape, position, color } = tetromino;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const fieldY = position.y + y;
        const fieldX = position.x + x;

        if (fieldY >= 0 && fieldY < FIELD_HEIGHT && fieldX >= 0 && fieldX < FIELD_WIDTH) {
          newField[fieldY][fieldX] = {
            filled: true,
            color,
          };
        }
      }
    }
  }

  return newField;
}

export function clearLines(field: GameField): { newField: GameField; linesCleared: number } {
  let linesCleared = 0;
  const newField: GameField = [];

  // Check each row from bottom to top
  for (let y = FIELD_HEIGHT - 1; y >= 0; y--) {
    const isLineFull = field[y].every(cell => cell !== null);

    if (isLineFull) {
      linesCleared++;
    } else {
      newField.unshift(field[y]);
    }
  }

  // Add empty rows at the top
  while (newField.length < FIELD_HEIGHT) {
    newField.unshift(Array.from({ length: FIELD_WIDTH }, () => null));
  }

  return { newField, linesCleared };
}

export function calculateScore(linesCleared: number): number {
  const scores = [0, 100, 300, 500, 800];
  return scores[Math.min(linesCleared, scores.length - 1)];
}

export function isGameOver(tetromino: Tetromino, field: GameField): boolean {
  return checkCollision(tetromino, field);
}

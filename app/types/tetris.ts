export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
  position: Position;
}

export type Cell = {
  filled: boolean;
  color: string;
} | null;

export type GameField = Cell[][];

export interface GameState {
  field: GameField;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

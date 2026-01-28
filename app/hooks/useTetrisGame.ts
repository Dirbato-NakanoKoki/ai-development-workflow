import { useState, useCallback } from 'react';

import type { GameState, Tetromino, GameField } from '@/app/types/tetris';
import {
  createEmptyField,
  createRandomTetromino,
  rotateTetromino,
  checkCollision,
  mergePieceToField,
  clearLines,
  calculateScore,
  isGameOver,
} from '@/app/utils/tetrisLogic';

export function useTetrisGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const firstPiece = createRandomTetromino();
    const secondPiece = createRandomTetromino();

    return {
      field: createEmptyField(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      isGameOver: false,
      isPaused: false,
    };
  });

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      const newPiece: Tetromino = {
        ...prev.currentPiece,
        position: {
          ...prev.currentPiece.position,
          x: prev.currentPiece.position.x - 1,
        },
      };

      if (checkCollision(newPiece, prev.field)) {
        return prev;
      }

      return {
        ...prev,
        currentPiece: newPiece,
      };
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      const newPiece: Tetromino = {
        ...prev.currentPiece,
        position: {
          ...prev.currentPiece.position,
          x: prev.currentPiece.position.x + 1,
        },
      };

      if (checkCollision(newPiece, prev.field)) {
        return prev;
      }

      return {
        ...prev,
        currentPiece: newPiece,
      };
    });
  }, []);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      const newPiece: Tetromino = {
        ...prev.currentPiece,
        position: {
          ...prev.currentPiece.position,
          y: prev.currentPiece.position.y + 1,
        },
      };

      // If collision, lock the piece
      if (checkCollision(newPiece, prev.field)) {
        const mergedField = mergePieceToField(prev.currentPiece, prev.field);
        const { newField, linesCleared } = clearLines(mergedField);
        const newScore = prev.score + calculateScore(linesCleared);
        const nextCurrentPiece = prev.nextPiece;
        const nextNextPiece = createRandomTetromino();

        // Check game over
        if (nextCurrentPiece && isGameOver(nextCurrentPiece, newField)) {
          return {
            ...prev,
            field: mergedField,
            isGameOver: true,
          };
        }

        return {
          ...prev,
          field: newField,
          currentPiece: nextCurrentPiece,
          nextPiece: nextNextPiece,
          score: newScore,
        };
      }

      return {
        ...prev,
        currentPiece: newPiece,
      };
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      const rotatedPiece = rotateTetromino(prev.currentPiece);

      // Try basic rotation
      if (!checkCollision(rotatedPiece, prev.field)) {
        return {
          ...prev,
          currentPiece: rotatedPiece,
        };
      }

      // Try wall kick (move left)
      const kickLeft: Tetromino = {
        ...rotatedPiece,
        position: {
          ...rotatedPiece.position,
          x: rotatedPiece.position.x - 1,
        },
      };
      if (!checkCollision(kickLeft, prev.field)) {
        return {
          ...prev,
          currentPiece: kickLeft,
        };
      }

      // Try wall kick (move right)
      const kickRight: Tetromino = {
        ...rotatedPiece,
        position: {
          ...rotatedPiece.position,
          x: rotatedPiece.position.x + 1,
        },
      };
      if (!checkCollision(kickRight, prev.field)) {
        return {
          ...prev,
          currentPiece: kickRight,
        };
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      let dropPiece = prev.currentPiece;

      // Drop until collision
      while (true) {
        const testPiece: Tetromino = {
          ...dropPiece,
          position: {
            ...dropPiece.position,
            y: dropPiece.position.y + 1,
          },
        };

        if (checkCollision(testPiece, prev.field)) {
          break;
        }

        dropPiece = testPiece;
      }

      // Lock the piece
      const mergedField = mergePieceToField(dropPiece, prev.field);
      const { newField, linesCleared } = clearLines(mergedField);
      const newScore = prev.score + calculateScore(linesCleared);
      const nextCurrentPiece = prev.nextPiece;
      const nextNextPiece = createRandomTetromino();

      // Check game over
      if (nextCurrentPiece && isGameOver(nextCurrentPiece, newField)) {
        return {
          ...prev,
          field: mergedField,
          isGameOver: true,
        };
      }

      return {
        ...prev,
        field: newField,
        currentPiece: nextCurrentPiece,
        nextPiece: nextNextPiece,
        score: newScore,
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    const firstPiece = createRandomTetromino();
    const secondPiece = createRandomTetromino();

    setGameState({
      field: createEmptyField(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  return {
    gameState,
    actions: {
      moveLeft,
      moveRight,
      moveDown,
      rotate,
      hardDrop,
      togglePause,
      resetGame,
    },
  };
}

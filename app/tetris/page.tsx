'use client';

import { useMemo } from 'react';

import { useTetrisGame } from '@/app/hooks/useTetrisGame';
import { useKeyboard } from '@/app/hooks/useKeyboard';
import { useGameLoop } from '@/app/hooks/useGameLoop';
import { mergePieceToField } from '@/app/utils/tetrisLogic';
import type { GameField } from '@/app/types/tetris';

export default function TetrisPage() {
  const { gameState, actions } = useTetrisGame();

  // Keyboard controls
  useKeyboard(
    {
      onLeft: actions.moveLeft,
      onRight: actions.moveRight,
      onDown: actions.moveDown,
      onRotate: actions.rotate,
      onHardDrop: actions.hardDrop,
      onPause: actions.togglePause,
    },
    !gameState.isGameOver
  );

  // Game loop
  useGameLoop(actions.moveDown, !gameState.isGameOver && !gameState.isPaused);

  // Render field with current piece
  const displayField: GameField = useMemo(() => {
    if (!gameState.currentPiece) return gameState.field;
    return mergePieceToField(gameState.currentPiece, gameState.field);
  }, [gameState.field, gameState.currentPiece]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎮 Tetris
        </h1>

        <div className="flex gap-8 items-start justify-center">
          {/* Main game field */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-6">
            <div
              className="grid gap-[1px] bg-slate-900 p-1 rounded-lg"
              style={{
                gridTemplateColumns: `repeat(10, 1fr)`,
              }}
            >
              {displayField.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="w-7 h-7 rounded-sm border border-slate-700"
                    style={{
                      backgroundColor: cell?.color || '#1e293b',
                    }}
                  />
                ))
              )}
            </div>

            {/* Game over overlay */}
            {gameState.isGameOver && (
              <div className="mt-6 bg-red-600 text-white p-4 rounded-lg text-center">
                <p className="font-bold text-xl mb-2">Game Over!</p>
                <button
                  onClick={actions.resetGame}
                  className="px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Pause overlay */}
            {gameState.isPaused && !gameState.isGameOver && (
              <div className="mt-6 bg-blue-600 text-white p-4 rounded-lg text-center">
                <p className="font-bold text-xl">Paused</p>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-white text-xl font-bold mb-2">Score</h2>
              <p className="text-4xl font-bold text-blue-400">{gameState.score}</p>
            </div>

            {/* Next piece */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Next</h2>
              {gameState.nextPiece && (
                <div
                  className="grid gap-[1px] bg-slate-900 p-2 rounded-lg"
                  style={{
                    gridTemplateColumns: `repeat(${gameState.nextPiece.shape[0].length}, 1fr)`,
                  }}
                >
                  {gameState.nextPiece.shape.map((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`next-${x}-${y}`}
                        className="w-6 h-6 rounded-sm"
                        style={{
                          backgroundColor: cell
                            ? gameState.nextPiece?.color
                            : 'transparent',
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Controls</h2>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Move:</span>
                  <span className="text-white font-mono">← →</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotate:</span>
                  <span className="text-white font-mono">↑</span>
                </div>
                <div className="flex justify-between">
                  <span>Soft Drop:</span>
                  <span className="text-white font-mono">↓</span>
                </div>
                <div className="flex justify-between">
                  <span>Hard Drop:</span>
                  <span className="text-white font-mono">Space</span>
                </div>
                <div className="flex justify-between">
                  <span>Pause:</span>
                  <span className="text-white font-mono">P</span>
                </div>
              </div>

              <button
                onClick={actions.resetGame}
                className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

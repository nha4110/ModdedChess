'use client';

import { useEffect, useState } from 'react';
import { Chess, ChessInstance, ShortMove } from 'chess.js';
import _ from 'lodash';

// Define types for chess moves and evaluations
interface EvaluatedMove {
  move: ShortMove;
  score: number;
}

// Chess Bot Page Component
export default function ChessBot() {
  const [game, setGame] = useState<ChessInstance | null>(null);
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("White's turn");
  const [thinking, setThinking] = useState<boolean>(false);

  // Initialize the chess game
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    updateBoard(newGame);
  }, []);

  // Update the board state from the chess.js instance
  const updateBoard = (game: ChessInstance) => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(''));
    const position = game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = position[i][j];
        if (piece) {
          newBoard[i][j] = `${piece.color}${piece.type}`;
        }
      }
    }

    setBoard(newBoard);

    // Update game status
    if (game.in_checkmate()) {
      setStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (game.in_draw()) {
      setStatus('Draw!');
    } else if (game.in_check()) {
      setStatus(`Check! ${game.turn() === 'w' ? 'White' : 'Black'} to move`);
    } else {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    }
  };

  // Make the bot move
  const makeBotMove = async () => {
    if (!game || game.game_over()) return;

    setThinking(true);

    setTimeout(() => {
      try {
        // Get all legal moves
        const moves = game.moves({ verbose: true }) as ShortMove[];

        if (moves.length > 0) {
          // Evaluate moves
          const evaluatedMoves = moves.map((move: ShortMove) => {
            const testGame = new Chess(game.fen());
            try {
              testGame.move({
                from: move.from,
                to: move.to,
                promotion: move.promotion,
              } as ShortMove);
            } catch (error) {
              console.warn(`Invalid move attempted: ${move.from}-${move.to}`, error);
              return { move, score: -Infinity } as EvaluatedMove;
            }

            const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
            let score = 0;

            // Material count
            const board = testGame.board();
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                  const value = pieceValues[piece.type];
                  score += piece.color === 'b' ? value : -value;
                }
              }
            }

            // Bonus for captures
            if ('captured' in move && move.captured) {
              const capturedPiece = move.captured as keyof typeof pieceValues;
              score += pieceValues[capturedPiece] || 0;
            }

            // Bonus for checks
            if (testGame.in_check()) {
              score += 0.5;
            }

            // Bonus for controlling center
            const centerSquares = ['d4', 'd5', 'e4', 'e5'];
            if (centerSquares.includes(move.to)) {
              score += 0.3;
            }

            // Randomness
            score += Math.random() * 0.2 - 0.1;

            return { move, score } as EvaluatedMove;
          });

          // Sort moves by score (best for black)
          evaluatedMoves.sort((a: EvaluatedMove, b: EvaluatedMove) => b.score - a.score);
          const bestMove = evaluatedMoves[0].move;

          // Make the move
          game.move({
            from: bestMove.from,
            to: bestMove.to,
            promotion: bestMove.promotion,
          } as ShortMove);
          updateBoard(game);
        }
      } catch (error) {
        console.error('Error making bot move:', error);
      }

      setThinking(false);
    }, 500);
  };

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (!game || game.game_over() || thinking) return;

    // Only allow white moves (player)
    if (game.turn() !== 'w') return;

    const files = 'abcdefgh';
    const clickedSquare = `${files[col]}${8 - row}`;

    // If a square is already selected, try to make a move
    if (selectedSquare) {
      const move = {
        from: selectedSquare,
        to: clickedSquare,
        promotion: 'q', // Default promotion to queen
      };

      try {
        const result = game.move(move as ShortMove);

        if (result) {
          // Move was successful
          updateBoard(game);
          setSelectedSquare(null);
          setPossibleMoves([]);

          // Make bot move after a short delay
          if (!game.game_over()) {
            setTimeout(makeBotMove, 300);
          }
          return;
        }
      } catch (e) {
        // Invalid move, continue to check if this is a new selection
      }
    }

    // Check if clicked on own piece (white)
    const piece = game.board()[row][col];
    if (piece && piece.color === 'w') {
      setSelectedSquare(clickedSquare);

      // Highlight possible moves
      try {
        const moves = game.moves({
          square: clickedSquare,
          verbose: true,
        }) as ShortMove[];
        setPossibleMoves(moves.map((move) => move.to));
      } catch (e) {
        setPossibleMoves([]);
      }
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // Render a chess square
  const renderSquare = (row: number, col: number) => {
    const isBlackSquare = (row + col) % 2 === 1;
    const files = 'abcdefgh';
    const squareId = `${files[col]}${8 - row}`;
    const piece = board[row] && board[row][col];

    const isSelected = selectedSquare === squareId;
    const isPossibleMove = possibleMoves.includes(squareId);

    // Map piece codes to Unicode chess symbols
    const pieceSymbols: Record<string, string> = {
      wp: '♙',
      wr: '♖',
      wn: '♘',
      wb: '♗',
      wq: '♕',
      wk: '♔',
      bp: '♟',
      br: '♜',
      bn: '♞',
      bb: '♝',
      bq: '♛',
      bk: '♚',
    };

    return (
      <div
        key={`${row}-${col}`}
        className={`w-12 h-12 flex items-center justify-center text-4xl
                   ${isBlackSquare ? 'bg-gray-600' : 'bg-gray-200'}
                   ${isSelected ? 'bg-yellow-300' : ''}
                   ${isPossibleMove ? (isBlackSquare ? 'bg-green-700' : 'bg-green-400') : ''}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && pieceSymbols[piece]}
        {isPossibleMove && !piece && <div className="w-3 h-3 rounded-full bg-gray-500 opacity-70"></div>}
      </div>
    );
  };

  // Restart the game
  const restartGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    updateBoard(newGame);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Chess Bot</h1>

      <div className="mb-4 text-lg font-medium">
        {status}
        {thinking && ' (Bot is thinking...)'}
      </div>

      <div className="border-4 border-gray-800 shadow-lg">
        {Array(8)
          .fill(null)
          .map((_, row) => (
            <div key={row} className="flex">
              {Array(8)
                .fill(null)
                .map((_, col) => renderSquare(row, col))}
            </div>
          ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={restartGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>

      <div className="mt-6 max-w-md text-gray-700">
        <h2 className="text-xl font-semibold mb-2">How to Play</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>You play as White</li>
          <li>Click on a piece to select it</li>
          <li>Click on a highlighted square to move</li>
          <li>The chess bot will respond with its move</li>
        </ul>
      </div>
    </div>
  );
}
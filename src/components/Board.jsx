import { memo, useCallback } from 'react';
import { Square } from './Square.jsx';
import { calculateWinner } from '../game/logic.js';

export const Board = memo(function Board({ xIsNext, squares, onPlay, disabled })
{
  const handleClick = useCallback(function handleClick(i)
  {
    if (disabled || calculateWinner(squares) || squares[i])
        {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext)
        {
      nextSquares[i] = 'X';
    } else
        {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }, [disabled, squares, xIsNext, onPlay]);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((cell) => cell !== null);
  let status;
  if (winner)
    {
    status = 'Winner: ' + winner;
  } else if (isDraw)
    {
    status = 'Draw!';
  } else
    {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} index={0} onSquareClick={handleClick} />
        <Square value={squares[1]} index={1} onSquareClick={handleClick} />
        <Square value={squares[2]} index={2} onSquareClick={handleClick} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} index={3} onSquareClick={handleClick} />
        <Square value={squares[4]} index={4} onSquareClick={handleClick} />
        <Square value={squares[5]} index={5} onSquareClick={handleClick} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} index={6} onSquareClick={handleClick} />
        <Square value={squares[7]} index={7} onSquareClick={handleClick} />
        <Square value={squares[8]} index={8} onSquareClick={handleClick} />
      </div>
    </>
  );
});

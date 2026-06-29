import { Square } from './Square.jsx';
import { calculateWinner } from '../game/logic.js';

export function Board({ xIsNext, squares, onPlay, disabled })
{
  function handleClick(i)
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
  }

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
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

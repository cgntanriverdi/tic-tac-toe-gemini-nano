import { useState } from 'react';

function Square({ value, onSquareClick }) 
{
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) 
{
  function handleClick(i) 
  {
    if (calculateWinner(squares) || squares[i]) 
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
  let status;
  if (winner) 
    {
    status = 'Winner: ' + winner;
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

export default function Game() 
{
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [answer, setAnswer] = useState('');
  const [playerSide, setPlayerSide] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) 
  {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove)
  {
    setCurrentMove(nextMove);
  }

  async function handleTest()
  {
    setAnswer('Düşünüyor...');

    const aiSide = playerSide === 'X' ? 'O' : 'X';
    const board = JSON.stringify(currentSquares);
    const prompt =
      'We are playing tic-tac-toe. The board is an array of 9 cells, indexed 0 to 8. ' +
      '"X" and "O" are taken cells, null is empty. ' +
      'Current board: ' + board + '. ' +
      'You are playing as "' + aiSide + '". ' +
      'Reply with ONLY the index number (0-8) of the best empty cell for "' + aiSide + '" to play. DO NOT REPLY WITH ANYTHING ELSE THEN THE PROMPTED REQUEST.';

    const session = await LanguageModel.create();
    const result = await session.prompt(prompt);
    setAnswer(result);
  }

  const moves = history.map((squares, move) => 
    {
    let description;
    if (move > 0) 
        {
      description = 'Go to move #' + move;
    } else 
        {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (playerSide === null)
  {
    return (
      <div className="game-start">
        <h2>Pick a side to play</h2>
        <button onClick={() => setPlayerSide('X')}>X</button>
        <button onClick={() => setPlayerSide('O')}>O</button>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>

      <div className="ai-test">
        <button onClick={handleTest}>Test Nano</button>
        <p>{answer}</p>
      </div>
    </div>
  );
}

function calculateWinner(squares) 
{
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) 
    {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) 
        {
      return squares[a];
    }
  }
  return null;
}

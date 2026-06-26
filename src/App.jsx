import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) 
{
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, disabled })
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

export default function Game() 
{
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerSide, setPlayerSide] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
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

  async function makeAiMove()
  {
    setAiThinking(true);

    const aiSide = playerSide === 'X' ? 'O' : 'X';
    const humanSide = playerSide;

    let move = null;

    const winMove = findWinningMove(currentSquares, aiSide);
    if (winMove !== null)
    {
      move = winMove;
    }

    if (move === null)
    {
      const blockMove = findWinningMove(currentSquares, humanSide);
      if (blockMove !== null)
      {
        move = blockMove;
      }
    }

    if (move === null)
    {
    const boardText = currentSquares
      .map((value, index) => index + '=' + (value === null ? 'empty' : value))
      .join(', ');

    const emptyCells = currentSquares
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    const prompt = `You are playing tic-tac-toe as "${aiSide}".
Board cells 0-8: ${boardText}
You may only play an empty cell. Empty cells: ${emptyCells.join(', ')}.
Prefer the center (4), then a corner (0, 2, 6, 8), then a side (1, 3, 5, 7).
Reply with ONLY one number from the empty cells. No explanation, no other text.`;

    const session = await LanguageModel.create();
    const result = await session.prompt(prompt);

    const match = result.match(/([0-8])/);
    const aiMove = match ? Number(match[1]) : null;

    if (aiMove !== null && currentSquares[aiMove] === null)
    {
      move = aiMove;
    }
    else
    {
      move = pickFallbackMove(currentSquares);
    }
    }

    const nextSquares = currentSquares.slice();
    nextSquares[move] = aiSide;
    handlePlay(nextSquares);

    setAiThinking(false);
  }
  useEffect(() =>
  {
    if (playerSide === null) return;                            
    if (calculateWinner(currentSquares) !== null) return;       
    if (currentSquares.every((cell) => cell !== null)) return;  

    const aiSide = playerSide === 'X' ? 'O' : 'X';
    const sideToMove = xIsNext ? 'X' : 'O';

    if (sideToMove === aiSide)
    {
      makeAiMove();
    }
  }, [currentMove, playerSide]);

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
  
  const isHumanTurn = playerSide === (xIsNext ? 'X' : 'O');

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} disabled={!isHumanTurn} />
      </div>
      <div className="game-info">
        {aiThinking ? <p className="ai-status">AI is thinking...</p> : null}
        <ol>{moves}</ol>
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


function findWinningMove(squares, side)
{
  for (let i = 0; i < squares.length; i++)
  {
    if (squares[i] === null)
    {
      const testSquares = squares.slice();

      testSquares[i] = side;
      
      if (calculateWinner(testSquares) === side)
      {
        return i;
      }
    }
  }
  return null;
}

function pickFallbackMove(squares)
{
  const preference = [4, 0, 2, 6, 8, 1, 3, 5, 7]; 
  for (let i = 0; i < preference.length; i++)
  {
    const cell = preference[i];
    if (squares[cell] === null)
    {
      return cell;
    }
  }
  return null;
}

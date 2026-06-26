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
    if (calculateWinner(currentSquares) !== null)
    {
      setAnswer('Oyun bitti.');
      return;
    }

    setAnswer('Düşünüyor...');

    const aiSide = playerSide === 'X' ? 'O' : 'X';
    const humanSide = playerSide;

    let move = null;
    let source = '';

    const winMove = findWinningMove(currentSquares, aiSide);
    if (winMove !== null)
    {
      move = winMove;
      source = 'kazanma';
    }

    if (move === null)
    {
      const blockMove = findWinningMove(currentSquares, humanSide);
      if (blockMove !== null)
      {
        move = blockMove;
        source = 'engelleme';
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

    const prompt = `You are an expert tic-tac-toe player. You play as "${aiSide}". Your opponent plays as "${humanSide}".

The board has 9 cells, indexed 0 to 8, laid out like this:
0 | 1 | 2
3 | 4 | 5
6 | 7 | 8

The 8 winning lines (three cells in a row) are:
[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]

To choose your move, go through these priorities IN ORDER and stop at the FIRST one that applies:
A) WIN: a line that already has TWO "${aiSide}" and ONE empty cell. Take that empty cell to win.
B) BLOCK: a line that already has TWO "${humanSide}" and ONE empty cell. Take that empty cell to block.
C) CENTER: cell 4, if it is empty.
D) CORNER: an empty corner (0, 2, 6, or 8).
E) SIDE: an empty side (1, 3, 5, or 7).

Rules:
- You may ONLY choose an empty cell. The empty cells are: ${emptyCells.join(', ')}.
- Check priority A on EVERY line first, then B on every line, then C, D, E.

Here is a worked example so you understand the format:
Cells: 0=O, 1=empty, 2=X, 3=empty, 4=X, 5=empty, 6=empty, 7=empty, 8=empty. You are "X".
Reasoning: Line [2,4,6] is X, X, empty -> two "X" and one empty -> WIN by playing 6.
FINAL ANSWER: 6

Now solve THIS board.
Current cells: ${boardText}

Write your short step-by-step reasoning, then finish with one final line in EXACTLY this format:
FINAL ANSWER: <number>`;

    const session = await LanguageModel.create();
    const result = await session.prompt(prompt);

    const match = result.match(/FINAL ANSWER:\s*(\d)/i);
    const aiMove = match ? Number(match[1]) : null;

    if (aiMove !== null && currentSquares[aiMove] === null)
    {
      move = aiMove;
      source = 'AI';
    }
    else
    {
      move = emptyCells[0];
      source = 'yedek';
    }
    }

    const nextSquares = currentSquares.slice();
    nextSquares[move] = aiSide;
    handlePlay(nextSquares);

    setAnswer('AI oynadi: ' + move + ' (' + source + ')');
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

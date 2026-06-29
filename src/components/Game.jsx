import { useState, useEffect } from 'react';
import { calculateWinner } from '../game/logic.js';
import { getAiMove } from '../ai/getAiMove.js';
import { Board } from './Board.jsx';

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

    const move = await getAiMove(currentSquares, aiSide, humanSide);

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

import { findWinningMove, pickFallbackMove } from '../game/logic.js';

export async function getAiMove(squares, aiSide, humanSide)
{
  let move = null;

  const winMove = findWinningMove(squares, aiSide);
  if (winMove !== null)
  {
    move = winMove;
  }

  if (move === null)
  {
    const blockMove = findWinningMove(squares, humanSide);
    if (blockMove !== null)
    {
      move = blockMove;
    }
  }

  if (move === null)
  {
    const boardText = squares
      .map((value, index) => index + '=' + (value === null ? 'empty' : value))
      .join(', ');

    const emptyCells = squares
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

    if (aiMove !== null && squares[aiMove] === null)
    {
      move = aiMove;
    }
    else
    {
      move = pickFallbackMove(squares);
    }
  }

  return move;
}

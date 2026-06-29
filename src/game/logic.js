export function calculateWinner(squares)
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

export function findWinningMove(squares, side)
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

export function pickFallbackMove(squares)
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

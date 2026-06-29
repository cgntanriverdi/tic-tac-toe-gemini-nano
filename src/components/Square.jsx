import { memo } from 'react';

export const Square = memo(function Square({ value, index, onSquareClick })
{
  const valueClass = value ? ' square-' + value.toLowerCase() : '';
  return (
    <button className={'square' + valueClass} onClick={() => onSquareClick(index)}>
      {value}
    </button>
  );
});

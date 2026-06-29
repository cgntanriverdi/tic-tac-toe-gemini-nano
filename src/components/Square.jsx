export function Square({ value, onSquareClick })
{
  const valueClass = value ? ' square-' + value.toLowerCase() : '';
  return (
    <button className={'square' + valueClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

import TableRender, { Cell } from './src';
const longText = {
  value: 'you are a good boy, a very good boy-------!!!',
  style: 0,
};

function cellText(ri: number, ci: number): string | Cell {
  return ri === 8 && ci === 1 ? longText : `${ri}-${ci}`;
}

TableRender.create('#table', 1400, 500)
  .scale(1.1)
  .colHeader({ height: 50, rows: 2, merges: ['A1:C1', 'D1:D2'] })
  .merges(['I10:J11', 'B9:D10'])
  .borders([
    ['G3', 'all', 'thick', '#188038'],
    ['B9', 'outside', 'thick', '#188038'],
    ['M4:N10', 'all', 'thick', '#188038'],
    ['H9:K11', 'inside', 'thick', 'red'],
    ['E14:J16', 'all', 'thick', '#188038'],
  ])
  .startRow(1)
  .rows(20)
  .styles([{ bold: true }])
  .col((index) => (index == 5 ? { width: 100, hide: true } : undefined))
  .freeze('C6')
  .scrollRows(2)
  .scrollCols(1)
  .cell((ri, ci) => cellText(ri, ci))
  .render();

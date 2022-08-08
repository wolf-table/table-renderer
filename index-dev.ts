import TableRender, { Cell } from './src';
const longText = {
  value: 'you are a good boy, a very good boy-------!!!',
  style: 0,
};

function cellText(ri: number, ci: number): string | Cell {
  return ri === 8 && ci === 1 ? longText : `${ri}-${ci}`;
}

TableRender.create('#table', 1200, 500)
  .scale(1.1)
  .colHeader({ height: 50, rows: 2, merges: ['A1:C1', 'D1:D2'] })
  .merges(['I10:K11', 'B9:D10'])
  .borders([
    ['B9:E12', 'all', 'thick', '#188038'],
    // ['B9:D10', 'all', 'thick', '#188038'],
    ['I10', 'outside', 'thick', 'red'],
    ['E14:H16', 'all', 'thick', '#188038'],
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

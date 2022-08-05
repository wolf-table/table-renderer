import TableRender, { Cell } from './src';
const longText = {
  value: 'you are a good boy, a very good boy-------!!!',
  style: 0,
};

function cellText(ri: number, ci: number): string | Cell {
  return ri === 8 && ci === 1 ? longText : `${ri}-${ci}`;
}

TableRender.create('#table', 800, 500)
  .scale(1.1)
  .colHeader({ height: 50, rows: 2, merges: ['A1:C1', 'D1:D2'] })
  .merges(['G10:H11', 'B9:D10'])
  .startRow(1)
  .rows(20)
  .cols(9)
  .styles([{ bold: true, border: { left: ['thick', '#34a853'], top: ['thick', '#ea4436'] } }])
  .col((index) => (index == 5 ? { width: 100, hide: true } : undefined))
  .freeze('C6')
  .scrollRows(2)
  .scrollCols(1)
  .cell((ri, ci) => cellText(ri, ci))
  .render();

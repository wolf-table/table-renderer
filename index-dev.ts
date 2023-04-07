import TableRenderer, { Cell, Canvas } from './src';
const longText = {
  value: 'you are a good boy, a very good boy-------!!!',
  style: 0,
};

function cellText(ri: number, ci: number): string | Cell {
  if (ri === 8 && ci === 1) return longText;
  const value = `${ri}-${ci}`;
  if (ri <= 14 && ri >= 13 && ci <= 12 && ci >= 9) {
    return { value, style: 1 };
  }
  if (ri === 4 && ci === 4) return { type: 'select', value };
  if (ri === 4 && ci === 8) return { type: 'bool', value };
  return value;
}

function cellRenderer(canvas: Canvas, { x, y, width, height }, cell) {
  const type = (cell && cell.type) || '';
  if (type === 'bool') {
    canvas
      .prop({ strokeStyle: '#0069c2', lineWidth: 2 })
      .roundRect((width - 12) / 2, height / 2 - 5, 10, 10, 2)
      .stroke();
  } else if (type === 'select') {
    canvas
      .prop({ fillStyle: '#0069c2' })
      .beginPath()
      .moveTo(width - 12, 2)
      .lineTo(width - 2, 2)
      .lineTo(width - 7, 10)
      .closePath()
      .fill();
  }
  return true;
}

TableRenderer.create('#table', 1400, 800)
  .scale(1)
  .bgcolor('#fff')
  .colHeader({
    height: 50,
    rows: 2,
    merges: ['A1:C1', 'D1:D2'],
    cellRenderer: (canvas, { x, y, width, height }) => {
      canvas
        .prop({ fillStyle: '#0069c2' })
        .beginPath()
        .moveTo(width - 12, 2)
        .lineTo(width - 2, 2)
        .lineTo(width - 7, 10)
        .closePath()
        .fill();
      return true;
    },
  })
  .merges(['I10:J11', 'B9:D10', 'G21:H22', 'J22:L23', 'I3:K4'])
  .borders([
    ['G3', 'all', 'dashed', '#188038'],
    ['B9', 'outside', 'thick', '#188038'],
    ['M4:N10', 'all', 'medium', '#188038'],
    ['H9:K12', 'inside', 'thick', 'red'],
    ['E14:J16', 'all', 'dotted', 'red'],
    ['E19:M24', 'all', 'thick', '#188038'],
  ])
  // .startRow(1)
  .rows(50)
  .styles([{ bold: true }, { bgcolor: '#ffc107' }])
  .col((index) => (index == 5 ? { width: 100, hide: true } : undefined))
  .freeze('C6')
  .scrollRows(2)
  .scrollCols(1)
  .cell((ri, ci) => cellText(ri, ci))
  .cellRenderer(cellRenderer)
  .render();

<p align="center">
  <a href="https://github.com/wolf-table/table-renderer">
    <img src="https://raw.githubusercontent.com/wolf-table/table-renderer/main/logo.svg" height="80px" width="600px"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/wolf-table/table-renderer/npm-publish-github-packages.yml" alt="GitHub Workflow Status">
  <a href="https://www.npmjs.org/package/@wolf-table/table-renderer"><img src="https://img.shields.io/npm/v/@wolf-table/table-renderer.svg" alt="npm package"></a>
  <img src="https://img.shields.io/github/downloads/wolf-table/table-renderer/total" alt="GitHub all releases">
  <img src="https://img.shields.io/github/license/wolf-table/table-renderer" alt="GitHub">
  <img src="https://img.shields.io/github/languages/code-size/wolf-table/table-renderer" alt=" code size in bytes">
</p>

## wolf-table-renderer
> A web-based(canvas) JavaScript Table Renderer

## NPM
1) In the same directory as your <code>package.json</code> file, create or edit an <code>.npmrc</code> file
```shell
@wolf-table:registry=https://npm.pkg.github.com
```
2) npm install
```shell
npm install @wolf-table/table-renderer@0.0.1
```

## Usage
```javascript
import TableRenderer, { Cell, Canvas } from "@wolf-table/table-renderer";
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

TableRender.create('#table', 1400, 800)
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
```

## Development

```shell
git clone https://github.com/wolf-table/table-renderer.git
cd table-renderer
npm install
npm run dev
```

Open your browser and visit http://127.0.0.1:8080.

## Browser Support

Modern browsers(chrome, firefox, Safari).

## LICENSE

MIT

Copyright (c) 2022-present, myliang
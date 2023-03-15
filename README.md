<p align="center">
  <a href="https://github.com/wolf-table/table-render">
<svg viewBox="0 0 300 56" height="56" width="300" style="width: 300px; height: 56px; position: absolute; top: 50%; left: 50%; z-index: 0; cursor: pointer; transform: translate(-50%, -50%) scale(0.693333);">
  <g transform="matrix(2.5,0,0,2.5,0,-12)" fill="#475861">
    <g xmlns="http://www.w3.org/2000/svg">
      <rect x="17.471" y="17.979" width="2.621" height="7.168"></rect>
      <rect x="21.838" y="20.91" width="2.621" height="4.237"></rect>
      <rect x="13.103" y="13.996" width="2.621" height="11.151"></rect>
      <rect x="8.735" y="6.828" width="2.621" height="18.318"></rect>
      <rect x="4.368" y="10.524" width="2.621" height="14.623"></rect>
      <rect x="0" y="16.411" width="2.621" height="8.761"></rect>
      <polygon points="28.003,13.865 29.712,12.156 23.402,11.059 24.499,17.369 26.294,15.574 30.291,19.571 32,17.862"/>
    </g>
  </g>
  <g transform="matrix(1.9760607369718157,0,0,1.9760607369718157,94.9440510993941,-23.234524768564185)" fill="#1a3e4d">
    <path d="M2.5586 12.051 l0 27.949 l5.1953 0 l12.383 -21.035 l0 21.035 l5.1953 0 l16.465 -27.949 l-4.9219 0 l-12.48 21.191 l0 -21.191 l-5.1172 0 l-12.48 21.191 l0 -21.191 l-4.2383 0 z M47.24611875 18.945 c-1.9531 1.9531 -2.9297 4.31 -2.9297 7.0703 s0.97656 5.1172 2.9297 7.0703 s4.31 2.9297 7.0703 2.9297 s5.1172 -0.97656 7.0703 -2.9297 s2.9297 -4.31 2.9297 -7.0703 s-0.97656 -5.1172 -2.9297 -7.0703 s-4.31 -2.9297 -7.0703 -2.9297 s-5.1172 0.97656 -7.0703 2.9297 z M44.23831875 36.0937 c-2.7865 -2.7865 -4.1797 -6.1459 -4.1797 -10.078 s1.3932 -7.2916 4.1797 -10.078 s6.1459 -4.1797 10.078 -4.1797 s7.2916 1.3932 10.078 4.1797 s4.1797 6.1459 4.1797 10.078 s-1.3932 7.2916 -4.1797 10.078 s-6.1459 4.1797 -10.078 4.1797 s-7.2916 -1.3932 -10.078 -4.1797 z M71.85551875 12.051 l0 27.949 l14.258 0 l0 -4.2383 l-10.02 0 l0 -23.711 l-4.2383 0 z M89.51176875 12.051 l0 27.949 l4.2383 0 l0 -11.895 l7.7344 0 l0 -4.2383 l-7.7344 0 l0 -7.5781 l10.02 0 l0 -4.2383 l-14.258 0 z"/>
  </g>
</svg>
</p>

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/wolf-table/table-render/npm-publish-github-packages.yml)
[![npm package](https://img.shields.io/npm/v/@wolf-table/table-renderer.svg)](https://www.npmjs.org/package/@wolf-table/table-renderer)
![GitHub all releases](https://img.shields.io/github/downloads/wolf-table/table-renderer/total)
![GitHub](https://img.shields.io/github/license/wolf-table/table-renderer)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wolf-table/table-renderer)
![Gitter](https://img.shields.io/gitter/room/wolf-table/table-renderer)

> A web-based(canvas) JavaScript Table

## NPM
```shell
npm install @wolf-table/table-renderer@0.0.1
```
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
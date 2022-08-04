import Area from './area';
import Canvas from './canvas';
import { cellRender } from './cell-render';
import { eachRanges } from './range';
import TableRender, { Cell, CellFunc, CellStyle, ColFunc, LineStyle, Rect, RowFunc } from '.';

function renderLines(canvas: Canvas, { width, color }: LineStyle, cb: () => void) {
  if (width > 0) {
    canvas.save().beginPath().attr({ lineWidth: width, strokeStyle: color });
    cb();
    canvas.restore();
  }
}

function renderCell(
  canvas: Canvas,
  cell: Cell,
  rect: Rect,
  defaultStyle: CellStyle,
  styles: Partial<CellStyle>[]
) {
  let text = '';
  let nstyle = defaultStyle;
  let type = undefined;
  if (cell) {
    if (typeof cell === 'string' || typeof cell === 'number') text = `${cell}`;
    else {
      type = cell.type;
      text = (cell.value || '') + '';
      if (cell.style !== undefined) nstyle = { ...defaultStyle, ...styles[cell.style] };
    }
  }
  cellRender(canvas, text, rect, nstyle, type);
}

function renderGridLines(canvas: Canvas, area: Area, lineStyle: LineStyle) {
  renderLines(canvas, lineStyle, () => {
    // draw row lines
    area.eachRow((row, y, h) => {
      canvas.line(0, y + h, area.width, y + h);
    });
    // draw col lines
    area.eachCol((col, x, w) => {
      canvas.line(x + w, 0, x + w, area.height);
    });
  });
}

function renderArea(
  canvas: Canvas,
  area: Area | null,
  cell: CellFunc,
  defaultCellStyle: CellStyle,
  defaultLineStyle: LineStyle,
  styles: Partial<CellStyle>[],
  merges?: string[] | null,
  row?: RowFunc,
  col?: ColFunc
) {
  if (!area) return;
  canvas.save().translate(area.x, area.y);

  canvas.rect(0, 0, area.width, area.height).clip();

  const mergeCellStyle = (r: number, c: number) => {
    const cstyle = { ...defaultCellStyle };
    if (row) {
      const r1 = row(r);
      if (r1 && r1.style !== undefined) Object.assign(cstyle, styles[r1.style]);
    }
    if (col) {
      const c1 = col(c);
      if (c1 && c1.style !== undefined) Object.assign(cstyle, styles[c1.style]);
    }
    return cstyle;
  };

  // render cells
  area.each((r, c, rect) => {
    renderCell(canvas, cell(r, c), rect, mergeCellStyle(r, c), styles);
  });

  // render lines
  renderGridLines(canvas, area, defaultLineStyle);

  // render merges
  if (merges) {
    eachRanges(merges, (it) => {
      if (it.intersects(area.range)) {
        renderCell(
          canvas,
          cell(it.startRow, it.startCol),
          area.rect(it, defaultLineStyle.width),
          mergeCellStyle(it.startRow, it.startCol),
          styles
        );
      }
    });
  }
  canvas.restore();
}

function renderBody(canvas: Canvas, area: Area | null, table: TableRender) {
  renderArea(
    canvas,
    area,
    table._cell,
    table._cellStyle,
    table._lineStyle,
    table._styles,
    table._merges,
    table._row,
    table._col
  );
}

function renderRowHeader(canvas: Canvas, area: Area | null, table: TableRender) {
  const { cell, width, merges, cols } = table._rowHeader;
  if (width > 0) {
    renderArea(canvas, area, cell, table._headerCellStyle, table._headerLineStyle, table._styles, merges);
  }
}

function renderColHeader(canvas: Canvas, area: Area | null, table: TableRender) {
  const { cell, height, merges, rows } = table._colHeader;
  if (height > 0) {
    renderArea(canvas, area, cell, table._headerCellStyle, table._headerLineStyle, table._styles, merges);
  }
}

export function render(table: TableRender) {
  const { _width, _height, _target, _scale, _viewport, _freeze, _rowHeader, _colHeader } = table;
  if (_viewport) {
    const canvas = new Canvas(_target, _scale);
    canvas.size(_width, _height);

    const [area1, area2, area3, area4] = _viewport.areas;
    const [headerArea1, headerArea21, headerArea23, headerArea3] = _viewport.headerAreas;

    // render-4
    renderBody(canvas, area4, table);

    // render-1
    renderBody(canvas, area1, table);
    renderColHeader(canvas, headerArea1, table);

    // render-3
    renderBody(canvas, area3, table);
    renderRowHeader(canvas, headerArea3, table);

    // render 2
    renderBody(canvas, area2, table);
    renderColHeader(canvas, headerArea21, table);
    renderRowHeader(canvas, headerArea23, table);

    // render freeze
    const [cols, rows] = _freeze;
    if (cols > 0 || rows > 0) {
      renderLines(canvas, table._freezeLineStyle, () => {
        if (cols > 0) canvas.line(0, area4.y, _width, area4.y);
        if (rows > 0) canvas.line(area4.x, 0, area4.x, _height);
      });
    }

    // render left-top
    const { x, y } = area2;
    if (x > 0 && y > 0) {
      const area0 = Area.create(
        0,
        0,
        0,
        0,
        0,
        0,
        () => _colHeader.height,
        () => _rowHeader.width
      );
      renderArea(canvas, area0, () => '', table._headerCellStyle, table._headerLineStyle, table._styles);
    }
  }
}

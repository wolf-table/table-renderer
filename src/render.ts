import Area from './area';
import Canvas from './canvas';
import { cellRender, cellBorderRender } from './cell-render';
import Range, { eachRanges } from './range';
import { borderRanges } from './border';
import TableRenderer, {
  Cell,
  CellGetter,
  CellStyle,
  ColGetter,
  LineStyle,
  Rect,
  RowGetter,
  Border,
  LineType,
  BorderType,
  Formatter,
  CellRenderer,
} from '.';

function renderLines(canvas: Canvas, { width, color }: LineStyle, cb: () => void) {
  if (width > 0) {
    canvas.save().beginPath().attr({ lineWidth: width, strokeStyle: color });
    cb();
    canvas.restore();
  }
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

function renderBorder(
  canvas: Canvas,
  area: Area,
  range: Range,
  borderRect: Rect,
  type: BorderType,
  lineType: LineType,
  lineColor: string,
  autoAlign?: boolean
) {
  const borderLineStyle = [lineType, lineColor] as [LineType, string];
  // if type === 'none', you can delete borders in ref(range)
  if (type === 'outside' || type === 'all') {
    cellBorderRender(canvas, borderRect, borderLineStyle, true);
  } else if (type === 'left') {
    cellBorderRender(canvas, borderRect, { left: borderLineStyle }, autoAlign);
  } else if (type === 'top') {
    cellBorderRender(canvas, borderRect, { top: borderLineStyle }, autoAlign);
  } else if (type === 'right') {
    cellBorderRender(canvas, borderRect, { right: borderLineStyle }, autoAlign);
  } else if (type === 'bottom') {
    cellBorderRender(canvas, borderRect, { bottom: borderLineStyle }, autoAlign);
  }
  if (type === 'all' || type === 'inside' || type === 'horizontal' || type === 'vertical') {
    if (type !== 'horizontal') {
      range.eachCol((index) => {
        if (index < range.endCol) {
          const r1 = range.clone();
          r1.endCol = r1.startCol = index;
          if (r1.intersects(area.range)) {
            cellBorderRender(canvas, area.rect(r1), { right: borderLineStyle }, autoAlign);
          }
        }
      });
    }
    if (type !== 'vertical') {
      range.eachRow((index) => {
        if (index < range.endRow) {
          const r1 = range.clone();
          r1.endRow = r1.startRow = index;
          if (r1.intersects(area.range)) {
            cellBorderRender(canvas, area.rect(r1), { bottom: borderLineStyle }, autoAlign);
          }
        }
      });
    }
  }
}

function renderBorders(canvas: Canvas, area: Area, borders: Border[] | undefined, areaMerges: Range[]) {
  // render borders
  if (borders && borders.length > 0) {
    borders.forEach((border) => {
      const [, , lineType, lineColor] = border;
      borderRanges(area, border, areaMerges).forEach(([range, rect, type]) => {
        renderBorder(canvas, area, range, rect, type, lineType, lineColor);
      });
    });
  }
}

function renderArea(
  canvas: Canvas,
  area: Area | null,
  cell: CellGetter,
  cellRenderer: CellRenderer | undefined,
  formatter: Formatter,
  defaultCellStyle: CellStyle,
  defaultLineStyle: LineStyle,
  styles: Partial<CellStyle>[],
  merges?: string[],
  borders?: Border[],
  row?: RowGetter,
  col?: ColGetter
) {
  if (!area) return;
  canvas.save().translate(area.x, area.y);

  canvas.rect(0, 0, area.width, area.height).clip();

  const mergeCellStyle = (r: number, c: number, ce: Cell) => {
    const cstyle = { ...defaultCellStyle };
    if (row) {
      const r1 = row(r);
      if (r1 && r1.style !== undefined) Object.assign(cstyle, styles[r1.style]);
    }
    if (col) {
      const c1 = col(c);
      if (c1 && c1.style !== undefined) Object.assign(cstyle, styles[c1.style]);
    }
    if (ce instanceof Object && ce.style !== undefined) {
      Object.assign(cstyle, styles[ce.style]);
    }
    return cstyle;
  };

  // render cells
  area.each((r, c, rect) => {
    const cellv = cell(r, c);
    const cellStyle = mergeCellStyle(r, c, cellv);
    cellRender(canvas, cellv, rect, cellStyle, cellRenderer, formatter);
  });

  // render lines
  renderGridLines(canvas, area, defaultLineStyle);

  const areaMerges: Range[] = [];
  // render merges
  if (merges) {
    eachRanges(merges, (it) => {
      if (it.intersects(area.range)) {
        const cellv = cell(it.startRow, it.startCol);
        const cellStyle = mergeCellStyle(it.startRow, it.startCol, cellv);
        const cellRect = area.rect(it);
        cellRender(canvas, cellv, cellRect, cellStyle, cellRenderer, formatter);
        areaMerges.push(it);
      }
    });
  }

  // render borders
  renderBorders(canvas, area, borders, areaMerges);

  canvas.restore();
}

function renderBody(canvas: Canvas, area: Area | null, table: TableRenderer) {
  renderArea(
    canvas,
    area,
    table._cell,
    table._cellRenderer,
    table._formatter,
    table._cellStyle,
    table._lineStyle,
    table._styles,
    table._merges,
    table._borders,
    table._row,
    table._col
  );
}

function renderRowHeader(canvas: Canvas, area: Area | null, table: TableRenderer) {
  const { cell, width, merges, cellRenderer } = table._rowHeader;
  if (width > 0) {
    renderArea(
      canvas,
      area,
      cell,
      cellRenderer,
      (v) => v,
      table._headerCellStyle,
      table._headerLineStyle,
      table._styles,
      merges
    );
  }
}

function renderColHeader(canvas: Canvas, area: Area | null, table: TableRenderer) {
  const { cell, height, merges, cellRenderer } = table._colHeader;
  if (height > 0) {
    renderArea(
      canvas,
      area,
      cell,
      cellRenderer,
      (v) => v,
      table._headerCellStyle,
      table._headerLineStyle,
      table._styles,
      merges
    );
  }
}

export function render(table: TableRenderer) {
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
      renderArea(
        canvas,
        area0,
        () => '',
        undefined,
        (v) => v,
        table._headerCellStyle,
        table._headerLineStyle,
        table._styles
      );
    }
  }
}

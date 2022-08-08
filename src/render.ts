import Area from './area';
import Canvas, { borderLineTypeToWidth } from './canvas';
import { cellRender, cellBorderRender } from './cell-render';
import Range, { eachRanges } from './range';
import TableRender, {
  Cell,
  CellFunc,
  CellStyle,
  ColFunc,
  LineStyle,
  Rect,
  RowFunc,
  Border,
  LineType,
  BorderType,
} from '.';
import { rejects } from 'assert';

function renderLines(canvas: Canvas, { width, color }: LineStyle, cb: () => void) {
  if (width > 0) {
    canvas.save().beginPath().attr({ lineWidth: width, strokeStyle: color });
    cb();
    canvas.restore();
  }
}

function renderCell(canvas: Canvas, cell: Cell, rect: Rect, cellStyle: CellStyle) {
  let text = '';
  let type = undefined;
  if (cell) {
    if (typeof cell === 'string' || typeof cell === 'number') text = `${cell}`;
    else {
      type = cell.type;
      text = (cell.value || '') + '';
    }
  }
  cellRender(canvas, text, rect, cellStyle, type);
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
  range: Range,
  area: Area,
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
          cellBorderRender(canvas, area.rect(r1), { right: borderLineStyle }, autoAlign);
        }
      });
    }
    if (type !== 'vertical') {
      range.eachRow((index) => {
        if (index < range.endRow) {
          const r1 = range.clone();
          r1.endRow = r1.startRow = index;
          cellBorderRender(canvas, area.rect(r1), { bottom: borderLineStyle }, autoAlign);
        }
      });
    }
  }
}

function renderBorders(canvas: Canvas, area: Area, borders: Border[] | undefined, areaMerges: Range[]) {
  // render borders
  if (borders && borders.length > 0) {
    // borders slice by merges
    if (areaMerges.length > 0) {
      borders.forEach(([ref, type, lineType, lineColor]) => {
        const bRange = Range.with(ref);
        if (bRange.intersects(area.range)) {
          let intersects = false;
          areaMerges.forEach((merge) => {
            if (bRange.within(merge)) {
              intersects = true;
              renderBorder(
                canvas,
                merge,
                area,
                area.rect(merge),
                bRange.equals(merge) ? 'outside' : type,
                lineType,
                lineColor
              );
            } else if (merge.intersects(bRange)) {
              intersects = true;
              // console.log('bRange:', bRange, merge, area, bRange.difference(merge));
              bRange.difference(merge).forEach((it) => {
                if (it.intersects(area.range))
                  renderBorder(canvas, it, area, area.rect(it), type, lineType, lineColor);
              });
              const borderRect = area.rect(merge);
              if (bRange.startRow === merge.startRow) {
                renderBorder(canvas, merge, area, borderRect, 'top', lineType, lineColor, true);
              }
              if (bRange.startCol === merge.startCol) {
                renderBorder(canvas, merge, area, borderRect, 'left', lineType, lineColor, true);
              }
              if (bRange.endRow === merge.endRow) {
                renderBorder(canvas, merge, area, borderRect, 'bottom', lineType, lineColor, true);
              }
              if (bRange.endCol === merge.endCol) {
                renderBorder(canvas, merge, area, borderRect, 'right', lineType, lineColor, true);
              }
            }
          });
          if (!intersects) {
            renderBorder(canvas, bRange, area, area.rect(bRange), type, lineType, lineColor);
          }
        }
      });
    }
  }
}

function renderArea(
  canvas: Canvas,
  area: Area | null,
  cell: CellFunc,
  defaultCellStyle: CellStyle,
  defaultLineStyle: LineStyle,
  styles: Partial<CellStyle>[],
  merges?: string[],
  borders?: Border[],
  row?: RowFunc,
  col?: ColFunc
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
    renderCell(canvas, cellv, rect, cellStyle);
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
        renderCell(canvas, cellv, cellRect, cellStyle);
        areaMerges.push(it);
      }
    });
  }

  // render borders
  renderBorders(canvas, area, borders, areaMerges);

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
    table._borders,
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

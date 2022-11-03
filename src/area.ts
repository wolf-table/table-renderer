import { Rect, AreaCell } from '.';
import Range from './range';

export default class Area {
  // { rowIndex: { y, height }}
  rowMap = new Map<number, { y: number; height: number }>();
  // { colIndex: { x, width }}
  colMap = new Map<number, { x: number; width: number }>();

  constructor(
    public readonly range: Range,
    public readonly x: number,
    public readonly y: number,
    public width: number,
    public height: number,
    public readonly rowHeight: (index: number) => number,
    public readonly colWidth: (index: number) => number
  ) {
    // init width, height and set rowMap, colMap
    let totalHeight = 0;
    range.eachRow((index) => {
      const height = rowHeight(index);
      this.rowMap.set(index, { y: totalHeight, height });
      totalHeight += height;
    });
    if (this.height <= 0) this.height = totalHeight;

    let totalWidth = 0;
    range.eachCol((index) => {
      const width = colWidth(index);
      this.colMap.set(index, { x: totalWidth, width });
      totalWidth += width;
    });
    if (this.width <= 0) this.width = totalWidth;
  }

  /**
   * check whether or not x contained in area
   * @param {int} x offset on x-axis
   */
  containsx(x: number) {
    return x >= this.x && x < this.x + this.width;
  }

  /**
   * check whether or not y contained in area
   * @param {int} y offset on y-axis
   */
  containsy(y: number) {
    return y >= this.y && y < this.y + this.height;
  }

  contains(x: number, y: number) {
    return this.containsx(x) && this.containsy(y);
  }

  eachRow(cb: (index: number, y: number, height: number) => void) {
    this.range.eachRow((index) => {
      const { y, height } = this.rowMap.get(index) || { y: 0, height: 0 };
      if (height > 0) cb(index, y, height);
    });
  }

  eachCol(cb: (index: number, x: number, width: number) => void) {
    this.range.eachCol((index) => {
      const { x, width } = this.colMap.get(index) || { x: 0, width: 0 };
      if (width > 0) cb(index, x, width);
    });
  }

  each(cb: (row: number, col: number, rect: Rect) => void) {
    this.eachRow((row, y, height) => {
      this.eachCol((col, x, width) => {
        cb(row, col, { x, y, width, height });
      });
    });
  }

  rectRow(startRow: number, endRow: number) {
    const { rowMap, range } = this;
    let [y, height] = [0, 0];
    // row: { y, height }
    if (startRow >= range.startRow) {
      y = rowMap.get(startRow)?.y || 0;
    }
    for (let i = startRow; i <= endRow; i += 1) {
      const h = this.rowHeight(i);
      if (h > 0) {
        if (i < range.startRow) y -= h;
        height += h;
      }
    }
    const { width } = this;
    return { x: 0, y, width, height };
  }

  rectCol(startCol: number, endCol: number) {
    const { colMap, range } = this;
    let [x, width] = [0, 0];
    // col: { x, width }
    if (startCol >= range.startCol) {
      x = colMap.get(startCol)?.x || 0;
    }
    for (let i = startCol; i <= endCol; i += 1) {
      const w = this.colWidth(i);
      if (w > 0) {
        if (i < range.startCol) x -= w;
        width += w;
      }
    }
    const { height } = this;
    return { x, y: 0, width, height };
  }

  rect(r: Range) {
    let { y, height } = this.rectRow(r.startRow, r.endRow);
    let { x, width } = this.rectCol(r.startCol, r.endCol);
    return { x, y, width, height };
  }

  cellAtCache: AreaCell | null = null;
  cellAt(x: number, y: number): AreaCell {
    // whether or not in cache
    const { cellAtCache } = this;
    if (cellAtCache != null) {
      if (
        x > cellAtCache.x &&
        x <= cellAtCache.x + cellAtCache.width &&
        y > cellAtCache.y &&
        y <= cellAtCache.y + cellAtCache.height
      ) {
        return cellAtCache;
      }
    }

    const { startRow, startCol } = this.range;
    const cell = {
      row: startRow,
      col: startCol,
      x: this.x,
      y: this.y,
      width: 0,
      height: 0,
    };

    // row
    while (cell.y < y) {
      const h = this.rowHeight(cell.row++);
      cell.y += h;
      cell.height = h;
    }
    cell.y -= cell.height;
    cell.row--;

    // col
    while (cell.x < x) {
      const w = this.colWidth(cell.col++);
      cell.x += w;
      cell.width = w;
    }
    cell.x -= cell.width;
    cell.col--;

    this.cellAtCache = cell;
    return cell;
  }

  static create(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    x: number,
    y: number,
    width: number,
    height: number,
    rowHeight: (index: number) => number,
    colWidth: (index: number) => number
  ) {
    return new Area(
      new Range(startRow, startCol, endRow, endCol),
      x,
      y,
      width,
      height,
      rowHeight,
      colWidth
    );
  }
}

import { expr2xy, xy2expr } from './alphabet';

/**
 * the range spendColfied by a start position and an end position,
 * the smallest range must contain at least one cell.
 * Range is not a merged cell, but it can be merged as a single cell
 * @author myliang
 */
export default class Range {
  /**
   * @param startRow index of row of the start position
   * @param startCol index of col of the start position
   * @param endRow index of row of the end position
   * @param endCol index of col of the end position
   */
  constructor(
    public startRow: number,
    public startCol: number,
    public endRow: number,
    public endCol: number
  ) {
    // No body necessary
  }

  get start(): [number, number] {
    return [this.startRow, this.startCol];
  }

  get end(): [number, number] {
    return [this.endRow, this.endCol];
  }

  // count of rows contained in this range
  get rows(): number {
    return this.endRow - this.startRow;
  }

  // count of cols contained in this range
  get cols(): number {
    return this.endCol - this.startCol;
  }

  get multiple(): boolean {
    return this.cols > 0 || this.rows > 0;
  }

  /**
   * check whether or not the row-index contained in the row of range
   * @param {int} index
   * @returns {boolean}
   */
  containsRow(index: number): boolean {
    return this.startRow <= index && index <= this.endRow;
  }

  /**
   * check whether or not the index contained in the col of range
   * @param {int} index
   * @returns {boolean}
   */
  containsCol(index: number): boolean {
    return this.startCol <= index && index <= this.endCol;
  }

  /**
   * check whether or not the range contains a cell position(row, col)
   * @param {int} rowIndex row-index
   * @param {int} colIndex col-index
   * @returns {boolean}
   */
  contains(rowIndex: number, colIndex: number): boolean {
    return this.containsRow(rowIndex) && this.containsCol(colIndex);
  }

  /**
   * check whether or not the range within the other range
   * @param {Range} other
   * @returns {boolean}
   */
  within(other: Range): boolean {
    return (
      this.startRow >= other.startRow &&
      this.startCol >= other.startCol &&
      this.endRow <= other.endRow &&
      this.endCol <= other.endCol
    );
  }

  intersectsRow(startRow: number, endRow: number): boolean {
    return this.startRow <= endRow && startRow <= this.endRow;
  }

  intersectsCol(startCol: number, endCol: number): boolean {
    return this.startCol <= endCol && startCol <= this.endCol;
  }

  /**
   * check whether or not the range intersects the other range
   * @param {Range} other
   * @returns {boolean}
   */
  intersects({ startRow, startCol, endRow, endCol }: Range): boolean {
    return this.intersectsCol(startCol, endCol) && this.intersectsRow(startRow, endRow);
  }

  /**
   * the self intersection the other resulting in the new range
   * @param {Range} other
   * @returns {Range} the new range
   */
  intersection(other: Range): Range {
    return new Range(
      other.startRow < this.startRow ? this.startRow : other.startRow,
      other.startCol < this.startCol ? this.startCol : other.startCol,
      other.endRow > this.endRow ? this.endRow : other.endRow,
      other.endCol > this.endCol ? this.endCol : other.endCol
    );
  }

  /**
   * the self union the other resulting in the new range
   * @param {Range} other
   * @returns {Range} the new range
   */
  union(other: Range): Range {
    return new Range(
      other.startRow < this.startRow ? other.startRow : this.startRow,
      other.startCol < this.startCol ? other.startCol : this.startCol,
      other.endRow > this.endRow ? other.endRow : this.endRow,
      other.endCol > this.endCol ? other.endCol : this.endCol
    );
  }

  // Returns Array<CellRange> that represents that part of this that does not intersect with other
  // difference
  difference(other: Range): Range[] {
    const ret: Range[] = [];
    if (!this.intersects(other)) return ret;
    const { startRow, startCol, endRow, endCol } = this;
    const nOther = this.intersection(other);
    return [
      new Range(startRow, startCol, nOther.startRow - 1, endCol), // top
      new Range(nOther.endRow + 1, startCol, endRow, endCol), // bottom
      new Range(nOther.startRow, startCol, nOther.endRow, nOther.startCol - 1), // left
      new Range(nOther.startRow, nOther.endCol + 1, nOther.endRow, endCol), // right
    ].filter((it) => it.rows >= 0 && it.cols >= 0);
  }

  touches(other: Range): boolean {
    return (
      (other.startRow === this.startRow &&
        other.endRow === this.endRow &&
        (other.endCol + 1 === this.startCol || this.endCol + 1 === other.startCol)) ||
      (other.startCol === this.startCol &&
        other.endCol === this.endCol &&
        (other.endRow + 1 === this.startRow || this.endRow + 1 === this.startCol))
    );
  }

  /**
   * @param {Function} cb (row) => {}
   * @returns this
   */
  eachRow(cb: (index: number) => void): Range;
  eachRow(cb: (index: number) => void, max: number): Range;
  eachRow(cb: (index: number) => void, max?: number): Range {
    let { endRow } = this;
    if (max && endRow > max) endRow = max;
    for (let row = this.startRow; row <= endRow; row += 1) {
      cb(row);
    }
    return this;
  }

  /**
   * @param {Function} cb (col) => {}
   * @returns this
   */
  eachCol(cb: (index: number) => void): Range;
  eachCol(cb: (index: number) => void, max: number): Range;
  eachCol(cb: (index: number) => void, max?: number): Range {
    let { endCol } = this;
    if (max && endCol > max) endCol = max;
    for (let col = this.startCol; col <= endCol; col += 1) {
      cb(col);
    }
    return this;
  }

  /**
   * @param {Function} cb (rowIndex, colIndex) => {}
   * @returns this
   */
  each(cb: (rowIndex: number, colIndex: number) => void): Range {
    this.eachRow((row) => {
      this.eachCol((col) => cb(row, col));
    });
    return this;
  }

  clone(): Range {
    return new Range(this.startRow, this.startCol, this.endRow, this.endCol);
  }

  toString(): string {
    let ref = xy2expr(this.startCol, this.startRow);
    if (this.multiple) {
      ref += `:${xy2expr(this.endCol, this.endRow)}`;
    }
    return ref;
  }

  equals(other: Range): boolean {
    return (
      this.startRow === other.startRow &&
      this.startCol === other.startCol &&
      this.endRow === other.endRow &&
      this.endCol === other.endCol
    );
  }

  static create(row: number, col: number): Range;
  static create(row: number, col: number, row1: number, col1: number): Range;
  static create(row: number, col: number, row1?: number, col1?: number): Range {
    if (row1 !== undefined && col1 !== undefined) {
      let [startRow, startCol, endRow, endCol] = [row, col, row1, col1];
      if (row > row1) {
        startRow = row1;
        endRow = row;
      }
      if (col > col1) {
        startCol = col1;
        endCol = col;
      }
      return new Range(startRow, startCol, endRow, endCol);
    }
    return new Range(row, col, row, col);
  }

  static with(ref: string): Range {
    const refs = ref.split(':');
    const [col, row] = expr2xy(refs[0]);
    if (refs.length === 1) {
      return this.create(row, col);
    }
    const [col1, row1] = expr2xy(refs[1]);
    return this.create(row, col, row1, col1);
  }
}

export function eachRanges(refs: string[], cb: (range: Range) => void) {
  if (refs && refs.length > 0) {
    refs.forEach((ref) => {
      cb(Range.with(ref));
    });
  }
}

export function findRanges(refs: string[], filter: (it: Range) => boolean) {
  if (refs && refs.length > 0) {
    for (let ref of refs) {
      const r = Range.with(ref);
      if (filter(r)) return r;
    }
  }
  return null;
}

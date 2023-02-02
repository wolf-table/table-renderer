/**
 * the range spendColfied by a start position and an end position,
 * the smallest range must contain at least one cell.
 * Range is not a merged cell, but it can be merged as a single cell
 * @author myliang
 */
export default class Range {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    /**
     * @param startRow index of row of the start position
     * @param startCol index of col of the start position
     * @param endRow index of row of the end position
     * @param endCol index of col of the end position
     */
    constructor(startRow: number, startCol: number, endRow: number, endCol: number);
    get start(): [number, number];
    get end(): [number, number];
    get rows(): number;
    get cols(): number;
    get multiple(): boolean;
    /**
     * check whether or not the row-index contained in the row of range
     * @param {int} index
     * @returns {boolean}
     */
    containsRow(index: number): boolean;
    /**
     * check whether or not the index contained in the col of range
     * @param {int} index
     * @returns {boolean}
     */
    containsCol(index: number): boolean;
    /**
     * check whether or not the range contains a cell position(row, col)
     * @param {int} row row-index
     * @param {int} col col-index
     * @returns {boolean}
     */
    contains(row: number, col: number): boolean;
    /**
     * check whether or not the range within the other range
     * @param {Range} other
     * @returns {boolean}
     */
    within(other: Range): boolean;
    position(other: Range): 'left' | 'right' | 'up' | 'down' | 'none';
    intersectsRow(startRow: number, endRow: number): boolean;
    intersectsCol(startCol: number, endCol: number): boolean;
    /**
     * check whether or not the range intersects the other range
     * @param {Range} other
     * @returns {boolean}
     */
    intersects({ startRow, startCol, endRow, endCol }: Range): boolean;
    /**
     * the self intersection the other resulting in the new range
     * @param {Range} other
     * @returns {Range} the new range
     */
    intersection(other: Range): Range;
    /**
     * the self union the other resulting in the new range
     * @param {Range} other
     * @returns {Range} the new range
     */
    union(other: Range): Range;
    difference(other: Range): Range[];
    touches(other: Range): boolean;
    /**
     * @param {Function} cb (row) => {}
     * @returns this
     */
    eachRow(cb: (index: number) => void): Range;
    eachRow(cb: (index: number) => void, max: number): Range;
    /**
     * @param {Function} cb (col) => {}
     * @returns this
     */
    eachCol(cb: (index: number) => void): Range;
    eachCol(cb: (index: number) => void, max: number): Range;
    /**
     * @param {Function} cb (rowIndex, colIndex) => {}
     * @returns this
     */
    each(cb: (rowIndex: number, colIndex: number) => void): Range;
    clone(): Range;
    toString(): string;
    equals(other: Range): boolean;
    static create(row: number, col: number): Range;
    static create(row: number, col: number, row1: number, col1: number): Range;
    static with(ref: string): Range;
}
export declare function eachRanges(refs: string[], cb: (range: Range) => void): void;
export declare function findRanges(refs: string[], filter: (it: Range) => boolean): Range | null;

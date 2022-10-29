import { Rect, AreaCell } from '.';
import Range from './range';
export default class Area {
    readonly range: Range;
    readonly x: number;
    readonly y: number;
    width: number;
    height: number;
    readonly rowHeight: (index: number) => number;
    readonly colWidth: (index: number) => number;
    rowMap: Map<number, {
        y: number;
        height: number;
    }>;
    colMap: Map<number, {
        x: number;
        width: number;
    }>;
    constructor(range: Range, x: number, y: number, width: number, height: number, rowHeight: (index: number) => number, colWidth: (index: number) => number);
    /**
     * check whether or not x contained in area
     * @param {int} x offset on x-axis
     */
    containsx(x: number): boolean;
    /**
     * check whether or not y contained in area
     * @param {int} y offset on y-axis
     */
    containsy(y: number): boolean;
    contains(x: number, y: number): boolean;
    eachRow(cb: (index: number, y: number, height: number) => void): void;
    eachCol(cb: (index: number, x: number, width: number) => void): void;
    each(cb: (row: number, col: number, rect: Rect) => void): void;
    rectRow(startRow: number, endRow: number): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    rectCol(startCol: number, endCol: number): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    rect(r: Range): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    cellAtCache: AreaCell | null;
    cellAt(x: number, y: number): AreaCell;
    static create(startRow: number, startCol: number, endRow: number, endCol: number, x: number, y: number, width: number, height: number, rowHeight: (index: number) => number, colWidth: (index: number) => number): Area;
}

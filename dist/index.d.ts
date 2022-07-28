import { stringAt, expr2xy, xy2expr } from './alphabet';
import Range, { eachRanges, findRanges } from './range';
import Viewport from './viewport';
import Area from './area';
export declare type Align = 'left' | 'right' | 'center';
export declare type VerticalAlign = 'top' | 'bottom' | 'middle';
export declare type LineStyle = {
    width: number;
    color: string;
};
export declare type LineType = 'thin' | 'medium' | 'thick' | 'dashed' | 'dotted';
export declare type TextLineType = 'underline' | 'strikethrough';
export declare type CellStyle = {
    bgcolor: string;
    align: Align;
    valign: VerticalAlign;
    textwrap: boolean;
    underline: boolean;
    strikethrough: boolean;
    color: string;
    bold: boolean;
    italic: boolean;
    fontSize: number;
    fontName: string;
    rotate?: number;
    border?: {
        left: [LineType, string];
        top: [LineType, string];
        right: [LineType, string];
        bottom: [LineType, string];
    };
    padding?: [number, number];
};
export declare type Cell = {
    value: string | number;
    type?: string;
    style?: number;
    [property: string]: any;
} | string | number | null | undefined;
export declare type CellFunc = (rowIndex: number, colIndex: number) => Cell;
export declare type Row = {
    height: number;
    hide?: boolean;
    autoFit?: boolean;
    style?: number;
};
export declare type RowFunc = (index: number) => Row | undefined;
export declare type RowHeightFunc = (index: number) => number;
export declare type Col = {
    width: number;
    hide?: boolean;
    autoFit?: boolean;
    style?: number;
};
export declare type ColFunc = (index: number) => Col | undefined;
export declare type ColWidthFunc = (index: number) => number;
export declare type RowHeader = {
    width: number;
    cols: number;
    cell: CellFunc;
    merges?: string[];
};
export declare type ColHeader = {
    height: number;
    rows: number;
    cell: CellFunc;
    merges?: string[];
};
export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type AreaCell = {
    row: number;
    col: number;
} & Rect;
export declare type ViewportCell = {
    placement: 'all' | 'row-header' | 'col-header' | 'body';
} & AreaCell;
/**
 * ----------------------------------------------------------------
 * |            | column header                                   |
 * ----------------------------------------------------------------
 * |            |                                                 |
 * | row header |              body                               |
 * |            |                                                 |
 * ----------------------------------------------------------------
 * row { height, hide, autoFit }
 * col { width, hide, autoFit }
 * cell {
 *   value,
 *   style: {
 *     border, fontSize, fontName,
 *     bold, italic, color, bgcolor,
 *     align, valign, underline, strike,
 *     rotate, textwrap, padding,
 *   },
 *   type: text | button | link | checkbox | radio | list | progress | image | imageButton | date
 * }
 */
export default class TableRender {
    _target: HTMLCanvasElement;
    _width: number;
    _height: number;
    _scale: number;
    _rows: number;
    _cols: number;
    _rowHeight: number;
    _colWidth: number;
    _startRow: number;
    _startCol: number;
    _scrollRows: number;
    _scrollCols: number;
    /**
     * get row given rowIndex
     * @param {int} rowIndex
     * @returns Row | undefined
     */
    _row: RowFunc;
    /**
     * get col given colIndex
     * @param {int} coIndex
     * @returns Row | undefined
     */
    _col: ColFunc;
    /**
     * get cell given rowIndex, colIndex
     * @param {int} rowIndex
     * @param {int} colIndex
     * @returns Cell | string
     */
    _cell: CellFunc;
    _merges: string[];
    _styles: CellStyle[];
    _lineStyle: LineStyle;
    _cellStyle: CellStyle;
    _rowHeader: RowHeader;
    _colHeader: ColHeader;
    _headerLineStyle: LineStyle;
    _headerCellStyle: CellStyle;
    _freeze: [number, number];
    _freezeLineStyle: LineStyle;
    _viewport: Viewport | null;
    constructor(container: string | HTMLCanvasElement, width: number, height: number);
    render(): this;
    width(value: number): this;
    height(value: number): this;
    scale(value: number): this;
    rows(value: number): this;
    cols(value: number): this;
    rowHeight(value: number): this;
    colWidth(value: number): this;
    startRow(value: number): this;
    startCol(value: number): this;
    scrollRows(value: number): this;
    scrollCols(value: number): this;
    row(value: RowFunc): this;
    col(value: ColFunc): this;
    cell(value: (rowIndex: number, colIndex: number) => Cell): this;
    merges(value?: string[]): this;
    styles(value?: CellStyle[]): this;
    lineStyle(value: Partial<LineStyle>): this;
    cellStyle(value: Partial<CellStyle>): this;
    rowHeader(value?: Partial<RowHeader>): this;
    colHeader(value?: Partial<ColHeader>): this;
    headerLineStyle(value: Partial<LineStyle>): this;
    headerCellStyle(value?: Partial<CellStyle>): this;
    freeze(ref?: string): this;
    freezeLineStyle(value: Partial<LineStyle>): this;
    rowHeightAt(index: number): number;
    colWidthAt(index: number): number;
    get viewport(): Viewport | null;
    static create(container: string | HTMLCanvasElement, width: number, height: number): TableRender;
}
export { expr2xy, xy2expr, stringAt, Range, Viewport, Area, eachRanges, findRanges };
declare global {
    interface Window {
        wolf: any;
    }
}

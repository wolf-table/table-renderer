import { CellStyle, Rect, CellStyleBorder, Cell, Formatter, CellRenderer, BorderStyle } from '.';
import Canvas from './canvas';
export declare function cellBorderRender(canvas: Canvas, rect: Rect, border: CellStyleBorder | [BorderStyle, string], autoAlign?: boolean): void;
export declare function cellRender(canvas: Canvas, cell: Cell, rect: Rect, style: CellStyle, cellRenderer: CellRenderer | undefined, formatter: Formatter): void;
declare const _default: {};
export default _default;

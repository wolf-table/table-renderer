import { Style, Rect, BorderLineStyle, Cell, Formatter, CellRenderer, BorderLine } from '.';
import Canvas from './canvas';
export declare function cellBorderRender(canvas: Canvas, rect: Rect, borderLine: BorderLine | [BorderLineStyle, string], autoAlign?: boolean): void;
export declare function cellRender(canvas: Canvas, cell: Cell, rect: Rect, style: Style, cellRenderer: CellRenderer | undefined, formatter: Formatter): void;
declare const _default: {};
export default _default;

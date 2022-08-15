import { CellStyle, Rect, CellStyleBorder, LineType, Cell } from '.';
import Canvas from './canvas';
export declare function cellBorderRender(canvas: Canvas, rect: Rect, border: CellStyleBorder | [LineType, string], autoAlign?: boolean): void;
export declare function cellRender(canvas: Canvas, cell: Cell, rect: Rect, style: CellStyle): void;
declare const _default: {};
export default _default;

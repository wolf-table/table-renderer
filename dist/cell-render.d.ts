import { CellStyle, Rect, CellStyleBorder, LineType, Cell, CellFormatter, CellTypeRenderer } from '.';
import Canvas from './canvas';
export declare function cellBorderRender(canvas: Canvas, rect: Rect, border: CellStyleBorder | [LineType, string], autoAlign?: boolean): void;
export declare function cellRender(canvas: Canvas, cell: Cell, rect: Rect, style: CellStyle, cellTypeRenderer: CellTypeRenderer | undefined, cellFormatter: CellFormatter): void;
declare const _default: {};
export default _default;

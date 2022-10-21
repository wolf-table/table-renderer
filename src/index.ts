import { stringAt, expr2xy, xy2expr } from './alphabet';
import Canvas from './canvas';
import Range, { eachRanges, findRanges } from './range';
import { render } from './render';
import Viewport from './viewport';
import Area from './area';

export type Align = 'left' | 'right' | 'center';
export type VerticalAlign = 'top' | 'bottom' | 'middle';

export type GridlineStyle = 'solid' | 'dashed' | 'dotted';

export type Gridline = {
  width: number;
  color: string;
  style?: GridlineStyle;
};

export type TextLineType = 'underline' | 'strikethrough';

export type BorderType =
  | 'all'
  | 'inside'
  | 'horizontal'
  | 'vertical'
  | 'outside'
  | 'left'
  | 'top'
  | 'right'
  | 'bottom';

export type BorderLineStyle = 'thin' | 'medium' | 'thick' | 'dashed' | 'dotted';

export type BorderLine = {
  left?: [BorderLineStyle, string];
  top?: [BorderLineStyle, string];
  right?: [BorderLineStyle, string];
  bottom?: [BorderLineStyle, string];
};

// ref, type, style, color
export type Border = [string, BorderType, BorderLineStyle, string];

export type Style = {
  bgcolor: string;
  color: string;
  align: Align;
  valign: VerticalAlign;
  textwrap: boolean;
  underline: boolean;
  strikethrough: boolean;
  bold: boolean;
  italic: boolean;
  fontSize: number;
  fontFamily: string;
  rotate?: number;
  padding?: [number, number];
};

export type Cell =
  | {
      value?: string | number;
      type?: string;
      style?: number;
      format?: string;
      [property: string]: any;
    }
  | string
  | number
  | null
  | undefined;
export type CellGetter = (rowIndex: number, colIndex: number) => Cell;

export type Formatter = (value: string, format?: string) => string;

export type Row = {
  height: number;
  hide?: boolean;
  autoFit?: boolean;
  style?: number;
};

export type RowGetter = (index: number) => Row | undefined;
export type RowHeightGetter = (index: number) => number;

export type Col = {
  width: number;
  hide?: boolean;
  autoFit?: boolean;
  style?: number;
};

export type ColGetter = (index: number) => Col | undefined;
export type ColWidthGetter = (index: number) => number;

export type RowHeader = {
  width: number;
  cols: number;
  cell: CellGetter;
  cellRenderer?: CellRenderer;
  merges?: string[];
};

export type ColHeader = {
  height: number;
  rows: number;
  cell: CellGetter;
  cellRenderer?: CellRenderer;
  merges?: string[];
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AreaCell = {
  row: number;
  col: number;
} & Rect;

export type ViewportCell = {
  placement: 'all' | 'row-header' | 'col-header' | 'body';
} & AreaCell;

export type CellRenderer = (canvas: Canvas, rect: Rect, cell: Cell, text: string) => boolean;

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

export default class TableRenderer {
  _target: HTMLCanvasElement;

  // table width
  _width = 0;

  // table height
  _height = 0;

  _scale = 1;

  // the count of rows
  _rows = 100;

  // the count of cols;
  _cols = 26;

  // the row height (px)
  _rowHeight = 22;

  // the column width (px)
  _colWidth = 100;

  // row of the start position in table
  _startRow = 0;

  // col of the start position in table
  _startCol = 0;

  // count of rows scrolled
  _scrollRows = 0;

  // count of cols scrolled
  _scrollCols = 0;

  /**
   * get row given rowIndex
   * @param {int} rowIndex
   * @returns Row | undefined
   */
  _row: RowGetter = () => undefined;

  /**
   * get col given colIndex
   * @param {int} coIndex
   * @returns Row | undefined
   */
  _col: ColGetter = () => undefined;

  /**
   * get cell given rowIndex, colIndex
   * @param {int} rowIndex
   * @param {int} colIndex
   * @returns Cell | string
   */
  _cell: CellGetter = () => undefined;

  _cellRenderer: CellRenderer = () => true;

  _formatter: Formatter = (v) => v;

  _merges: string[] = [];

  _borders: Border[] = [];

  _styles: Partial<Style>[] = [];

  _gridline: Gridline = {
    width: 1,
    color: '#e6e6e6',
  };

  _style: Style = {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    underline: false,
    strikethrough: false,
    color: '#0a0a0a',
    bold: false,
    italic: false,
    rotate: 0,
    fontSize: 10,
    fontFamily: 'Source Sans Pro',
  };

  // row header
  _rowHeader: RowHeader = {
    width: 60,
    cols: 1,
    cell(rowIndex, colIndex) {
      return rowIndex + 1;
    },
  };

  // column header
  _colHeader: ColHeader = {
    height: 24,
    rows: 1,
    cell(rowIndex, colIndex) {
      return stringAt(colIndex);
    },
  };

  _headerGridline: Gridline = {
    width: 1,
    color: '#e6e6e6',
  };

  _headerStyle: Style = {
    bgcolor: '#f4f5f8',
    align: 'center',
    valign: 'middle',
    textwrap: true,
    underline: false,
    strikethrough: false,
    color: '#585757',
    bold: false,
    italic: false,
    rotate: 0,
    fontSize: 10,
    fontFamily: 'Source Sans Pro',
  };

  // freezed [cols, rows]
  _freeze: [number, number] = [0, 0];

  _freezeGridline: Gridline = {
    width: 2,
    color: '#d8d8d8',
  };

  // it can be used after rendering
  _viewport: Viewport | null = null;

  constructor(container: string | HTMLCanvasElement, width: number, height: number) {
    // const target = document.createElement('canvas');
    const target: HTMLCanvasElement | null =
      typeof container === 'string' ? document.querySelector(container) : container;
    if (!target) throw new Error('target error');
    this._target = target;
    this._width = width;
    this._height = height;
  }

  render() {
    this._viewport = new Viewport(this);
    render(this);
    return this;
  }

  width(value: number) {
    this._width = value;
    return this;
  }

  height(value: number) {
    this._height = value;
    return this;
  }

  scale(value: number) {
    this._scale = value;
    return this;
  }

  rows(value: number) {
    this._rows = value;
    return this;
  }

  cols(value: number) {
    this._cols = value;
    return this;
  }

  rowHeight(value: number) {
    this._rowHeight = value;
    return this;
  }

  colWidth(value: number) {
    this._colWidth = value;
    return this;
  }

  startRow(value: number) {
    this._startRow = value;
    return this;
  }

  startCol(value: number) {
    this._startCol = value;
    return this;
  }

  scrollRows(value: number) {
    this._scrollRows = value;
    return this;
  }

  scrollCols(value: number) {
    this._scrollCols = value;
    return this;
  }

  row(value: RowGetter) {
    this._row = value;
    return this;
  }

  col(value: ColGetter) {
    this._col = value;
    return this;
  }

  cell(value: (rowIndex: number, colIndex: number) => Cell) {
    this._cell = value;
    return this;
  }

  cellRenderer(value: CellRenderer) {
    this._cellRenderer = value;
    return this;
  }

  formatter(value: Formatter) {
    this._formatter = value;
    return this;
  }

  merges(value: string[]) {
    this._merges = value;
    return this;
  }

  styles(value: Partial<Style>[]) {
    this._styles = value;
    return this;
  }

  borders(value: Border[]) {
    this._borders = value;
    return this;
  }

  gridline(value?: Partial<Gridline>) {
    if (value) Object.assign(this._gridline, value);
    return this;
  }

  style(value?: Partial<Style>) {
    if (value) Object.assign(this._style, value);
    return this;
  }

  rowHeader(value?: Partial<RowHeader>) {
    if (value) Object.assign(this._rowHeader, value);
    return this;
  }

  colHeader(value?: Partial<ColHeader>) {
    if (value) Object.assign(this._colHeader, value);
    return this;
  }

  headerGridline(value?: Partial<Gridline>) {
    if (value) Object.assign(this._headerGridline, value);
    return this;
  }

  headerStyle(value?: Partial<Style>) {
    if (value) Object.assign(this._headerStyle, value);
    return this;
  }

  freeze(ref?: string) {
    if (ref) this._freeze = expr2xy(ref);
    return this;
  }

  freezeGridline(value?: Partial<Gridline>) {
    if (value) Object.assign(this._freezeGridline, value);
    return this;
  }

  // get methods ---- start ------
  rowHeightAt(index: number): number {
    const { _row } = this;
    if (_row) {
      const r = _row(index);
      if (r) return r.hide ? 0 : r.height;
    }
    return this._rowHeight;
  }

  colWidthAt(index: number): number {
    const { _col } = this;
    if (_col) {
      const c = _col(index);
      if (c) return c.hide ? 0 : c.width;
    }
    return this._colWidth;
  }

  get viewport() {
    return this._viewport;
  }
  // get methods ---- end -------

  static create(container: string | HTMLCanvasElement, width: number, height: number) {
    return new TableRenderer(container, width, height);
  }
}

export { expr2xy, xy2expr, stringAt, Canvas, Range, Viewport, Area, eachRanges, findRanges };

declare global {
  interface Window {
    wolf: any;
  }
}

try {
  if (window) {
    window.wolf ||= {};
    window.wolf.table_renderer = TableRenderer.create;
  }
} catch (e) {}

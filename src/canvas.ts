type LineStyleAttrs = {
  lineWidth: number;
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'round' | 'bevel' | 'miter';
  miterLimit: number;
  lineDashOffset: number;
};

type TextStyleAttrs = {
  font: string;
  textAlign: 'start' | 'end' | 'left' | 'right' | 'center';
  textBaseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  direction: 'ltr' | 'rtl' | 'inherit';
};

type FillStrokeStyleAttrs = {
  fillStyle: string;
  strokeStyle: string;
};

type ShadowAttrs = {
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
};

type CompositingAttrs = {
  globalAlpha: number;
  globalCompositeOperation: string;
};

type Attrs = LineStyleAttrs & TextStyleAttrs & FillStrokeStyleAttrs & ShadowAttrs & CompositingAttrs;

export default class Canvas {
  _target: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D;
  _scale: number;

  constructor(readonly target: HTMLCanvasElement, scale: number) {
    const ctx = target.getContext('2d');
    if (!ctx) throw new Error('getContext(2d) is null');
    this._ctx = ctx;
    this._scale = scale;
    this._target = target;
  }

  size(width: number, height: number) {
    const { _target, _scale } = this;
    // Set display size (css pixels).
    _target.style.width = `${width}px`;
    _target.style.height = `${height}px`;

    const dpr = window.devicePixelRatio;
    // Set actual size in memory (scaled to account for extra pixel density).
    _target.width = Math.floor(width * dpr);
    _target.height = Math.floor(height * dpr);

    // Normalize coordinate system to use css pixels.
    this._ctx.scale(dpr * _scale, dpr * _scale);
    return this;
  }

  // set this property value
  attr(values: Partial<Attrs>): Canvas;
  attr(key: keyof Attrs): any;
  attr(key: keyof Attrs, value: any): Canvas;
  attr(key: any, value?: any): any {
    if (value) {
      (this._ctx as any)[key] = value;
      return this;
    }
    if (typeof key === 'string') {
      return (this._ctx as any)[key];
    }
    Object.entries(key).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        (this._ctx as any)[k] = v;
      }
    });
    return this;
  }

  measureTextWidth(text: string) {
    return this.measureText(text).width;
  }

  // draw line
  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    style?: { type: 'thin' | 'medium' | 'thick' | 'dashed' | 'dotted'; color: string }
  ) {
    if (style) {
      this.attr({ lineWidth: 1, strokeStyle: style.color });
      if (style.type === 'medium') {
        this.attr({ lineWidth: 2 });
      } else if (style.type === 'thick') {
        this.attr({ lineWidth: 3 });
      } else if (style.type === 'dashed') {
        this.setLineDash([3, 2]);
      } else if (style.type === 'dotted') {
        this.setLineDash([1, 1]);
      }
    }
    this.moveTo(x1, y1).lineTo(x2, y2).stroke();
    return this;
  }

  // Drawing rectangles
  clearRect(x: number, y: number, width: number, height: number) {
    this._ctx.clearRect(x, y, width, height);
    return this;
  }

  fillRect(x: number, y: number, width: number, height: number) {
    this._ctx.fillRect(x, y, width, height);
    return this;
  }

  strokeRect(x: number, y: number, width: number, height: number) {
    this._ctx.strokeRect(x, y, width, height);
    return this;
  }

  // Drawing text
  fillText(text: string, x: number, y: number, maxWidth?: number) {
    this._ctx.fillText(text, x, y, maxWidth);
    return this;
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    this._ctx.strokeText(text, x, y, maxWidth);
    return this;
  }

  measureText(text: string) {
    return this._ctx.measureText(text);
  }

  // Line styles
  getLineDash() {
    return this._ctx.getLineDash();
  }

  setLineDash(segments: number[]) {
    this._ctx.setLineDash(segments);
    return this;
  }

  // Gradients and patterns
  createLinearGradient(x0: number, y0: number, x: number, y: number) {
    return this._ctx.createLinearGradient(x0, y0, x, y);
  }

  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
    return this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  createPattern(image: CanvasImageSource, repetition: string) {
    return this._ctx.createPattern(image, repetition);
  }

  // Paths
  beginPath() {
    this._ctx.beginPath();
    return this;
  }

  closePath() {
    this._ctx.closePath();
    return this;
  }

  moveTo(x: number, y: number) {
    this._ctx.moveTo(x, y);
    return this;
  }

  lineTo(x: number, y: number) {
    this._ctx.lineTo(x, y);
    return this;
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return this;
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.quadraticCurveTo(cpx, cpy, x, y);
    return this;
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ) {
    this._ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    return this;
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this._ctx.arcTo(x1, y1, x2, y2, radius);
    return this;
  }

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ) {
    this._ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
    return this;
  }

  rect(x: number, y: number, width: number, height: number) {
    this._ctx.rect(x, y, width, height);
    return this;
  }

  // Drawing paths
  fill(fillRule?: CanvasFillRule) {
    this._ctx.fill(fillRule);
    return this;
  }

  stroke() {
    this._ctx.stroke();
    return this;
  }

  clip(fillRule?: CanvasFillRule) {
    this._ctx.clip(fillRule);
    return this;
  }

  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule) {
    return this._ctx.isPointInPath(x, y, fillRule);
  }

  isPointInStroke(x: number, y: number) {
    return this._ctx.isPointInStroke(x, y);
  }

  // Transformations
  getTransform() {
    return this._ctx.getTransform();
  }

  rotate(angle: number) {
    this._ctx.rotate(angle);
    return this;
  }

  scale(x: number, y: number) {
    this._ctx.scale(x, y);
    return this;
  }

  translate(x: number, y: number) {
    this._ctx.translate(x, y);
    return this;
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this._ctx.setTransform(a, b, c, d, e, f);
    return this;
  }

  // Drawing images
  drawImage(image: CanvasImageSource, dx: number, dy: number) {
    this._ctx.drawImage(image, dx, dy);
    return this;
  }

  // Pixel manipulation
  createImageData(width: number, height: number) {
    return this._ctx.createImageData(width, height);
  }

  getImageData(sx: number, sy: number, sw: number, sh: number) {
    return this._ctx.getImageData(sx, sy, sw, sh);
  }

  putImageData(imageData: ImageData, dx: number, dy: number) {
    this._ctx.putImageData(imageData, dx, dy);
    return this;
  }

  // The canvas state
  save() {
    this._ctx.save();
    return this;
  }

  restore() {
    this._ctx.restore();
    return this;
  }
}

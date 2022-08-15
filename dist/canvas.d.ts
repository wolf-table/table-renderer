declare type LineStyleAttrs = {
    lineWidth: number;
    lineCap: 'butt' | 'round' | 'square';
    lineJoin: 'round' | 'bevel' | 'miter';
    miterLimit: number;
    lineDashOffset: number;
};
declare type TextStyleAttrs = {
    font: string;
    textAlign: 'start' | 'end' | 'left' | 'right' | 'center';
    textBaseline: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
    direction: 'ltr' | 'rtl' | 'inherit';
};
declare type FillStrokeStyleAttrs = {
    fillStyle: string;
    strokeStyle: string;
};
declare type ShadowAttrs = {
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
};
declare type CompositingAttrs = {
    globalAlpha: number;
    globalCompositeOperation: string;
};
declare type Attrs = LineStyleAttrs & TextStyleAttrs & FillStrokeStyleAttrs & ShadowAttrs & CompositingAttrs;
declare type BorderLineType = 'thin' | 'medium' | 'thick' | 'dashed' | 'dotted';
export declare function borderLineTypeToWidth(lineType: BorderLineType): 1 | 2 | 3;
export default class Canvas {
    readonly target: HTMLCanvasElement;
    _target: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _scale: number;
    constructor(target: HTMLCanvasElement, scale: number);
    size(width: number, height: number): this;
    attr(values: Partial<Attrs>): Canvas;
    attr(key: keyof Attrs): any;
    attr(key: keyof Attrs, value: any): Canvas;
    measureTextWidth(text: string): number;
    line(x1: number, y1: number, x2: number, y2: number, style?: {
        type: BorderLineType;
        color: string;
    }): this;
    clearRect(x: number, y: number, width: number, height: number): this;
    fillRect(x: number, y: number, width: number, height: number): this;
    strokeRect(x: number, y: number, width: number, height: number): this;
    fillText(text: string, x: number, y: number, maxWidth?: number): this;
    strokeText(text: string, x: number, y: number, maxWidth?: number): this;
    measureText(text: string): TextMetrics;
    getLineDash(): number[];
    setLineDash(segments: number[]): this;
    createLinearGradient(x0: number, y0: number, x: number, y: number): CanvasGradient;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null;
    beginPath(): this;
    closePath(): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): this;
    rect(x: number, y: number, width: number, height: number): this;
    roundRect(x: number, y: number, width: number, height: number, radius: number): this;
    fill(fillRule?: CanvasFillRule): this;
    stroke(): this;
    clip(fillRule?: CanvasFillRule): this;
    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInStroke(x: number, y: number): boolean;
    getTransform(): DOMMatrix;
    rotate(angle: number): this;
    scale(x: number, y: number): this;
    translate(x: number, y: number): this;
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): this;
    drawImage(image: CanvasImageSource, dx: number, dy: number): this;
    createImageData(width: number, height: number): ImageData;
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    putImageData(imageData: ImageData, dx: number, dy: number): this;
    save(): this;
    restore(): this;
}
export {};

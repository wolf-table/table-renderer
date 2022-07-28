import { Align, CellStyle, Rect, VerticalAlign, TextLineType } from '.';
import Canvas from './canvas';

// align: left | center | right
// width: the width of cell
// padding: the padding of cell
function textx(align: Align, width: number, padding: number) {
  switch (align) {
    case 'left':
      return padding;
    case 'center':
      return width / 2;
    case 'right':
      return width - padding;
    default:
      return 0;
  }
}

// align: top | middle | bottom
// height: the height of cell
// txtHeight: the height of text
// padding: the padding of cell
function texty(align: VerticalAlign, height: number, txtHeight: number, padding: number) {
  switch (align) {
    case 'top':
      return padding;
    case 'middle':
      return height / 2 - txtHeight / 2;
    case 'bottom':
      return height - padding - txtHeight;
    default:
      return 0;
  }
}

// type: underline | strike
// align: left | center | right
// valign: top | middle | bottom
function textLine(
  type: TextLineType,
  align: Align,
  valign: VerticalAlign,
  x: number,
  y: number,
  w: number,
  h: number
): [number, number, number, number] {
  // y
  let ty = 0;
  if (type === 'underline') {
    if (valign === 'top') {
      ty = -h;
    } else if (valign === 'middle') {
      ty = -h / 2;
    }
  } else if (type === 'strikethrough') {
    if (valign === 'top') {
      ty = -h / 2;
    } else if (valign === 'bottom') {
      ty = h / 2;
    }
  }
  // x
  let tx = 0;
  if (align === 'center') {
    tx = w / 2;
  } else if (align === 'right') {
    tx = w;
  }
  return [x - tx, y - ty, x - tx + w, y - ty];
}

function fontString(family: string, size: number, italic: boolean, bold: boolean) {
  if (family && size) {
    let font = '';
    if (italic) font += 'italic ';
    if (bold) font += 'bold ';
    return `${font} ${size}pt ${family}`;
  }
  return undefined;
}

// canvas: Canvas2d
// style:
export function cellRender(canvas: Canvas, text: string, rect: Rect, style: CellStyle) {
  const {
    border,
    fontSize,
    fontName,
    bold,
    italic,
    color,
    bgcolor,
    align,
    valign,
    underline,
    strikethrough,
    rotate,
    textwrap,
    padding,
  } = style;
  // at first move to (left, top)
  canvas.save().beginPath().translate(rect.x, rect.y);

  // border
  if (border) {
    const { top, right, bottom, left } = border;
    canvas.save();
    if (top) canvas.line(0, 0, rect.width, 0, { type: top[0], color: top[1] });
    if (right) canvas.line(rect.width, 0, rect.width, rect.height, { type: right[0], color: right[1] });
    if (bottom) canvas.line(0, rect.height, rect.width, rect.height, { type: bottom[0], color: bottom[1] });
    if (left) canvas.line(0, 0, 0, rect.height, { type: left[0], color: left[1] });
    canvas.restore();
  }

  // clip
  canvas
    .attr('fillStyle', bgcolor)
    .rect(0.5, 0.5, rect.width - 1, rect.height - 1)
    .clip()
    .fill();

  // text style
  canvas
    .save()
    .beginPath()
    .attr({
      textAlign: align,
      textBaseline: valign,
      font: fontString(fontName, fontSize, italic, bold),
      fillStyle: color,
    });

  // rotate
  if (rotate && rotate > 0) {
    canvas.rotate(rotate * (Math.PI / 180));
  }

  const [xp, yp] = padding || [5, 5];
  const tx = textx(align, rect.width, xp);
  const txts = text.split('\n');
  const innerWidth = rect.width - xp * 2;
  const ntxts: string[] = [];
  txts.forEach((it) => {
    const txtWidth = canvas.measureTextWidth(it);
    if (textwrap && txtWidth > innerWidth) {
      let txtLine = { w: 0, len: 0, start: 0 };
      for (let i = 0; i < it.length; i += 1) {
        if (txtLine.w > innerWidth) {
          ntxts.push(it.substr(txtLine.start, txtLine.len));
          txtLine = { w: 0, len: 0, start: i };
        }
        txtLine.len += 1;
        txtLine.w += canvas.measureTextWidth(it[i]) + 1;
      }
      if (txtLine.len > 0) {
        ntxts.push(it.substr(txtLine.start, txtLine.len));
      }
    } else {
      ntxts.push(it);
    }
  });

  const lineHeight = fontSize * 1.425;
  const txtHeight = (ntxts.length - 1) * lineHeight;
  const lineTypes: TextLineType[] = [];
  if (underline) lineTypes.push('underline');
  if (strikethrough) lineTypes.push('strikethrough');
  let ty = texty(valign, rect.height, txtHeight, yp);
  ntxts.forEach((it) => {
    const txtWidth = canvas.measureTextWidth(it);
    canvas.fillText(it, tx, ty);
    lineTypes.forEach((type) => {
      canvas.line(...textLine(type, align, valign, tx, ty, txtWidth, fontSize));
    });
    ty += lineHeight;
  });
  canvas.restore();

  canvas.restore();
}

export default {};

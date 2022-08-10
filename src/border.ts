import { Border, Area, Rect, BorderType } from '.';
import Range from './range';

export function borderRanges(area: Area, [ref, type]: Border, areaMerges: Range[]) {
  // render borders
  const ret: [Range, Rect, BorderType][] = [];
  const bRange = Range.with(ref);
  const intersectMerges = areaMerges.filter((it) => it.intersects(bRange));
  if (bRange.intersects(area.range) || intersectMerges.length > 0) {
    if (intersectMerges.length <= 0) {
      ret.push([bRange, area.rect(bRange), type]);
    } else {
      for (let merge of intersectMerges) {
        if (bRange.within(merge)) {
          if (
            bRange.startRow === merge.startRow &&
            bRange.startCol === merge.startCol &&
            type !== 'inside' &&
            type !== 'horizontal' &&
            type !== 'vertical'
          ) {
            ret.push([merge, area.rect(merge), type === 'all' ? 'outside' : type]);
          }
        } else if (
          type === 'outside' ||
          type === 'left' ||
          type === 'top' ||
          type === 'right' ||
          type === 'bottom'
        ) {
          ret.push([bRange, area.rect(bRange), type]);
          break;
        } else {
          bRange.difference(merge).forEach((it) => {
            if (it.intersects(area.range)) {
              const borderRect = area.rect(it);
              ret.push([it, borderRect, type]);
              if (type === 'inside' || type === 'horizontal') {
                if (it.startRow < merge.startRow && it.endRow < merge.startRow) {
                  // top
                  ret.push([it, borderRect, 'bottom']);
                } else if (it.startRow > merge.startRow && it.endRow > merge.startRow) {
                  // bottom
                  ret.push([it, borderRect, 'top']);
                }
              }
              if (type === 'inside' || type === 'vertical') {
                if (it.startCol < merge.startCol && it.endCol < merge.startCol) {
                  // left
                  ret.push([it, borderRect, 'right']);
                }
                if (it.startCol > merge.startCol && it.endCol > merge.startCol) {
                  // right
                  ret.push([it, borderRect, 'left']);
                }
              }
            }
          });
          if (type === 'all') {
            const borderRect = area.rect(merge);
            if (bRange.startRow === merge.startRow) {
              ret.push([merge, borderRect, 'top']);
            }
            if (bRange.endRow === merge.endRow) {
              ret.push([merge, borderRect, 'bottom']);
            }
            if (bRange.startCol === merge.startCol) {
              ret.push([merge, borderRect, 'left']);
            }
            if (bRange.endCol === merge.endCol) {
              ret.push([merge, borderRect, 'right']);
            }
          }
        }
      }
    }
  }
  return ret;
}

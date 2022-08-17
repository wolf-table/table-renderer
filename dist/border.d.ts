import { Border, Area, Rect, BorderType } from '.';
import Range from './range';
export declare function borderRanges(area: Area, [ref, type, ...borderOther]: Border, areaMerges: Range[]): [Range, Rect, BorderType][];

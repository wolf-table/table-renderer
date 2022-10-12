import TableRenderer, { ViewportCell } from '.';
import Area from './area';
export default class Viewport {
    /**
     * [area1, area2, area3, area4]
     * -----------------------
     * |  area-2   |   area-1
     * |-----------|----------
     * |  area-3   |   area-4
     * -----------------------
     */
    areas: Area[];
    /**
     * [area1, area21, area23, area3]
     *             |   area-21   | area-1
     * ------------|-----------------------
     *   area-23   |   body
     * ------------|
     *   area-3    |
     */
    headerAreas: Area[];
    _render: TableRenderer;
    constructor(render: TableRenderer);
    inAreas(row: number, col: number): boolean;
    cellAt(x: number, y: number): ViewportCell | null;
}

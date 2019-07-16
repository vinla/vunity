export interface Point2D {
    x: number;
    y: number;
}

export interface Size2D {
    width: number;
    height: number;
}

export interface Rect2D {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function distanceBetween(a: Point2D, b: Point2D) {
    var dx = Math.abs(a.x - b.x);
    var dy = Math.abs(a.y - b.y);
    return Math.sqrt( (dx * dx) + (dy * dy) );
}
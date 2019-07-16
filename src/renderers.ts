import { GameObjectComponent } from './vunity';
import { Rect2D, Point2D, Size2D } from './utility';

export class SpriteRenderer implements GameObjectComponent {
    shouldRender: true;
    enabled: true;
    parent: null;

    image: CanvasImageSource;
    sourceRect: Rect2D;

    constructor(image: CanvasImageSource, sourceRect: Rect2D) {
        this.image = image;
        this.sourceRect = sourceRect;
    }

    update = (elapsed: number) => {

    }

    draw = (drawingContext: CanvasRenderingContext2D, offset: Point2D) => {
        drawingContext.drawImage(
            this.image,
            this.sourceRect.x,
            this.sourceRect.y,
            this.sourceRect.width,
            this.sourceRect.height,
            offset.x,
            offset.y,
            this.sourceRect.width,
            this.sourceRect.height);
    }
}

export class BoxRenderer implements GameObjectComponent {
    size: Size2D;

    constructor(size: Size2D) {
        this.size = size;
    }

    update = (elapsed: number) => {

    }

    draw = (drawingContext: CanvasRenderingContext2D, offset: Point2D) => {
        drawingContext.fillRect(offset.x, offset.y, this.size.width, this.size.height);
    }

    shouldRender: true;

    enabled: false;

    parent: null;
}

export class EllipseRenderer implements GameObjectComponent {
    size: Size2D;

    constructor(size: Size2D) {
        this.size = size;
    }

    update = (elapsed: number) => {

    }

    draw = (ctx: CanvasRenderingContext2D, offset: Point2D) => {
        ctx.beginPath();
        ctx.ellipse(offset.x, offset.y, this.size.width, this.size.height, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    shouldRender: true;

    enabled: false;

    parent: null;
}
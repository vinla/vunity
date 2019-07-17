import { GameObjectComponent, GameObject } from './vunity';
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

export class AnimatedSpriteRender implements GameObjectComponent {
    shouldRender: true;
    enabled: true;
    parent: GameObject;

    image: CanvasImageSource;
    cells: Rect2D[];
    animations: Animation[];

    currentAnimation: Animation;
    currentIndex: number;
    framesLeft: number;

    constructor(image: CanvasImageSource, cells: Rect2D[]) {
        this.image = image;
        this.cells = cells;
        this.animations = [] as Animation[];
    }

    addAnimation = (animation: Animation) => {
        this.animations.push(animation);
    }

    startAnimation = (name: string) => {
        const match = this.animations.filter(anim => anim.name === name);
        if (match.length === 0)
            return;
        this.currentAnimation = match[0];
        this.currentIndex = 0;
        this.framesLeft = this.currentAnimation.frames[0].frames;
    }

    update = (elapsed: number) => {
        if (this.animations.length < 1)
            return;

        if (this.currentIndex < 0)
            return;

        this.framesLeft--;

        if (this.framesLeft < 0) {
            this.currentIndex = (this.currentIndex + 1) % this.currentAnimation.frames.length;
            this.framesLeft = this.currentAnimation.frames[this.currentIndex].frames;
        }
    }

    draw = (drawingContext: CanvasRenderingContext2D, offset: Point2D) => {
        if (this.animations.length < 1)
            return;

        const frame = this.currentAnimation.frames[this.currentIndex];
        const sourceRect = this.cells[frame.cellIndex];

        drawingContext.drawImage(
            this.image,
            sourceRect.x,
            sourceRect.y,
            sourceRect.width,
            sourceRect.height,
            offset.x,
            offset.y,
            sourceRect.width,
            sourceRect.height);
    }
}

export interface Animation {
    name: string;
    frames: AnimationFrame[];
}

export interface AnimationFrame {
    cellIndex: number;
    frames: number;
}

export class BoxRenderer implements GameObjectComponent {
    size: Size2D;
    colorCode: string;

    constructor(size: Size2D, colorCode: string) {
        this.size = size;
        this.colorCode = colorCode;
    }

    update = (elapsed: number) => {

    }

    draw = (drawingContext: CanvasRenderingContext2D, offset: Point2D) => {
        drawingContext.fillStyle = this.colorCode;
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
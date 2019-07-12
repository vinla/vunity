export class Scene {
    sceneObjects: GameObject[];
    previousFrame: number;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.sceneObjects = [] as GameObject[];
    }

    addObject = (object: GameObject) => {
        this.sceneObjects.push(object);
    }

    run = () => {
        window.requestAnimationFrame(this.frame);
    }

    frame = (timestamp: number) => {
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.previousFrame) this.previousFrame = timestamp;
        const elapsed = (timestamp - this.previousFrame) / 1000;
        this.sceneObjects.forEach(go => {
            go.update(elapsed);
        });

        this.sceneObjects.forEach(go => {
            go.draw(context);
        });
        this.previousFrame = timestamp;
        window.requestAnimationFrame(this.frame);
    }
}

export interface GameObjectComponent {
    parent: GameObject;
    update: (elapsed: number) => void;
    draw: (drawingContext: CanvasRenderingContext2D, offset: Point2D) => void;
    enabled: boolean;
    shouldRender: boolean;
}

interface Point2D {
    x: number;
    y: number;
}

interface Size2D {
    width: number;
    height: number;
}

interface Rect2D {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class GameObject {
    position: Point2D;
    components: GameObjectComponent[];

    constructor(position: Point2D) {
        this.position = position;
        this.components = [] as GameObjectComponent[];
    }

    addComponent = (component: GameObjectComponent) => {
        component.parent = this;
        this.components.push(component);
    }

    update = (elapsed: number) => {
        this.components.forEach(component => {
            component.update(elapsed);
        });
    }

    draw = (drawingContext: CanvasRenderingContext2D) => {
        this.components.forEach(component => {
            component.draw(drawingContext, this.position);
        });
    }
}

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

export class Mover implements GameObjectComponent {
    speed: number;
    shouldRender: false;
    enabled: true;
    parent: GameObject;

    constructor(speed: number) {
        this.speed = speed;
    }

    update = (elapsed: number) => {
        this.parent.position.x += this.speed * elapsed;
    }

    draw = (_: CanvasRenderingContext2D) => {

    }
}
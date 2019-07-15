import InputManager from './input-manager';

export class Scene {
    sceneObjects: GameObject[];
    previousFrame: number;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.sceneObjects = [] as GameObject[];
    }

    addObject = (object: GameObject) => {
        object.scene = this;
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
    handleCollision?: (collider: GameObject) => void;
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

function distanceBetween(a: Point2D, b: Point2D) {
    var dx = Math.abs(a.x - b.x);
    var dy = Math.abs(a.y - b.y);
    return Math.sqrt( (dx * dx) + (dy * dy) );
}

export class GameObject {
    scene: Scene;
    position: Point2D;
    components: GameObjectComponent[];
    collider?: Collider;
    collidedWith: GameObject[];

    constructor(position: Point2D) {
        this.position = position;
        this.components = [] as GameObjectComponent[];
        this.collidedWith = [] as GameObject[];
    }

    addComponent = (component: GameObjectComponent) => {
        component.parent = this;
        this.components.push(component);
    }

    update = (elapsed: number) => {

        if (this.collider) {
            const colls = this.collider.checkCollision(this.scene.sceneObjects.filter(g => g !== this)) as GameObject[];
            this.collidedWith = this.collidedWith.concat(colls);
        }

        this.components.forEach(component => {
            component.update(elapsed);
        });

        if (this.collidedWith.length > 0) {
            this.components.forEach(component => {
                if (component.handleCollision) {
                    this.collidedWith.forEach(c => component.handleCollision(c));
                }
            });
            this.collidedWith = [] as GameObject[];
        }
    }

    draw = (drawingContext: CanvasRenderingContext2D) => {
        this.components.forEach(component => {
            component.draw(drawingContext, this.position);
        });
    }

    registerCollision = (collider: GameObject) => {
        if (collider !== this)
            this.collidedWith.push(collider);
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

export class Mover implements GameObjectComponent {
    velocity: Point2D;
    shouldRender: false;
    enabled: true;
    parent: GameObject;

    constructor(velocity: Point2D) {
        this.velocity = velocity;
    }

    update = (elapsed: number) => {
        this.parent.position.x += this.velocity.x * elapsed;
        this.parent.position.y += this.velocity.y * elapsed;
    }

    draw = (_: CanvasRenderingContext2D) => {

    }
}

export class BasicController implements GameObjectComponent {
    speed: number;
    shouldRender: false;
    enabled: true;
    parent: GameObject;
    cooldown: number;

    constructor(speed: number) {
        this.speed = speed;
        this.cooldown = 0;
    }

    update = (elapsed: number) => {
        if (InputManager.keysPressed.indexOf('Right') > -1)
            this.parent.position.x += this.speed * elapsed;
        // else if (InputManager.keysPressed.indexOf('Left') > -1)
        //     this.parent.position.x -= this.speed * elapsed;
        else if (InputManager.keysPressed.indexOf('Left') > -1 && this.cooldown <= 0) {
            var bullet = new GameObject({...this.parent.position});
            bullet.addComponent(new EllipseRenderer({width: 4, height: 4}));
            bullet.addComponent(new Mover({x: 0, y: -25}));
            bullet.collider = new CircleCollider(bullet, 4);
            this.parent.scene.addObject(bullet);
            this.cooldown = 250;
        }

        if (this.cooldown > 0)
            this.cooldown -= elapsed;
    }

    draw = (_: CanvasRenderingContext2D) => {

    }
}

export class CircleCollider {
    parent: GameObject;
    radius: number;
    type: 'circle';

    constructor(parent: GameObject, size: number) {
        this.parent = parent;
        this.radius = size;
    }

    checkCollision = (targets: GameObject[]) => {
        var hits = [] as GameObject[];
        alert(this.type);
        targets.forEach(go => {
            if (go.collider) {
                if (go.collider.type === 'circle' && isCollidingA(this, go.collider)) {
                    hits.push(go);
                }
                else if (go.collider.type === 'box' && isCollidingB(this, go.collider)) {
                    hits.push(go);
                }
            }
        return hits;
        });
    }
}

function isCollidingA(a: CircleCollider, b: CircleCollider) {
    var distance = distanceBetween(a.parent.position, b.parent.position);
    return distance < a.radius || distance < b.radius;
}

function isCollidingB(a: CircleCollider, b: BoxCollider) {
    var point = b.parent.position;
    if (pointInCircle(a.parent.position, a.radius, point))
        return true;
    point.y += b.size.height;
    if (pointInCircle(a.parent.position, a.radius, point))
        return true;
    point.x += b.size.width;
    if (pointInCircle(a.parent.position, a.radius, point))
        return true;
    point.y -= b.size.height;
    if (pointInCircle(a.parent.position, a.radius, point))
        return true;
    return false;
}

function pointInCircle(origin: Point2D, radius: number, point: Point2D) {
    return distanceBetween(origin, point) < radius;
}

export class BoxCollider {
    parent: GameObject;
    size: Size2D;
    type: 'box';

    constructor(parent: GameObject, size: Size2D) {
        this.parent = parent;
        this.size = size;
    }

    checkCollision = (targets: GameObject[]) => {
        return [] as GameObject[];
    }
}

type Collider = CircleCollider | BoxCollider;

export class BulletController implements GameObjectComponent {
    shouldRender: false;
    enabled: true;
    parent: GameObject;
    speed: number;

    update = (elapsed: number) => {

    }

    draw = (_: CanvasRenderingContext2D) => {

    }

    handleCollision = (collider: GameObject) => {
        alert('Boom');
    }
}
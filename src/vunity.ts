import InputManager from './input-manager';
import { Collider } from './colliders';
import { Point2D } from './utility';


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

        this.sceneObjects = this.sceneObjects.filter(obj => !obj.destroyed);

        this.sceneObjects.forEach(go => {
            go.update(elapsed);
        });

        this.sceneObjects.forEach(go => {
            go.draw(context);
        });

        this.sceneObjects.forEach(go => {
            go.lateUpdate(elapsed);
        });

        this.previousFrame = timestamp;
        window.requestAnimationFrame(this.frame);
    }
}

export interface GameObjectComponent {
    parent: GameObject;
    update?: (elapsed: number) => void;
    draw?: (drawingContext: CanvasRenderingContext2D, offset: Point2D) => void;
    handleCollision?: (collider: GameObject) => void;
    lateUpdate?: (elapsed: number) => void;
}

export class GameObject {
    parent?: GameObject;
    scene: Scene;
    position: Point2D;
    components: GameObjectComponent[];
    collider?: Collider;
    collidedWith: GameObject[];
    destroyed: boolean;
    state: {[index: string]: any};

    constructor(position: Point2D) {
        this.position = position;
        this.components = [] as GameObjectComponent[];
        this.collidedWith = [] as GameObject[];
        this.destroyed = false;
        this.state = {};
    }

    addComponent = (component: GameObjectComponent) => {
        component.parent = this;
        this.components.push(component);
    }

    getPosition = (): Point2D => {
        if (this.parent) {
            const parentPosition = this.parent.getPosition();
            return {x: parentPosition.x + this.position.x, y: parentPosition.y + this.position.y};
        }

        return this.position;
    }

    update = (elapsed: number) => {

        if (this.collider) {
            const colls = this.collider.checkCollision(this.scene.sceneObjects.filter(g => g !== this)) as GameObject[];
            this.collidedWith = this.collidedWith.concat(colls);
        }

        if (this.collidedWith.length > 0) {
            this.components.forEach(component => {
                if (component.handleCollision) {
                    this.collidedWith.forEach(c => component.handleCollision(c));
                }
            });
            this.collidedWith = [] as GameObject[];
        }

        this.components.filter(c => c.update).forEach(component => {
            component.update(elapsed);
        });
    }

    lateUpdate = (elapsed: number) => {
        this.components.filter(c => c.lateUpdate).forEach(c => c.lateUpdate(elapsed));
    }

    draw = (drawingContext: CanvasRenderingContext2D) => {
        this.components.filter(c => c.draw).forEach(component => {
            component.draw(drawingContext, this.position);
        });
    }

    registerCollision = (collider: GameObject) => {
        if (collider !== this)
            this.collidedWith.push(collider);
    }
}

export class Mover implements GameObjectComponent {
    velocity: Point2D;
    parent: GameObject;

    constructor(velocity: Point2D) {
        this.velocity = velocity;
    }

    update = (elapsed: number) => {
        this.parent.position.x += this.velocity.x * elapsed;
        this.parent.position.y += this.velocity.y * elapsed;
    }
}
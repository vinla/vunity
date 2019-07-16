import { GameObject } from './vunity';
import { distanceBetween, Point2D, Size2D } from './utility';

export class CircleCollider implements Collider {
    parent: GameObject;
    radius: number;
    type: string = 'circle';

    constructor(parent: GameObject, size: number) {
        this.parent = parent;
        this.radius = size;
    }

    checkCollision = (targets: GameObject[]) => {
        var hits = [] as GameObject[];
        targets.forEach(go => {
            if (go.collider) {
                if (go.collider.type === 'circle' && isCollidingA(this, go.collider as CircleCollider)) {
                    hits.push(go);
                }
                else if (go.collider.type === 'box' && isCollidingB(this, go.collider as BoxCollider)) {
                    hits.push(go);
                }
            }
        });
        return hits;
    }
}

function isCollidingA(a: CircleCollider, b: CircleCollider) {
    var distance = distanceBetween(a.parent.position, b.parent.position);
    return distance < a.radius + b.radius;
}

function isCollidingB(a: CircleCollider, b: BoxCollider) {
    const circle = {
        x: a.parent.position.x,
        y: a.parent.position.y,
        r: a.radius
    };

    const rect = {
        x: b.parent.position.x,
        y: b.parent.position.y,
        w: b.size.width,
        h: b.size.height
    };

    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

function pointInCircle(origin: Point2D, radius: number, point: Point2D) {
    return distanceBetween(origin, point) < radius;
}

export class BoxCollider implements Collider {
    parent: GameObject;
    size: Size2D;
    type: string = 'box';

    constructor(parent: GameObject, size: Size2D) {
        this.parent = parent;
        this.size = size;
    }

    checkCollision = (targets: GameObject[]) => {
        return [] as GameObject[];
    }
}

export interface Collider {
    type: string;
    checkCollision: (targets: GameObject[]) => GameObject[];
}
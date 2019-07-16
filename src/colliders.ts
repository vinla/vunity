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
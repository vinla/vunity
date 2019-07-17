import { GameObjectComponent, GameObject } from './vunity';
import { BoxCollider } from './colliders';
import { Point2D } from './utility';

export class PlatformController implements GameObjectComponent {
    parent: GameObject;

    update = (elapsed: number) => {
        this.parent.position.y += 80 * elapsed;
    }

    lateUpdate = (elapsed: number) => {
        this.parent.state['grounded'] = false;
    }

    handleCollision = (collider: GameObject) => {

        if (collider.state['layer'] !== 'platform')
            return;

        if (collider.position.y > this.parent.position.y) {
            // Collider is below the player so adjust position up
            const box = collider.collider as BoxCollider;
            const thisBox = this.parent.collider as BoxCollider;
            this.parent.position.y = collider.position.y - thisBox.size.height;
            this.parent.state['grounded'] = true;
        }
    }
}

export class ResetOnTouch implements GameObjectComponent {
    parent: GameObject;
    point: Readonly<Point2D>;

    constructor(point: Point2D) {
        this.point = point;
    }

    handleCollision = (collider: GameObject) => {
        if (collider.state['isPlayer']) {
            collider.position = this.point;
        }
    }
}
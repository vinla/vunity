import { GameObjectComponent, GameObject } from './vunity';
import { BoxCollider } from './colliders';

export class PlatformController implements GameObjectComponent {
    parent: GameObject;

    update = (elapsed: number) => {
        this.parent.position.y += 80 * elapsed;
    }

    lateUpdate = (elapsed: number) => {
        this.parent.state['grounded'] = false;
    }

    handleCollision = (collider: GameObject) => {
        if (collider.position.y > this.parent.position.y) {
            // Collider is below the player so adjust position up
            const box = collider.collider as BoxCollider;
            const thisBox = this.parent.collider as BoxCollider;
            this.parent.position.y = collider.position.y - thisBox.size.height;
            this.parent.state['grounded'] = true;
        }
    }
}

export class DeathPlane implements GameObjectComponent {
    parent: GameObject;

    handleCollision = (collider: GameObject) => {
        if (collider.state['isPlayer']) {
            collider.position = {x: 32, y: 32};
        }
    }
}
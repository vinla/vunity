import { GameObjectComponent, GameObject, Mover } from './vunity';
import InputManager from './input-manager';
import { EllipseRenderer } from './renderers';
import { CircleCollider } from './colliders';
import { Rect2D } from './utility';

export class HorizontalMovementController implements GameObjectComponent {
    speed: number;
    parent: GameObject;

    constructor(speed: number) {
        this.speed = speed;
    }

    update = (elapsed: number) => {
        if (InputManager.keysPressed.indexOf('Right') > -1) {
            this.parent.position.x += this.speed * elapsed;
            this.parent.state['direction'] = 'Right';
        }
        else if (InputManager.keysPressed.indexOf('Left') > -1) {
            this.parent.position.x -= this.speed * elapsed;
            this.parent.state['direction'] = 'Left';
        }
    }
}

export class JumpController implements GameObjectComponent {
    parent: GameObject;
    jumpKey: string = 'Space';
    jumpForce: number = 0;

    update = (elapsed: number) => {
        if (InputManager.keysPressed.indexOf(this.jumpKey) > -1 && this.parent.state['grounded']) {
            this.jumpForce = 1;
        }

        if (this.jumpForce > 0) {
            this.parent.position.y -= this.jumpForce * 250 * elapsed;
            this.jumpForce -= elapsed;
        }
    }
}

export class ShootingController implements GameObjectComponent {
    parent: GameObject;
    fireKey: string = 'Shoot';
    cooldown: number = 0;

    update = (elapsed: number) => {
        if (this.cooldown > 0) {
            this.cooldown -= elapsed;
            return;
        }

        if (InputManager.keysPressed.indexOf(this.fireKey) > -1) {
            const origin = {x: this.parent.position.x + 8, y: this.parent.position.y + 16};
            const bullet = new GameObject(origin);
            if (this.parent.state['direction'] === 'Left')
                bullet.addComponent(new Mover({x: -200, y: 0}));
            else
                bullet.addComponent(new Mover({x: 200, y: 0}));
            bullet.addComponent(new EllipseRenderer({width: 4, height: 4}));
            bullet.addComponent(new BulletController('isEnemy'));
            bullet.addComponent(new DestoryOnOOB({x: 0, y: 0, width: 640, height: 480}));
            bullet.collider = new CircleCollider(bullet, 2);
            this.parent.scene.addObject(bullet);
            this.cooldown = .5;
        }
    }
}

export class DestoryOnOOB implements GameObjectComponent {
    parent: GameObject;
    bounds: Rect2D;

    constructor(bounds: Rect2D) {
        this.bounds = bounds;
    }

    update = (elapsed: number) => {
        if (this.parent.position.x < this.bounds.x || this.parent.position.x > this.bounds.x + this.bounds.width ||
            this.parent.position.y < this.bounds.y || this.parent.position.y > this.bounds.y + this.bounds.height) {
                this.parent.destroyed = true;
            }
    }
}

export class BulletController implements GameObjectComponent {
    parent: GameObject;
    speed: number;
    targetTag: string;

    constructor (targetTag: string) {
        this.targetTag = targetTag;
    }

    handleCollision = (collider: GameObject) => {
        if (collider.state[this.targetTag]) {
            collider.destroyed = true;
            this.parent.destroyed = true;
        }
    }
}
import { GameObjectComponent, GameObject, Mover } from './vunity';
import { EllipseRenderer } from './renderers';
import { CircleCollider } from './colliders';
import InputManager from './input-manager';

export class BasicController implements GameObjectComponent {
    speed: number;
    shouldRender: false;
    enabled: true;
    parent: GameObject;
    cooldown: number;
    jumpForce: number;

    constructor(speed: number) {
        this.speed = speed;
        this.cooldown = 0;
        this.jumpForce = 0;
    }

    update = (elapsed: number) => {
        if (InputManager.keysPressed.indexOf('Right') > -1)
            this.parent.position.x += this.speed * elapsed;
        else if (InputManager.keysPressed.indexOf('Left') > -1)
            this.parent.position.x -= this.speed * elapsed;

        if (InputManager.keysPressed.indexOf('Space') > -1 && this.parent.state['grounded']) {
            this.jumpForce = 1;
            // var bullet = new GameObject({...this.parent.position});
            // bullet.addComponent(new EllipseRenderer({width: 4, height: 4}));
            // bullet.addComponent(new Mover({x: 0, y: -50}));
            // bullet.addComponent(new BulletController());
            // bullet.collider = new CircleCollider(bullet, 4);
            // this.parent.scene.addObject(bullet);
            // this.cooldown = .5;
        }

        if (this.jumpForce > 0) {
            this.parent.position.y -= this.jumpForce * 250 * elapsed;
            this.jumpForce -= elapsed;
        }

        if (this.cooldown > 0)
            this.cooldown -= elapsed;
    }
}

export class BulletController implements GameObjectComponent {
    shouldRender: false;
    enabled: true;
    parent: GameObject;
    speed: number;

    handleCollision = (collider: GameObject) => {
        collider.destroyed = true;
        this.parent.destroyed = true;
    }
}
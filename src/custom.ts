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
            bullet.addComponent(new BulletController());
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
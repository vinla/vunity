import * as Vunity from '../vunity';
import { BoxRenderer } from '../renderers';
import { BoxCollider } from '../colliders';
import { PlatformController, ResetOnTouch, GoalOnTouch } from '../simple-platformer';
import { HorizontalMovementController, JumpController, ShootingController } from '../controllers';
import { createBlock, Point2D } from '../utility';
import { spawn } from 'child_process';

class Bouncer implements Vunity.GameObjectComponent {
    parent: Vunity.GameObject;
    velocity: Point2D;

    constructor(velocity: Point2D) {
        this.velocity = velocity;
    }

    update = (elapsed: number) => {
        if (this.parent.position.x < 8 || this.parent.position.x > 640 - 12)
            this.velocity.x = this.velocity.x * -1;

        if (this.parent.position.y < 8 || this.parent.position.y > 480 - 32)
            this.velocity.y = this.velocity.y * -1;

        this.parent.position.x += this.velocity.x * elapsed;
        this.parent.position.y += this.velocity.y * elapsed;
    }
}

class BouncerSpawn implements Vunity.GameObjectComponent {
    parent: Vunity.GameObject;
    interval: number = 5;
    countdown: number = 5;

    update = (elapsed: number) => {
        if (this.countdown < 0) {
            this.spawnBouncer();
            this.countdown = this.interval;
        }
        else {
            this.countdown -= elapsed;
            console.log(this.countdown);
        }
    }

    spawnBouncer = () => {
        let velocityX = 100 + (Math.random() * 100);
        let velocityY = 100 + (Math.random() * 100);
        if (Math.random() > .5)
            velocityX = velocityX * -1;
        if (Math.random() > .5)
            velocityY = velocityY * -1;

        const bouncer = new Vunity.GameObject({...this.parent.position});
        bouncer.state['isEnemy'] = true;
        bouncer.addComponent(new BoxRenderer({width: 24, height: 24}, '#785252'));
        bouncer.collider = new BoxCollider(bouncer, {width: 24, height: 24});
        bouncer.addComponent(new Bouncer({x: velocityX, y: velocityY}));
        this.parent.scene.addObject(bouncer);
    }
}

const start = {x: 32, y: 288};

const player = new Vunity.GameObject({...start});
player.state['isPlayer'] = true;
player.addComponent(new BoxRenderer({width: 16, height: 32}, '#4287f5'));
player.addComponent(new PlatformController());
player.addComponent(new HorizontalMovementController(60));
player.addComponent(new JumpController());
player.addComponent(new ShootingController());
player.collider = new BoxCollider(player, {width: 16, height: 32});

const spawner = new Vunity.GameObject({x: 200, y: 200});
spawner.addComponent(new BouncerSpawn());

const floor = createBlock({x: 0, y: 460, width: 640, height: 20});

const scene = new Vunity.Scene(document.getElementById('canvas') as HTMLCanvasElement);
scene.addObject(player);
scene.addObject(spawner);
scene.addObject(floor);

export default scene;
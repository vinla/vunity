import * as Vunity from './vunity';
import InputManager from './input-manager';
import { EllipseRenderer, BoxRenderer } from './renderers';
import { CircleCollider, BoxCollider } from './colliders';
import { BasicController } from './custom';

InputManager.init();

 const block = new Vunity.GameObject({x: 32, y: 32});
 block.addComponent(new BoxRenderer({width: 32, height: 32}));
 block.collider = new BoxCollider(block, {width: 128, height: 32});

const player = new Vunity.GameObject({x: 64, y: 256});
player.addComponent(new BoxRenderer({width: 64, height: 64}));
player.addComponent(new BasicController(25));


const scene = new Vunity.Scene(document.getElementById('canvas') as HTMLCanvasElement);
scene.addObject(player);

for ( let i = 0; i < 6; i++ ) {
    const block = new Vunity.GameObject({x: 32 * i, y: 32});
    block.addComponent(new BoxRenderer({width: 32, height: 32}));
    block.collider = new BoxCollider(block, {width: 32, height: 32});
    scene.addObject(block);
}

scene.run();
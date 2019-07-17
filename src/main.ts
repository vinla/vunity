import * as Vunity from './vunity';
import InputManager from './input-manager';
import { BoxRenderer } from './renderers';
import { BoxCollider } from './colliders';
import { PlatformController, DeathPlane } from './simple-platformer';
import { BasicController } from './custom';
import { Rect2D } from './utility';

InputManager.init();

const player = new Vunity.GameObject({x: 32, y: 32});
player.state['isPlayer'] = true;
player.addComponent(new BoxRenderer({width: 16, height: 32}));
player.addComponent(new PlatformController());
player.addComponent(new BasicController(60));
player.collider = new BoxCollider(player, {width: 16, height: 32});

const deathPlane = new Vunity.GameObject({x: 0, y: 460});
deathPlane.addComponent(new DeathPlane());
deathPlane.collider = new BoxCollider(deathPlane, {width: 640, height: 20});

const scene = new Vunity.Scene(document.getElementById('canvas') as HTMLCanvasElement);
scene.addObject(player);
scene.addObject(deathPlane);
scene.addObject(createBlock({x: 0, y: 320, width: 320, height: 32}));
scene.addObject(createBlock({x: 400, y: 296, width: 160, height: 32}));
scene.run();

function createBlock(rect: Rect2D) {
    const block = new Vunity.GameObject(rect);
    block.addComponent(new BoxRenderer(rect));
    block.collider = new BoxCollider(block, rect);
    return block;
}
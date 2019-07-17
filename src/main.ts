import * as Vunity from './vunity';
import InputManager from './input-manager';
import { BoxRenderer } from './renderers';
import { BoxCollider } from './colliders';
import { PlatformController, ResetOnTouch } from './simple-platformer';
import { BasicController } from './custom';
import { Rect2D } from './utility';

InputManager.init();

const start = {x: 32, y: 288};

const player = new Vunity.GameObject({...start});
player.state['isPlayer'] = true;
player.addComponent(new BoxRenderer({width: 16, height: 32}, '#4287f5'));
player.addComponent(new PlatformController());
player.addComponent(new BasicController(60));
player.collider = new BoxCollider(player, {width: 16, height: 32});

const deathPlane = new Vunity.GameObject({x: 0, y: 460});
deathPlane.addComponent(new ResetOnTouch(start));
deathPlane.collider = new BoxCollider(deathPlane, {width: 640, height: 20});

const scene = new Vunity.Scene(document.getElementById('canvas') as HTMLCanvasElement);
scene.addObject(player);
scene.addObject(deathPlane);
scene.addObject(createBlock({x: 0, y: 320, width: 320, height: 16}));
scene.addObject(createBlock({x: 390, y: 296, width: 146, height: 16}));
scene.addObject(createBlock({x: 440, y: 280, width: 96, height: 16}));
scene.addObject(createBlock({x: 464, y: 264, width: 72, height: 16}));
scene.addObject(createBlock({x: 300, y: 212, width: 96, height: 16}));
scene.addObject(createBlock({x: 160, y: 212, width: 96, height: 16}));
scene.addObject(createKillBlock({x: 200, y: 288, width: 32, height: 32}));
scene.run();

function createBlock(rect: Rect2D) {
    const block = new Vunity.GameObject(rect);
    block.addComponent(new BoxRenderer(rect, '#000000'));
    block.collider = new BoxCollider(block, rect);
    block.state['layer'] = 'platform';
    return block;
}

function createKillBlock(rect: Rect2D) {
    const block = new Vunity.GameObject(rect);
    block.addComponent(new BoxRenderer(rect, '#d1440d'));
    block.addComponent(new ResetOnTouch(start));
    block.collider = new BoxCollider(block, rect);
    return block;
}
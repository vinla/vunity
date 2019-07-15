import * as Vunity from './vunity';
import InputManager from './input-manager';

InputManager.init();

 const block = new Vunity.GameObject({x: 32, y: 32});
 block.addComponent(new Vunity.BoxRenderer({width: 128, height: 32}));
 block.collider = new Vunity.BoxCollider(block, {width: 128, height: 32});

 const sun = new Vunity.GameObject({x: 32, y: 32});
 sun.addComponent(new Vunity.EllipseRenderer({width: 64, height: 64}));
 sun.collider = new Vunity.CircleCollider(sun, 64);
// const block2 = new Vunity.GameObject({x: 32, y: 320});
// block2.addComponent(new Vunity.BoxRenderer({width: 64, height: 64}));

const sprite = new Image();
sprite.src = './images/player.gif';
const player = new Vunity.GameObject({x: 64, y: 256});
// player.addComponent(new Vunity.SpriteRenderer(sprite, {x: 0, y: 0, width: 64, height: 64}));
player.addComponent(new Vunity.BoxRenderer({width: 64, height: 64}));
player.addComponent(new Vunity.BasicController(25));


const scene = new Vunity.Scene(document.getElementById('canvas') as HTMLCanvasElement);
scene.addObject(sun);
// scene.addObject(block2);
scene.addObject(player);
scene.run();
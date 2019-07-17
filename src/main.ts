import * as Vunity from './vunity';
import InputManager from './input-manager';
import { Animation, BoxRenderer, AnimationFrame, AnimatedSpriteRender } from './renderers';
import { BoxCollider } from './colliders';
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

const cat = new Vunity.GameObject({x: 128, y: 256});
const spriteSheet = new Image();
spriteSheet.src = '/images/runningcat.png';

const runningAnimation = {name: 'run', frames: [] as AnimationFrame[]};
runningAnimation.frames.push({cellIndex: 0, frames: 4});
runningAnimation.frames.push({cellIndex: 1, frames: 4});
runningAnimation.frames.push({cellIndex: 2, frames: 4});
runningAnimation.frames.push({cellIndex: 3, frames: 4});
runningAnimation.frames.push({cellIndex: 4, frames: 4});
runningAnimation.frames.push({cellIndex: 5, frames: 4});
runningAnimation.frames.push({cellIndex: 6, frames: 4});
runningAnimation.frames.push({cellIndex: 7, frames: 4});

const animator = new AnimatedSpriteRender(
    spriteSheet, [
        {x: 0, y: 0, width: 512, height: 256},
        {x: 512, y: 0, width: 512, height: 256},
        {x: 0, y: 256, width: 512, height: 256},
        {x: 512, y: 256, width: 512, height: 256},
        {x: 0, y: 512, width: 512, height: 256},
        {x: 512, y: 512, width: 512, height: 256},
        {x: 0, y: 768, width: 512, height: 256},
        {x: 512, y: 768, width: 512, height: 256},
    ]);

animator.addAnimation(runningAnimation);
animator.startAnimation('run');
cat.addComponent(animator);
scene.addObject(cat);

scene.run();
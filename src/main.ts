import * as Vunity from './vunity';

const block = new Vunity.GameObject({x:32, y:32});
const renderer = new Vunity.BoxRenderer();
const mover = new Vunity.Mover(10);
block.addComponent(renderer);
block.addComponent(mover);

const scene = new Vunity.Scene(document.getElementById("canvas") as HTMLCanvasElement);
scene.addObject(block);
scene.run();


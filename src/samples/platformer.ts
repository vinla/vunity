import { BoxCollider } from '../colliders';
import { GameObject, Scene } from '../vunity';
import { BoxRenderer } from '../renderers';
import { PlatformController, ResetOnTouch, GoalOnTouch } from '../simple-platformer';
import { HorizontalMovementController, JumpController } from '../controllers';
import { createBlock, Rect2D } from '../utility';

const start = {x: 32, y: 288};

const player = new GameObject({...start});
player.state['isPlayer'] = true;
player.addComponent(new BoxRenderer({width: 16, height: 32}, '#4287f5'));
player.addComponent(new PlatformController());
player.addComponent(new HorizontalMovementController(60));
player.addComponent(new JumpController());
player.collider = new BoxCollider(player, {width: 16, height: 32});

const deathPlane = new GameObject({x: 0, y: 460});
deathPlane.addComponent(new ResetOnTouch(start));
deathPlane.collider = new BoxCollider(deathPlane, {width: 640, height: 20});

const goal = new GameObject({x: 64, y: 128});
goal.addComponent(new BoxRenderer({width: 64, height: 64}, '#f5da42'));
goal.addComponent(new GoalOnTouch());
goal.collider = new BoxCollider(goal, {width: 32, height: 48});

const scene = new Scene(document.getElementById('canvas') as HTMLCanvasElement);
scene.addObject(deathPlane);
scene.addObject(goal);
scene.addObject(player);
scene.addObject(createBlock({x: 0, y: 320, width: 320, height: 16}));
scene.addObject(createBlock({x: 390, y: 296, width: 146, height: 16}));
scene.addObject(createBlock({x: 440, y: 280, width: 96, height: 16}));
scene.addObject(createBlock({x: 464, y: 264, width: 72, height: 16}));
scene.addObject(createBlock({x: 300, y: 212, width: 96, height: 16}));
scene.addObject(createBlock({x: 160, y: 212, width: 96, height: 16}));
scene.addObject(createKillBlock({x: 200, y: 288, width: 32, height: 32}));

function createKillBlock(rect: Rect2D) {
    const block = new GameObject(rect);
    block.addComponent(new BoxRenderer(rect, '#d1440d'));
    block.addComponent(new ResetOnTouch(start));
    block.collider = new BoxCollider(block, rect);
    return block;
}

export default scene;
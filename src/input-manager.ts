class InputManager {
    keysPressed: string[];

    constructor() {
        this.keysPressed = [] as string[];
    }

    init = () => {
        window.onkeydown = (ev) => {
            const key = ev.key || ev.keyCode;
            switch (key) {
                case 'ArrowRight':
                case 39:
                  this.keysPressed.push('Right');
                  break;
                case 'ArrowLeft':
                case 37:
                    this.keysPressed.push('Left');
                    break;
                case ' ':
                case 32:
                    this.keysPressed.push('Space');
                    break;
            }
        };

        window.onkeyup = (ev) => {
            const key = ev.key || ev.keyCode;
            switch (key) {
                case 'ArrowRight':
                case 39:
                  this.keysPressed.splice(this.keysPressed.indexOf('Right'));
                  break;
                case 'ArrowLeft':
                case 37:
                        this.keysPressed.splice(this.keysPressed.indexOf('Left'));
                    break;
                case ' ':
                case 32:
                    this.keysPressed.splice(this.keysPressed.indexOf('Space'));
                    break;
            }
        };
    }
}

const instance = new InputManager();

export default instance;


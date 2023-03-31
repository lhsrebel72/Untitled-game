export class Input {
    constructor() {
        this.directions = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.keyMap = {
            KeyW: 'up',
            ArrowUp: 'up',
            KeyS: 'down',
            ArrowDown: 'down',
            KeyA: 'left',
            ArrowLeft: 'left',
            KeyD: 'right',
            ArrowRight: 'right'
        };

        document.addEventListener('keydown', event => {
            const key = event.code;
            this.setDirection(key, true);
        });

        document.addEventListener('keyup', event => {
            const key = event.code;
            this.setDirection(key, false);
        });
    }

    setDirection(key, value) {
        const direction = this.keyMap[key];
        if (direction) {
            this.directions[direction] = value;
        }
    }

    update() {
        // Reset the directions object
        for (const direction in this.directions) {
            this.directions[direction] = false;
        }
    }
}
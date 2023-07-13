export class Input {
    constructor() {
      this.directions = {
        up: false,
        down: false,
        left: false,
        right: false,
      };
  
      this.actions = {
        space: false,
      };
  
      this.keyMap = {
        KeyW: 'up',
        ArrowUp: 'up',
        KeyS: 'down',
        ArrowDown: 'down',
        KeyA: 'left',
        ArrowLeft: 'left',
        KeyD: 'right',
        ArrowRight: 'right',
        Space: 'space',
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
      if (direction && this.directions.hasOwnProperty(direction)) {
        this.directions[direction] = value;
      } else if (direction && this.actions.hasOwnProperty(direction)) {
        this.actions[direction] = value;
      }
    }
  
    isSpacebarPressed() {
      return this.actions['space'];
    }
  }
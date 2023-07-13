import { Character } from './character.js';
import * as PIXI from 'pixi.js';

export class Player extends Character {
    constructor(stage, playableAreaBounds, sprites) {
      super(stage, playableAreaBounds, sprites, playableAreaBounds.maxX/2, playableAreaBounds.maxY/2);
    }

    update(newDirection, playableAreaBounds, app) {
        super.update(newDirection, playableAreaBounds, app);
        this.centerCameraOnCharacter(app);
    }

    centerCameraOnCharacter(app) {
        // Get the position of the character
        const characterWidth = this.characterSprite.width;
        const characterHeight = this.characterSprite.height;
        const characterX = this.characterSprite.x;
        const characterY = this.characterSprite.y;

        // Get the dimensions of the screen
        const screenWidth = app.view.width;
        const screenHeight = app.view.height;

        // Calculate the x and y offsets to center the character on the screen
        const cameraX = (characterX + characterWidth) - screenWidth/2;
        const cameraY = (characterY + characterHeight) - screenHeight/2;

        // Adjust the position of the stage to center the character
        app.stage.position.set(cameraX * -1, cameraY * -1);
    }
  }
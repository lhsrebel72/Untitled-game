import { Character } from './character.js';
import * as PIXI from 'pixi.js';

export class Enemy extends Character {
    constructor(stage, playableAreaBounds, sprites) {
      super(stage, playableAreaBounds, sprites, playableAreaBounds.maxX/2 - 100, playableAreaBounds.maxY/2);

      this.speed = 1;

      this.directionsToMove = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    }

    update(playableAreaBounds, app, playerX, playerY) {
        this.runFromPlayer(playerX, playerY);
        super.update(this.directionsToMove, playableAreaBounds, app);
    }

    followPlayer(playerX, playerY){
        if(this.characterSprite.x < playerX - 50){
            this.directionsToMove.left = false
            this.directionsToMove.right = true
        }
        else if (this.characterSprite.x > playerX + 50){
            this.directionsToMove.left = true
            this.directionsToMove.right = false
        }
        else{
            this.directionsToMove.left = false
            this.directionsToMove.right = false
        }
        if(this.characterSprite.y < playerY - 50){
            this.directionsToMove.up = false
            this.directionsToMove.down = true
        }
        else if (this.characterSprite.y > playerY + 50) {
            this.directionsToMove.up = true
            this.directionsToMove.down = false
        }
        else {
            this.directionsToMove.up = false
            this.directionsToMove.down = false
        }
    }

    runFromPlayer(playerX, playerY){
        if(this.characterSprite.x < playerX - 50){
            this.directionsToMove.left = true
            this.directionsToMove.right = false
        }
        else if (this.characterSprite.x > playerX + 50){
            this.directionsToMove.left = false
            this.directionsToMove.right = true
        }
        else{
            // Randomly choose to move left or right
            if (Math.random() < 0.5) {
                this.directionsToMove.left = true;
                this.directionsToMove.right = false;
            } else {
                this.directionsToMove.left = false;
                this.directionsToMove.right = true;
            }
        }
        if(this.characterSprite.y < playerY - 50){
            this.directionsToMove.up = true
            this.directionsToMove.down = false
        }
        else if (this.characterSprite.y > playerY + 50) {
            this.directionsToMove.up = false
            this.directionsToMove.down = true
        }
        else {
            // Randomly choose to move up or down
            if (Math.random() < 0.5) {
                this.directionsToMove.up = true;
                this.directionsToMove.down = false;
            } else {
                this.directionsToMove.up = false;
                this.directionsToMove.down = true;
            }
        }
    }

    destroy(){

    }
  }
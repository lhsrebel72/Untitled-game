import { Character } from './character.js';
import * as PIXI from 'pixi.js';

export class Enemy extends Character {
    constructor(stage, playableAreaBounds, sprites) {
      super(stage, playableAreaBounds, sprites, playableAreaBounds.maxX/2 + 100, playableAreaBounds.maxY/2 + 100);

      this.speed = 7;

      this.directionsToPlayer = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    }

    update(playableAreaBounds, app, playerX, playerY) {
        this.followPlayer(playerX, playerY);
        super.update(this.directionsToPlayer, playableAreaBounds, app);
    }

    followPlayer(playerX, playerY){
        if(this.characterSprite.x < playerX - 50){
            this.directionsToPlayer.left = false
            this.directionsToPlayer.right = true
        }
        else if (this.characterSprite.x > playerX + 50){
            this.directionsToPlayer.left = true
            this.directionsToPlayer.right = false
        }
        else{
            this.directionsToPlayer.left = false
            this.directionsToPlayer.right = false
        }
        if(this.characterSprite.y < playerY - 50){
            this.directionsToPlayer.up = false
            this.directionsToPlayer.down = true
        }
        else if (this.characterSprite.y > playerY + 50) {
            this.directionsToPlayer.up = true
            this.directionsToPlayer.down = false
        }
        else {
            this.directionsToPlayer.up = false
            this.directionsToPlayer.down = false
        }
    }
  }
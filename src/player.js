import * as PIXI from 'pixi.js';
import Sprites from './sprites.js';

export class Player {
    constructor(stage, playableAreaBounds) {
        this.playerSprite = this.sprites.createPlayerSprite(playableAreaBounds);
        stage.addChild(this.playerSprite);

        this.directions = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.speed = 100;
    }

    update(directions, playableAreaBounds) {
        // Use the directions object to move the player
        if (directions.left && this.sprite.x > playableAreaBounds.minX) {
            this.sprite.x -= this.speed;
        }
        if (directions.right && this.sprite.x < playableAreaBounds.maxX) {
            this.sprite.x += this.speed;
        }
        if (directions.up && this.sprite.y > playableAreaBounds.minY) {
            this.sprite.y -= this.speed;
        }
        if (directions.down && this.sprite.y < playableAreaBounds.maxY) {
            this.sprite.y += this.speed;
        }
    }
}
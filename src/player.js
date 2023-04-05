import * as PIXI from 'pixi.js';

export class Player {
    constructor(stage, playableAreaBounds, sprites) {
        this.sprites = sprites;
        this.playerTextureSet = []
        this.playerSprite = this.sprites.createPlayerPlaceholderSprite(playableAreaBounds);
        stage.addChild(this.playerSprite);
        const playerSpritePromise = this.sprites.createPlayerSpriteSet();
        playerSpritePromise.then((playerTextureSet) => {
            this.playerSprite.texture = playerTextureSet[0]
            this.initiatePlayerTextureSet(playerTextureSet)
        });

        this.directions = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.speed = 10;
    }

    update(directions, playableAreaBounds, app) {
        // Use the directions object to move the player
        if(this.playerSprite) {
            this.movePlayer(directions,playableAreaBounds);
            this.centerCameraOnPlayer(app);
        }
    }

    movePlayer(directions, playableAreaBounds) {
        // Use the directions object to move the player
        if (directions.left && this.playerSprite.x > playableAreaBounds.minX) {
            this.playerSprite.x -= this.speed;
        }
        if (directions.right && this.playerSprite.x < playableAreaBounds.maxX) {
            this.playerSprite.x += this.speed;
        }
        if (directions.up && this.playerSprite.y > playableAreaBounds.minY) {
            this.playerSprite.y -= this.speed;
        }
        if (directions.down && this.playerSprite.y < playableAreaBounds.maxY) {
            this.playerSprite.y += this.speed;
        }
    }

    centerCameraOnPlayer(app) {
        // Get the position of the player
        const playerX = this.playerSprite.x;
        const playerY = this.playerSprite.y;

        // Get the dimensions of the screen
        const screenWidth = app.view.width;
        const screenHeight = app.view.height;

        // Calculate the x and y offsets to center the player on the screen
        const cameraX = screenWidth / 2 - playerX;
        const cameraY = screenHeight / 2 - playerY;

        // Adjust the position of the stage to center the player
        app.stage.position.set(cameraX, cameraY);
    }
}
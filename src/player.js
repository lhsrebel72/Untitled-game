import * as PIXI from 'pixi.js';

export class Player {
    constructor(stage, playableAreaBounds, sprites) {
        this.sprites = sprites;
        this.playerTextureSet = []
        this.playerSprite = this.sprites.createPlayerPlaceholderSprite(playableAreaBounds);
        stage.addChild(this.playerSprite);
        const playerSpritePromise = this.sprites.createPlayerSpriteSet();
        playerSpritePromise.then((playerTextureSet) => {
            this.playerTextureSet = playerTextureSet;
            this.playerSprite.texture = playerTextureSet[0][0];
            this.initiatePlayerTextureSet(playerTextureSet, playableAreaBounds);
        });

        this.currentDirection = null;

        this.standTexture = {
            up: [],
            down: [],
            left: [],
            right: []
        }

        this.walkAnimations = {
            up: [],
            down: [],
            left: [],
            right: []
        };

        this.runAnimations = {
            up: [],
            down: [],
            left: [],
            right: []
        };

        this.combatAnimations = {
            up: [],
            down: [],
            left: [],
            right: []
        };

        this.speed = 10;
    }

    update(newDirection, playableAreaBounds, app) {
        // Use the directions object to move the player
        if(this.playerSprite) {
            this.movePlayer(newDirection,playableAreaBounds);
            this.centerCameraOnPlayer(app);
        }
    }

    movePlayer(newDirection, playableAreaBounds) {
        var directions = Object.keys(newDirection);
        for(var x = 0; x < directions.length; x++){
            if(this.currentDirection == directions[x] && newDirection[directions[x]] == false){
                this.playerSprite.stop();
                this.playerSprite.textures = this.standTexture[directions[x]];
            }
            if(newDirection[directions[x]] == true){
                this.currentDirection = directions[x];
            }
        }
        // Use the directions object to move the player
        if (newDirection.left && this.playerSprite.x > playableAreaBounds.minX) {
            if(!this.playerSprite.playing){
                this.playerSprite.textures = this.walkAnimations.left;
                this.playerSprite.play();
            }
            this.playerSprite.x -= this.speed;
        }
        if (newDirection.right && this.playerSprite.x < playableAreaBounds.maxX) {
            if(!this.playerSprite.playing){
                this.playerSprite.textures = this.walkAnimations.right;
                this.playerSprite.play();
            }
            this.playerSprite.x += this.speed;
        }
        if (newDirection.up && this.playerSprite.y > playableAreaBounds.minY) {
            if(!this.playerSprite.playing){
                this.playerSprite.textures = this.walkAnimations.up;
                this.playerSprite.play();
            }
            this.playerSprite.y -= this.speed;
        }
        if (newDirection.down && this.playerSprite.y < playableAreaBounds.maxY) {
            if(!this.playerSprite.playing){
                this.playerSprite.textures = this.walkAnimations.down;
                this.playerSprite.play();
            }
            this.playerSprite.y += this.speed;
        }
    }

    centerCameraOnPlayer(app) {
        // Get the position of the player
        const playerWidth = this.playerSprite.width;
        const playerHeight = this.playerSprite.height;
        const playerX = this.playerSprite.x;
        const playerY = this.playerSprite.y;

        // Get the dimensions of the screen
        const screenWidth = app.view.width;
        const screenHeight = app.view.height;

        // Calculate the x and y offsets to center the player on the screen
        const cameraX = (playerX + playerWidth) - screenWidth/2;
        const cameraY = (playerY + playerHeight) - screenHeight/2;

        // Adjust the position of the stage to center the player
        app.stage.position.set(cameraX * -1, cameraY * -1);
    }

    createWalkAnimation(frames, animation){
        for (var frame = 0; frame < frames.length; frame++) {
            if(frame<6){
                animation.push(frames[frame]);
            }
        }
    }

    initiatePlayerTextureSet(playerTextureSet, playableAreaBounds){
        for (var row = 0; row < playerTextureSet.length; row++) {
            switch (row) {
                case 0:
                    this.standTexture.down.push(playerTextureSet[row][0]);
                    break;
                case 1:
                    this.standTexture.up.push(playerTextureSet[row][0]);
                    break;
                case 2:
                    this.standTexture.right.push(playerTextureSet[row][0]);
                    break;
                case 3:
                    this.standTexture.left.push(playerTextureSet[row][0]);
                    break;
                case 4:
                    this.createWalkAnimation(playerTextureSet[row], this.walkAnimations.down);
                    break;
                case 5:
                    this.createWalkAnimation(playerTextureSet[row], this.walkAnimations.up);
                    break;
                case 6:
                    this.createWalkAnimation(playerTextureSet[row], this.walkAnimations.right);
                    break;
                case 7:
                    this.createWalkAnimation(playerTextureSet[row], this.walkAnimations.left);
                    break;
                default:
            }   
        }
        this.playerSprite.textures = this.standTexture.down;
        this.playerSprite.animationSpeed = 1 / 6;   
        this.playerSprite.loop = false;                  // 6 fps
        this.playerSprite.play();
    }
}
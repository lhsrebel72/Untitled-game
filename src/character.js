import * as PIXI from 'pixi.js';

export class Character {
    constructor(stage, playableAreaBounds, sprites, startingX, startingY, health) {
        this.sprites = sprites;
        this.characterTextureSet = []
        this.texturesLoaded = false;
        this.swinging = false;
        this.health = health
        this.playableAreaBounds = playableAreaBounds;
        this.characterSprite = this.sprites.createCharacterPlaceholderSprite(playableAreaBounds, startingX, startingY);
        stage.addChild(this.characterSprite);

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

        if(sprites.characterTextureSets.length > 0){
            this.handleCharacterSpritesCreated();
        }
        else {
            this.sprites.createCharacterPlaceholderSprite(playableAreaBounds, startingX, startingY);
            sprites.on('characterSpritesCreated', () => {
                this.handleCharacterSpritesCreated();
            });
        }

        this.speed = 3;
    }

    handleCharacterSpritesCreated(){
        this.characterTextureSet = this.sprites.characterTextureSets;
        this.characterSprite.texture = this.characterTextureSet[0][0];
        this.initiateCharacterTextureSet(this.characterTextureSet, this.playableAreaBounds);
        this.texturesLoaded = true;
    }

    update(newDirection, playableAreaBounds, app, isPlayer) {
        // Use the directions object to move the character
        if(this.health <= 0){
            this.characterSprite.destroy();
            this.characterSprite = null;
            // Trigger the 'death' event
            const deathEvent = new CustomEvent('death', { detail: { character: this , isPlayerDeath: isPlayer} });
            document.dispatchEvent(deathEvent);
        }
        else if(this.characterSprite) {
            this.moveCharacter(newDirection,playableAreaBounds);
        }
    }

    moveCharacter(newDirection, playableAreaBounds) {
        if (!this.texturesLoaded) return;
        var directions = Object.keys(newDirection);
        for(var x = 0; x < directions.length; x++){
            if(this.currentDirection == directions[x] && newDirection[directions[x]] == false){
                this.characterSprite.stop();
                this.characterSprite.textures = this.standTexture[directions[x]];
            }
            if(newDirection[directions[x]] == true){
                this.currentDirection = directions[x];
            }
        }
        // Use the directions object to move the character
        if (newDirection.left && this.characterSprite.x > playableAreaBounds.minX) {
            if(!this.characterSprite.playing){
                this.characterSprite.textures = this.walkAnimations.left;
                this.characterSprite.play();
            }
            this.characterSprite.x -= this.speed;
        }
        if (newDirection.right && this.characterSprite.x < playableAreaBounds.maxX) {
            if(!this.characterSprite.playing){
                this.characterSprite.textures = this.walkAnimations.right;
                this.characterSprite.play();
            }
            this.characterSprite.x += this.speed;
        }
        if (newDirection.up && this.characterSprite.y > playableAreaBounds.minY) {
            if(!this.characterSprite.playing){
                this.characterSprite.textures = this.walkAnimations.up;
                this.characterSprite.play();
            }
            this.characterSprite.y -= this.speed;
        }
        if (newDirection.down && this.characterSprite.y < playableAreaBounds.maxY) {
            if(!this.characterSprite.playing){
                this.characterSprite.textures = this.walkAnimations.down;
                this.characterSprite.play();
            }
            this.characterSprite.y += this.speed;
        }
    }

    createWalkAnimation(frames, animation){
        for (var frame = 0; frame < frames.length; frame++) {
            if(frame<6){
                animation.push(frames[frame]);
            }
        }
    }

    initiateCharacterTextureSet(characterTextureSet, playableAreaBounds){
        for (var row = 0; row < characterTextureSet.length; row++) {
            switch (row) {
                case 0:
                    this.standTexture.down.push(characterTextureSet[row][0]);
                    break;
                case 1:
                    this.standTexture.up.push(characterTextureSet[row][0]);
                    break;
                case 2:
                    this.standTexture.right.push(characterTextureSet[row][0]);
                    break;
                case 3:
                    this.standTexture.left.push(characterTextureSet[row][0]);
                    break;
                case 4:
                    this.createWalkAnimation(characterTextureSet[row], this.walkAnimations.down);
                    break;
                case 5:
                    this.createWalkAnimation(characterTextureSet[row], this.walkAnimations.up);
                    break;
                case 6:
                    this.createWalkAnimation(characterTextureSet[row], this.walkAnimations.right);
                    break;
                case 7:
                    this.createWalkAnimation(characterTextureSet[row], this.walkAnimations.left);
                    break;
                default:
            }   
        }
        this.characterSprite.textures = this.standTexture.down;
        this.characterSprite.animationSpeed = 1 / 6;   
        this.characterSprite.loop = false;                  // 6 fps
        this.characterSprite.play();
    }

    getPosition(){
        const x = this.characterSprite.x + this.characterSprite.width/2;
        const y = this.characterSprite.y + this.characterSprite.height/2;
        return{
            x: x,
            y: y
        }
    }

    getSprite(){
        return this.characterSprite;
    }
}
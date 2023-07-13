import * as PIXI from 'pixi.js';

export class Sprites {

    constructor(stage) {
        this.grassTextures = [];
        this.forestTextures = [];
        this.playerTextureSets = [];
        this.playerSpriteSheets = [];
        this.stage = stage;
    }

    // Load textures for sprites or a sprite sheet
    loadTextureSet(textureSet, textureFileNameFormat, numOfTextures) {
        for (let i = 1; i <= numOfTextures; i++) {
            const spriteTexture = PIXI.Texture.from(`./src/assets/${textureFileNameFormat}-${i}.png`);
            textureSet.push(spriteTexture);
        }
    }

    // Create sprite set from a spritesheet
    createSpriteTextureSetFromSheet(spriteSheet, spriteTextureSet, spriteHeight, spriteWidth) {
        // Loop through the sprite sheet and create a new sprite for each frame
        //y and x stand represent the starting (top left) coordinate of each sprite
        for (let y = 0; y < spriteSheet.height; y += spriteHeight) {
            spriteTextureSet[y/spriteHeight] = [];
            for (let x = 0; x < spriteSheet.width; x += spriteWidth) {
                const spriteTexture = new PIXI.Texture(spriteSheet.baseTexture, new PIXI.Rectangle(x, y, spriteWidth, spriteHeight));
                spriteTextureSet[y/spriteHeight][x/spriteWidth] = spriteTexture;
            }
        }
    }

    // Create the grass sprite
    createGrassSprite(renderedArea) {
        this.loadTextureSet(this.grassTextures, "grass-sprite", 2);
        const grassSprite = new PIXI.TilingSprite(
            this.grassTextures[1],
            renderedArea.width,
            renderedArea.height,
        );
        grassSprite.zIndex = -1;
        this.stage.addChild(grassSprite);
    }

    // Create the forest sprites for the four sides of the square
    createForestSprites(playableAreaBounds) {
        this.loadTextureSet(this.forestTextures, "forest-sprite", 2);
    
        const createTilingSprite = () => {
            const northForest = new PIXI.TilingSprite(this.forestTextures[0], playableAreaBounds.maxX, this.forestTextures[0].height);
            const eastForest = new PIXI.TilingSprite(this.forestTextures[0], this.forestTextures[0].height, playableAreaBounds.maxY);
            const southForest = new PIXI.TilingSprite(this.forestTextures[0], playableAreaBounds.maxX, this.forestTextures[0].height);
            const westForest = new PIXI.TilingSprite(this.forestTextures[0], this.forestTextures[0].height, playableAreaBounds.maxY);
    
            // Set the positions of the sprites to form a square
            northForest.position.set(playableAreaBounds.minX, playableAreaBounds.minY);
            eastForest.position.set(playableAreaBounds.maxX, playableAreaBounds.minY);
            southForest.position.set(playableAreaBounds.minX, playableAreaBounds.maxY);
            westForest.position.set(playableAreaBounds.minX, playableAreaBounds.minY);
    
            this.stage.addChild(northForest, eastForest, southForest, westForest);
        };
    
        if (this.forestTextures[0].baseTexture.valid) {
            // Texture has already been processed, create the TilingSprites
            createTilingSprite();
        } else {
            // Wait for the texture to finish processing and then create the TilingSprites
            this.forestTextures[0].baseTexture.once("loaded", () => {
                createTilingSprite();
            });
        }
    }

    // Create the player sprite
    createPlayerSpriteSet() {
        return new Promise((resolve) => {
            this.loadTextureSet(this.playerSpriteSheets, "player-sprite", 1);
    
            const createPlayerSprites = () => {
                this.createSpriteTextureSetFromSheet(this.playerSpriteSheets[0], this.playerTextureSets, 64, 64);
                resolve(this.playerTextureSets);
            };
        
            if (this.playerSpriteSheets[0].baseTexture.valid) {
                // Texture has already been processed, create the TilingSprites
                createPlayerSprite();
            } else {
                // Wait for the texture to finish processing and then create the TilingSprites
                this.playerSpriteSheets[0].baseTexture.once("loaded", () => {
                    createPlayerSprites();
                });
            }
        });
    }

    // Create placeholder sprite until player textures are loaded successfully
    createPlayerPlaceholderSprite(playableAreaBounds) {
        const player = new PIXI.AnimatedSprite([PIXI.Texture.WHITE, PIXI.Texture.RED]);
        player.width = 100;
        player.height = 100;
        player.position.set(playableAreaBounds.maxX/2, playableAreaBounds.maxY/2);
        player.zIndex = 100;
        return player;
    }
}
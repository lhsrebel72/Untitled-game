import * as PIXI from 'pixi.js';

export class Sprites {

    constructor(stage) {
        this.grassTextures = [];
        this.forestTextures = [];
        this.characterTextureSets = [];
        this.characterSpriteSheets = [];
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

    // Create the character sprite
    createCharacterSpriteSet() {
        return new Promise((resolve) => {
            this.loadTextureSet(this.characterSpriteSheets, "character-sprite", 1);
    
            const createCharacterSprites = () => {
                this.createSpriteTextureSetFromSheet(this.characterSpriteSheets[0], this.characterTextureSets, 64, 64);
                resolve(this.characterTextureSets);
            };
        
            if (this.characterSpriteSheets[0].baseTexture.valid) {
                // Texture has already been processed, create the TilingSprites
                createCharacterSprite();
            } else {
                // Wait for the texture to finish processing and then create the TilingSprites
                this.characterSpriteSheets[0].baseTexture.once("loaded", () => {
                    createCharacterSprites();
                });
            }
        });
    }

    // Create placeholder sprite until character textures are loaded successfully
    createCharacterPlaceholderSprite(playableAreaBounds, startingX, startingY) {
        const character = new PIXI.AnimatedSprite([PIXI.Texture.WHITE, PIXI.Texture.RED]);
        character.width = 100;
        character.height = 100;
        character.position.set(startingX, startingY);
        character.zIndex = 100;
        return character;
    }
}
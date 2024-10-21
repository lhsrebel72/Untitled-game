import * as PIXI from 'pixi.js';

const EventEmitter = require('events');

export class Sprites extends EventEmitter{

    constructor(stage) {
        super();
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
    createSpriteTextureSetFromSheet(spriteHeight, spriteWidth) {
        // Loop through the sprite sheet and create a new sprite for each frame
        //y and x stand represent the starting (top left) coordinate of each sprite
        const spriteSheet = this.characterSpriteSheets[0]
        for (let y = 0; y < spriteSheet.height; y += spriteHeight) {
            this.characterTextureSets[y/spriteHeight] = [];
            for (let x = 0; x < spriteSheet.width; x += spriteWidth) {
                const spriteTexture = new PIXI.Texture(spriteSheet.baseTexture, new PIXI.Rectangle(x, y, spriteWidth, spriteHeight));
                this.characterTextureSets[y/spriteHeight][x/spriteWidth] = spriteTexture;
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
        this.loadTextureSet(this.characterSpriteSheets, "character-sprite", 1);
    
        const createCharacterSprites = () => {
            this.createSpriteTextureSetFromSheet(64, 64);
            this.emit('characterSpritesCreated');
        };
    
        if (this.characterSpriteSheets[0].baseTexture.valid) {
            // Texture has already been processed, create the TilingSprites
            createCharacterSprites();
        } else {
            // Wait for the texture to finish processing and then create the TilingSprites
            this.characterSpriteSheets[0].baseTexture.once("loaded", () => {
                createCharacterSprites();
            });
        }
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
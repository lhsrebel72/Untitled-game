import * as PIXI from 'pixi.js';

export class Sprites {

    constructor() {
        this.grassTiles = [];
        this.forestTiles = [];
    }

    // Load tiles
    loadTextureSet(textureSet, textureFileNameFormat, numOfTextures) {
        for (let i = 1; i <= numOfTextures; i++) {
            const tileTexture = PIXI.Texture.from(`./src/assets/${textureFileNameFormat}-${i}.png`);
            textureSet.push(tileTexture);
        }
    }

    // Create the grass sprite
    createGrassSprite(renderedArea) {
        this.loadTextureSet(this.grassTiles, "grass-tile", 2);
        const grassSprite = new PIXI.TilingSprite(
            this.grassTiles[1],
            renderedArea.width,
            renderedArea.height,
        );
        grassSprite.zIndex = -1;
        return grassSprite;
    }

    // Create the forest sprites for the four sides of the square
    createForestSprites(playableAreaBounds) {
        this.loadTextureSet(this.forestTiles, "forest-tile", 2);
        const northForest = new PIXI.TilingSprite(this.forestTiles[0], playableAreaBounds.maxX, 500);
        const eastForest = new PIXI.TilingSprite(this.forestTiles[0], 500, playableAreaBounds.maxY);
        const southForest = new PIXI.TilingSprite(this.forestTiles[0], playableAreaBounds.maxX, 500);
        const westForest = new PIXI.TilingSprite(this.forestTiles[0], 500, playableAreaBounds.maxY);

        // Set the positions of the sprites to form a square
        northForest.position.set(playableAreaBounds.minX, playableAreaBounds.minY);
        eastForest.position.set(playableAreaBounds.maxX, playableAreaBounds.minY);
        southForest.position.set(playableAreaBounds.minX, playableAreaBounds.maxY);
        westForest.position.set(playableAreaBounds.minX, playableAreaBounds.minY);

        return [northForest, eastForest, southForest, westForest];
    }

    // Create the player sprite
    createPlayerSprite(playableAreaBounds) {
        const player = new PIXI.Sprite(PIXI.Texture.WHITE);
        player.width = 50;
        player.height = 50;
        player.tint = 0xff0000;
        player.position.set(playableAreaBounds.maxX/2, playableAreaBounds.maxY/2);
        player.zIndex = 100;
        return player;
    }
}
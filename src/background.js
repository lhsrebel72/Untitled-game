export class Background {
    constructor(stage, renderedArea, playableAreaBounds, sprites) {
        this.stage = stage;
        this.renderedArea = renderedArea;
        this.playableAreaBounds = playableAreaBounds;
        this.sprites = sprites;
    }

    // Set up the background
    setUp() {
        const grassSprite = this.sprites.createGrassSprite(this.renderedArea);
        const forestSprites = this.sprites.createForestSprites(this.playableAreaBounds);

        // Add the sprites to the stage
        this.stage.addChild(grassSprite, ...forestSprites);
    }
}
export class Background {
    constructor(stage, renderedArea, playableAreaBounds, sprites) {
        this.stage = stage;
        this.renderedArea = renderedArea;
        this.playableAreaBounds = playableAreaBounds;
        this.sprites = sprites;
    }

    // Set up the background
    setUp() {
        this.sprites.createGrassSprite(this.renderedArea);
        this.sprites.createForestSprites(this.playableAreaBounds);
    }
}
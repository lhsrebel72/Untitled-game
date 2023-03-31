import * as PIXI from 'pixi.js';

// Set up Pixi.js
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
});

document.getElementById('game-container').appendChild(app.view);

const renderedArea = {width: 5000, height:5000};
const boundBuffer = 0;
const playableAreaBounds = {minX: 0 + boundBuffer, maxX: renderedArea.width - boundBuffer, minY:0 + boundBuffer, maxY:renderedArea.height - boundBuffer};


// Load tiles
const loadTextureSet = (textureSet, textureFileNameFormat, numOfTextures) => {
    for (let i = 1; i <= numOfTextures; i++) {
        const tileTexture = PIXI.Texture.from(`./src/assets/${textureFileNameFormat}-${i}.png`);
        textureSet.push(tileTexture);
    }
};

const grassTiles = [];
loadTextureSet(grassTiles,"grass-tile", 2);
const grassSprite = new PIXI.TilingSprite(
    grassTiles[1],
    renderedArea.width,
    renderedArea.height,
)
grassSprite.zIndex = -1;

app.stage.addChild(grassSprite);

const forestTiles = [];
loadTextureSet(forestTiles,"forest-tile", 2);

// Create the TilingSprites for the four sides of the square
const northForest = new PIXI.TilingSprite(forestTiles[0], playableAreaBounds.maxX, 500);
const eastForest = new PIXI.TilingSprite(forestTiles[0], 500, playableAreaBounds.maxY);
const southForest = new PIXI.TilingSprite(forestTiles[0], playableAreaBounds.maxX, 500);
const westForest = new PIXI.TilingSprite(forestTiles[0], 500, playableAreaBounds.maxY);

// Set the positions of the sprites to form a square
northForest.position.set(playableAreaBounds.minX, playableAreaBounds.minY);
eastForest.position.set(playableAreaBounds.maxX, playableAreaBounds.minY);
southForest.position.set(playableAreaBounds.minX, playableAreaBounds.maxY);
westForest.position.set(playableAreaBounds.minX, playableAreaBounds.minY);

// Add the sprites to the stage
app.stage.addChild(northForest, eastForest, southForest, westForest);

// Create the player
const player = new PIXI.Sprite(PIXI.Texture.WHITE);
player.width = 50;
player.height = 50;
player.tint = 0xff0000;
player.position.set(playableAreaBounds.maxX/2, playableAreaBounds.maxY/2);
player.zIndex = 100;
app.stage.addChild(player);

const directions = {
    up: false,
    down: false,
    left: false,
    right: false
};

const keyMap = {
    KeyW: 'up',
    ArrowUp: 'up',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right'
};

const setDirection = (key, value) => {
    const direction = keyMap[key];
    if (direction) {
        directions[direction] = value;
    }
};

document.addEventListener('keydown', event => {
    const key = event.code;
    setDirection(key, true);
});

document.addEventListener('keyup', event => {
    const key = event.code;
    setDirection(key, false);
});

// Set up the game loop
function gameLoop(delta) {
    // Move the player with WASD keys
    const speed = 100;   
    // Use the directions object to move the player
    if (directions.left & player.x > playableAreaBounds.minX) {
        player.x -= speed;
    }
    if (directions.right & player.x < playableAreaBounds.maxX) {
        player.x += speed;
    }
    if (directions.up & player.y > playableAreaBounds.minY) {
        player.y -= speed;
    }
    if (directions.down & player.y < playableAreaBounds.maxY) {
        player.y += speed;
    }

    // Get the position of the player
    const playerX = player.x;
    const playerY = player.y;

    // Get the dimensions of the screen
    const screenWidth = app.view.width;
    const screenHeight = app.view.height;

    // Calculate the x and y offsets to center the player on the screen
    const cameraX = screenWidth / 2 - playerX;
    const cameraY = screenHeight / 2 - playerY;

    // Adjust the position of the stage to center the player
    app.stage.position.set(cameraX, cameraY);
}

app.ticker.add(gameLoop);
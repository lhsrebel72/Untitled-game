import * as PIXI from 'pixi.js';
import { Player } from './player.js';
import { Input } from './input.js';
import { Sprites } from './sprites.js';
import { Background } from './background.js';

// Set up Pixi.js
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
});

document.getElementById('game-container').appendChild(app.view);

const renderedArea = {width: 5000, height:5000};
const boundBuffer = 500;
const playableAreaBounds = {minX: 0 + boundBuffer, maxX: renderedArea.width - boundBuffer, minY:0 + boundBuffer, maxY:renderedArea.height - boundBuffer};

// Create the game objects
const sprites = new Sprites(app.stage);
const background = new Background(app.stage, renderedArea, playableAreaBounds, sprites);
background.setUp();
const input = new Input();
const player = new Player(app.stage, playableAreaBounds, sprites);

// Set up the game loop
function gameLoop(delta) {
    player.update(input.directions, playableAreaBounds,app);
}

app.ticker.add(gameLoop);
import * as PIXI from 'pixi.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Input } from './input.js';
import { Sprites } from './sprites.js';
import { Background } from './background.js';
import { CombatManager } from './combatManager.js';

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
const enemies = [];
spawnRandomEnemies();
const combatManager = new CombatManager(app, player, enemies);
document.addEventListener('death', (event) => {
    const character = event.detail.character;
    const isPlayerDeath = event.detail.isPlayerDeath;
    handleDeath(character, isPlayerDeath);
});

// Set up the game loop
function gameLoop(delta) {
    player.update(input.directions, playableAreaBounds, app);
    enemies.forEach(enemy => {
        enemy.update(playableAreaBounds, app, player.characterSprite.x, player.characterSprite.y);
    })
    if(player.currentDirection && input.isSpacebarPressed()) player.attack();
}

function handleDeath(character, isPlayerDeath){
    if(!isPlayerDeath){
        const index = enemies.indexOf(character);

        if (index !== -1) {
            enemies.splice(index, 1);
            //spawnRandomEnemies();
        } 
    }
}

function spawnRandomEnemies() {
    const numEnemies = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
  
    for (let i = 0; i < numEnemies; i++) {
      // Calculate random x and y within the range of 100-1000 pixels from the player's position
      const x = player.getPosition().x + Math.floor(Math.random() * 1001) - 500; // Random value between -450 and 450
      const y = player.getPosition().y + Math.floor(Math.random() * 1001) - 500; // Random value between -450 and 450
  
      // Spawn a new enemy
      enemies.push(new Enemy(app.stage, playableAreaBounds, sprites, x, y));
    }
  }

app.ticker.add(gameLoop);
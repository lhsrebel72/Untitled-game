import { Character } from './character.js';
import { Weapon } from './weapon.js';
import { SpatialPartitioning } from './spatialPartitioning.js';
import * as PIXI from 'pixi.js';

export class Enemy extends Character {
    constructor(stage, spatialPartitioning, playableAreaBounds, sprites, x, y) {
      super(stage, playableAreaBounds, sprites, x, y,  Math.floor(Math.random() * 10) + 1);

      this.speed = 1;

      this.spatialPartitioning = spatialPartitioning;
      this.gridKey = null
      this.spatialPartitioning.addToGrid(this.characterSprite);

      this.directionsToMove = {
        up: false,
        down: false,
        left: false,
        right: false
        };
        this.weapon = new Weapon(35, 25, 5, 5);
        this.enemyClumsiness = Math.floor(Math.random() * 51); //how likely an enemy is to make a bad swing
        this.separationDistance = 100;
    }

    update(playableAreaBounds, app, playerX, playerY, updateGrid) {
        if(this.health > 0) {
            if(updateGrid) this.spatialPartitioning.updateEntityGrid(this.characterSprite);
            this.move(playerX, playerY);
            this.checkForAttack(playerX, playerY);
        }
        else {
            this.spatialPartitioning.removeFromGrid(this.characterSprite);
        }
        super.update(this.directionsToMove, playableAreaBounds, app, false);
    }

    attack(){
        if(this.swinging == false){
            const isPlayerAttacking = false;
            const attacker = this;
            const attackEvent = new CustomEvent('attack', { detail: { isPlayerAttacking, attacker } });
            document.dispatchEvent(attackEvent); 
        }
    }

    checkForAttack(playerX, playerY){
        const xDifferential = playerX - this.characterSprite.x;
        const yDifferential = playerY - this.characterSprite.y;
        const marginForError = Math.floor(Math.random() * (2 * this.enemyClumsiness + 1)) - this.enemyClumsiness;

        if(Math.abs(xDifferential) < this.weapon.range + marginForError && Math.abs(yDifferential) < 50){
            if(this.currentDirection == "right" && xDifferential > 0) {
                this.attack();
            }
            if(this.currentDirection == "left" && xDifferential < 0) {
                this.attack();
            }
        }
        if(Math.abs(yDifferential) < this.weapon.range + marginForError && Math.abs(xDifferential) < 50){
            if(this.currentDirection == "down" && yDifferential > 0) {
                this.attack();
            }
            if(this.currentDirection == "up" && yDifferential < 0) {
                this.attack();
            }
        }
    }

    separate(entitiesInSameCell) {
        const separationVector = { x: 0, y: 0 };

        for (const otherEntity of entitiesInSameCell) {
            if (otherEntity !== this.characterSprite && otherEntity && this.characterSprite) {
                const deltaX = (this.characterSprite?.x ?? 0) - (otherEntity?.x ?? 0);
                const deltaY = (this.characterSprite?.y ?? 0) - (otherEntity?.y ?? 0);
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

                if (distance < this.separationDistance) {
                    separationVector.x += deltaX / distance;
                    separationVector.y += deltaY / distance;
                }
            }
        }

        return separationVector;
    }

    move(playerX, playerY) {
        const entitiesInSameCell = this.spatialPartitioning.getEntitiesInSameCell(this.characterSprite);
        const separationVector = this.separate(entitiesInSameCell);

        if (separationVector.x !== 0 || separationVector.y !== 0) {
            // Separation is needed
            this.directionsToMove.left = separationVector.x < 0;
            this.directionsToMove.right = separationVector.x > 0;
            this.directionsToMove.up = separationVector.y < 0;
            this.directionsToMove.down = separationVector.y > 0;
        } else {
            // No separation needed, follow the player
            return this.followPlayer(playerX, playerY);
        }
    }

    followPlayer(playerX, playerY){
        if(this.characterSprite.x < playerX - 20){
            this.directionsToMove.left = false
            this.directionsToMove.right = true
        }
        else if (this.characterSprite.x > playerX + 20){
            this.directionsToMove.left = true
            this.directionsToMove.right = false
        }
        else{
            this.directionsToMove.left = false
            this.directionsToMove.right = false
        }
        if(this.characterSprite.y < playerY - 20){
            this.directionsToMove.up = false
            this.directionsToMove.down = true
        }
        else if (this.characterSprite.y > playerY + 20) {
            this.directionsToMove.up = true
            this.directionsToMove.down = false
        }
        else {
            this.directionsToMove.up = false
            this.directionsToMove.down = false
        }
    }

    runFromPlayer(playerX, playerY){
        if(this.characterSprite.x < playerX - 50){
            this.directionsToMove.left = true
            this.directionsToMove.right = false
        }
        else if (this.characterSprite.x > playerX + 50){
            this.directionsToMove.left = false
            this.directionsToMove.right = true
        }
        else{
            // Randomly choose to move left or right
            if (Math.random() < 0.5) {
                this.directionsToMove.left = true;
                this.directionsToMove.right = false;
            } else {
                this.directionsToMove.left = false;
                this.directionsToMove.right = true;
            }
        }
        if(this.characterSprite.y < playerY - 50){
            this.directionsToMove.up = true
            this.directionsToMove.down = false
        }
        else if (this.characterSprite.y > playerY + 50) {
            this.directionsToMove.up = false
            this.directionsToMove.down = true
        }
        else {
            // Randomly choose to move up or down
            if (Math.random() < 0.5) {
                this.directionsToMove.up = true;
                this.directionsToMove.down = false;
            } else {
                this.directionsToMove.up = false;
                this.directionsToMove.down = true;
            }
        }
    }

    destroy(){

    }
  }
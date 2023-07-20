import * as PIXI from 'pixi.js';
import { TWEEN } from '@tweenjs/tween.js';

export class CombatManager {

    constructor(app) {
      this.app = app;
      const swinging = false;
    }

    getDirectionAndDistance(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
      
        const centerA = new PIXI.Point(
          boundsA.x + boundsA.width / 2,
          boundsA.y + boundsA.height / 2
        );
      
        const centerB = new PIXI.Point(
          boundsB.x + boundsB.width / 2,
          boundsB.y + boundsB.height / 2
        );
      
        const distance = Math.sqrt(
          Math.pow(centerB.x - centerA.x, 2) +
          Math.pow(centerB.y - centerA.y, 2)
        );
      
        const angle = Math.atan2(centerB.y - centerA.y, centerB.x - centerA.x);
      
          console.log(distance);
          console.log(angle);

        return {
          distance,
          angle
        };
      }

    checkSwordSwingHit(playerPosition, playerFacing, enemyPosition, swingArc, swingRange) {

      // Calculate the angle and distance between the player and the enemy
      const angle = Math.atan2(enemyPosition.y - playerPosition.y, enemyPosition.x - playerPosition.x);
      const distance = Math.sqrt(
        Math.pow(enemyPosition.x - playerPosition.x, 2) +
        Math.pow(enemyPosition.y - playerPosition.y, 2)
      );

      // Convert the player's facing direction to an angle
      const facingAngle = this.getPlayerFacingAngle(playerFacing);

      // Calculate the difference between the player's facing direction and the angle to the enemy
      const angleDifference = this.getNormalizedAngleDifference(angle, facingAngle);

      // Check if the enemy is within the swing range, within the swing arc, and the angle difference is within the arc
      if (
        distance <= swingRange &&
        Math.abs(angleDifference) <= swingArc / 2 &&
        Math.abs(angleDifference) <= Math.PI / 2
      ) {
        // The sword swing hits the enemy
        return true;
      }

      // The sword swing misses the enemy
      return false;
    }
      
    getPlayerFacingAngle(facing) {
      // Convert the player's facing direction to an angle
      // Adjust the values based on your specific player facing angles
      switch (facing) {
        case 'up':
          return Math.PI / 2;
        case 'down':
          return -Math.PI / 2;
        case 'left':
          return Math.PI;
        case 'right':
          return 0;
        default:
          return 0;
      }
    }
      
    getNormalizedAngleDifference(angle1, angle2) {
      // Calculate the difference between two angles and normalize it within the range -π to +π
      let difference = angle1 - angle2;
      while (difference < -Math.PI) difference += 2 * Math.PI;
      while (difference > Math.PI) difference -= 2 * Math.PI;
      return difference;
    }

    getSwingPoints(centerX, centerY, playerFacingAngle, radius, swingArc, numSteps) {
      var startAngle = null;
      var endAngle = null;
      switch (playerFacingAngle) {
        case "down":
          startAngle = -Math.PI / 2 - swingArc / 2;
          endAngle = -Math.PI / 2 + swingArc / 2;
          break;
        case "left":
          startAngle = Math.PI - swingArc / 2;
          endAngle = Math.PI + swingArc / 2;
          break;
        case "up":
          startAngle = Math.PI / 2 - swingArc / 2;
          endAngle = Math.PI / 2 + swingArc / 2;
          break;
        case "right":
          startAngle = -swingArc / 2;
          endAngle = swingArc / 2;
          break;
        default:
          throw new Error("Invalid arc position");
      }
      
      // Calculate the angular increment for each step
      const angleIncrement = (endAngle - startAngle) / numSteps;
      
      // Generate points along the arc
      const points = [];
      
      for (let i = 0; i <= numSteps; i++) {
        const currentAngle = startAngle + i * angleIncrement;
        const x = centerX + radius * Math.cos(currentAngle);
        const y = centerY - radius * Math.sin(currentAngle);
        const point = { x, y };
        points.push(point);
      }
      
      return points;
    }
      
    swingAnimation(playerPosition, playerFacing, swingArc, swingRange) {
      const swingPoints = this.getSwingPoints(playerPosition.x, playerPosition.y, playerFacing, swingRange, swingArc, 10);

      const duration = 250; // Duration for each square to fade (in milliseconds)
      const squareSize = 10; // Size of each square
      
      let currentIndex = 0;
      
      const createSquare = () => {
        const square = new PIXI.Graphics();
        square.beginFill(0xffffff);
        square.drawRect(0, 0, squareSize, squareSize);
        square.alpha = 1; // Initial alpha value (fully opaque)
        square.position.set(swingPoints[currentIndex].x, swingPoints[currentIndex].y);
        this.app.stage.addChild(square);
      
        const startTimestamp = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTimestamp;
          const t = Math.min(elapsed / duration, 1);
      
          // Update the alpha value based on the elapsed time
          square.alpha = 1 - t;
      
          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            this.app.stage.removeChild(square);
          }
        };
      
        animate();
      
        currentIndex++;
      
        if (currentIndex < swingPoints.length) {
          setTimeout(createSquare, 1);
        }
      };
      
      createSquare();
      setTimeout(() => {
        this.swinging = false;
      }, 1000);
    }

    playerSwing(player, enemies) {
      this.swinging = true;
      const swingRange = 50; // Define the swing range as 50px
      const swingArc = Math.PI/4; // Define the swing arc as 45 degrees
  
      const playerPosition = player.getPosition();
      const playerFacing = player.currentDirection; // Assuming 'currentDirection' indicates the player's facing direction
      this.swingAnimation(playerPosition, playerFacing, swingArc, swingRange);
  
      // Loop through all enemies
      for (let i = 0; i < enemies.length; i++) {
        const enemyPosition = enemies[i].getPosition();
  
        if (this.checkSwordSwingHit(playerPosition, playerFacing, enemyPosition, swingArc, swingRange)) {
          // The sword swing hits the enemy
          // Destroy the enemy
          enemies[i].characterSprite.destroy();
          enemies.splice(i, 1);
          i--;
        }
      }
    }
}
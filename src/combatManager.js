import * as PIXI from 'pixi.js';
import { TWEEN } from '@tweenjs/tween.js';

export class CombatManager {

    constructor(app) {
      this.app = app;
      const swinging = false;
    }
      
    getWeaponArcFromPlayerFacing(playerFacing, swingArc) {
      let startAngle, endAngle;

      switch (playerFacing) {
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
    
      return { startAngle, endAngle };
    }
      
    getNormalizedAngleDifference(angle1, angle2) {
      // Calculate the difference between two angles and normalize it within the range -π to +π
      let difference = angle1 - angle2;
      while (difference < -Math.PI) difference += 2 * Math.PI;
      while (difference > Math.PI) difference -= 2 * Math.PI;
      return difference;
    }

    getSwingPoints(centerX, centerY, playerFacingAngles, swingRange) {
      const startAngle = playerFacingAngles.startAngle;
      const endAngle = playerFacingAngles.endAngle;

      //how many squares will be animated for the swing
      const swingResolution = 10;
      
      // Calculate the angular increment for each step
      const angleIncrement = (endAngle - startAngle) / swingResolution;
      
      // Generate points along the arc
      const points = [];
      
      for (let i = 0; i <= swingResolution; i++) {
        const currentAngle = startAngle + i * angleIncrement;
        const x = centerX + swingRange * Math.cos(currentAngle);
        const y = centerY - swingRange * Math.sin(currentAngle);
        const point = { x, y };
        points.push(point);
      }
      
      return points;
    }

    checkCollision(sprite1, sprite2) {
      // Get the bounds of each sprite
      const bounds1 = sprite1.getBounds();
      const bounds2 = sprite2.getBounds();
    
      // Check for collision using bounding boxes
      return (
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
      );
    }
      
    swingAnimation(swingPoints, enemies) {
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

        for (let i = 0; i < enemies.length; i++) {
          if (this.checkCollision(enemies[i].getSprite(), square)) {
            // The sword swing hits the enemy
            // Destroy the enemy
            enemies[i].characterSprite.destroy();
            enemies.splice(i, 1);
            i--;
          }
        }
      
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
      const swingRange = player.weapon.range; // Define the swing range as 50px
      const swingArc = player.weapon.getArcAsRadians(); // Define the swing arc as 45 degrees
  
      const playerPosition = player.getPosition();
      const playerFacing = player.currentDirection; // Assuming 'currentDirection' indicates the player's facing direction
      const swingArcAngles = this.getWeaponArcFromPlayerFacing(playerFacing, swingArc);
      const swingPoints = this.getSwingPoints(playerPosition.x, playerPosition.y, swingArcAngles, swingRange);
      this.swingAnimation(swingPoints, enemies);
    }
}
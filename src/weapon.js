import * as PIXI from 'pixi.js';

export class Weapon {
    constructor(range, swingArc, width, damage) {
        //range is in pixels
        this.range = range;
        //arc is in degrees
        this.swingArc = swingArc;
        this.width = width;
        this.damage = damage;
    }

    getArcAsRadians(){
        return this,this.swingArc * (Math.PI / 180);
    }
  }
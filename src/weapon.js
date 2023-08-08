import * as PIXI from 'pixi.js';

export class Weapon {
    constructor(range, swingArc) {
        //range is in pixels
        this.range = range;
        //arc is in degrees
        this.swingArc = swingArc;
    }

    getArcAsRadians(){
        return this,this.swingArc * (Math.PI / 180);
    }
  }
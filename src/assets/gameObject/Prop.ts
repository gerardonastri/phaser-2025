import { Vector } from "matter";
import { Scene } from "phaser";

export default class Prop extends Phaser.GameObjects.Image{
    constructor(scene: Scene, x: number, y: number, depth: number, texture: string){
            super(scene, x, y, texture);
    
            //add to scene
            scene.add.existing(this);

            this.prospective = new Phaser.Math.Vector2(500, 500);
        }

    private prospective: Vector;


    
}
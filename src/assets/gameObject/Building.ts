import { Scene } from "phaser";

export default class Building extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Scene, x: number, y: number, texture: string, sect: number){
        super(scene, x, y, texture);
        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.dir = [0, 0];
        this.section = sect;

        this.setPosition(x*this.section, y);
    }
    private dir: number[];
    private scaleUpdate: integer;
    private section: number;

    //set
    public setDirection(x:integer, y:integer)
    {
        this.dir = [x, y];
    }

    public setScaleUpdate(value: integer)
    {
        this.scaleUpdate = value;
    }

    //get
    public getSection()
    {
        return this.section;
    }

    public getDirection()
    {
        return this.dir;
    }

    public getScaleUpdate()
    {
        return this.scaleUpdate;
    }

}
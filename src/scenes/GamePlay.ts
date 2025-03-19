import Building from "../assets/gameObject/Building";
import Player from "../assets/gameObject/Player";
import { GameData } from "../GameData";

export default class GamePlay extends Phaser.Scene {
  //ground
  private ground: Phaser.GameObjects.Sprite;
  //props
  private props: Phaser.GameObjects.Image[] = [];
  private prospectivePoint: Phaser.GameObjects.Rectangle;
  private finish: Phaser.GameObjects.Rectangle;
  //buildings
  private buildings: Building[] = [];
  private buildSection: Phaser.Physics.Arcade.Image[] = [];
  private generationBar: integer = 0;

  //player
  private player: Player;

  //-----
  private centerX = GameData.globals.gameWidth/2;
  private centerY = GameData.globals.gameHeight/2;

  private W: Phaser.Input.Keyboard.Key;
  private S: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "GamePlay",
    });
  }

  init() 
  {
    //init keys
    this.W = this.input.keyboard.addKey("W");
    this.S = this.input.keyboard.addKey("S");

    //hide mouse
    this.game.canvas.style.cursor = "none";
    this.input.mouse.disableContextMenu();
  }

  create() 
  {
    //ui
    this.add.image(this.centerX, this.centerY, "UI_prova").setScale(3).setOrigin(.5).setDepth(20);

    //ground
    this.add.image(this.centerX, this.centerY, "prospetticGrid").setScale(3).setOrigin(.5).setDepth(1).setAlpha(0);
    this.add.image(this.centerX, this.centerY+10, "path").setScale(3).setOrigin(.5).setAlpha(1);
    this.add.image(this.centerX, this.centerY+10, "maskGround").setScale(3).setOrigin(.5).setDepth(2);
    this.ground = this.add.sprite(this.centerX, this.centerY-30, "textureGround").setScale(3).setOrigin(.5).setDepth(1);
    //this.add.image(this.centerX, this.centerY-30, "linesGround").setScale(3).setOrigin(.5).setDepth(1);
    //this.CreateGround()
    //this.CreateBuildingSector();
    //this.buildings[0] = new Building(this, 96, this.centerY-70, "sword0", Phaser.Math.Between(1, 19)).setDepth(3);

    //props
    this.prospectivePoint = this.add.rectangle(this.centerX-155, this.centerY-65, 10, 10, 0x00ff00, 1).setDepth(30);
    this.finish = this.add.rectangle(0, 1080, 10, 10, 0xff0000, 1).setDepth(30);
    this.props[0] = this.add.image(this.centerX-300, this.centerY, "props1").setScale(3);
  
    //player
    this.player = new Player(this, 570, 690, 11);
  }

  update(time: number, delta: number): void 
  {
    //ground
    //this.ground.anims.play("groundTexture", true);
    //this.Buildings();

    //player
    this.player.CreateAnimation();

    //animations
    this.player.HandleAnimation();
    this.player.EnableAttack(true);

    this.CreateAnimation();


    //move

    if(this.W.isDown && this.props[0] != null)
    {
      this.tweens.add({
        targets: this.props[0],
        x: this.finish.x,
        y: this.finish.y, 
        duration: 1000,
        ease: "linear"
      })
    }
    else if(this.S.isDown  && this.props[0] != null)
    {
      this.tweens.add({
        targets: this.props[0],
        x: this.prospectivePoint.x,
        y: this.prospectivePoint.y, 
        duration: 1000,
        ease: "linear"
      })
    }
    else if(this.props[0] != null)
    {
      this.tweens.killTweensOf(this.props[0])
    }
  }

  //environment
  //buildings n props
  private CreateBuildingSector()
  {
    //buildings sector
    for(let i=0; i<20; i++)
    {
      this.buildSection.push(this.physics.add.image((96*i)+50, this.centerY-80, "coll").setScale(96, 20).setOrigin(0).setDepth(2).setAlpha(0));
      if(i%2 > 0)
      {
        this.buildSection[i].setTint(0x00ff00);
      }
    }
  }
  private Buildings()
  {
    //movement of the buildings
    if(this.buildings[0] != null)
    {
      this.buildings.forEach(element => {
        switch(element.getSection())
        {
          case 1:
            element.setDirection(-1, .02);
            element.setScaleUpdate(.01);
            element.setDepth(3);
            break;
          case 2:
            element.setDirection(-1, .05);
            element.setScaleUpdate(.01);
            element.setDepth(4);
            break;
          case 3:
            element.setDirection(-1, .05);
            element.setScaleUpdate(.01);
            element.setDepth(5);
            break;
          case 4:
            element.setDirection(-1, .06);
            element.setScaleUpdate(.01);
            element.setDepth(6);
            break;
          case 5:
            element.setDirection(-1, .07);
            element.setScaleUpdate(.014);
            element.setDepth(7);
            break;
          case 6:
            element.setDirection(-1, .1);
            element.setScaleUpdate(.018);
            element.setDepth(8);
            break;
          case 7:
            element.setDirection(-2.1, .15);
            element.setScaleUpdate(.04);
            element.setDepth(9);
            break;
          case 8:
            element.setDirection(-2.2, .2);
            element.setScaleUpdate(.08);
            element.setDepth(10);
            break;
          case 9:
            element.setDirection(.7, .5);
            element.setScaleUpdate(.1);
            element.setDepth(10);
            break;
          case 10:
            element.setDirection(2.2, .5);
            element.setScaleUpdate(.1);
            element.setDepth(9);
            break;
          case 11:
            element.setDirection(2, .25);
            element.setScaleUpdate(.06);
            element.setDepth(8);
            break;
          case 12:
            element.setDirection(2.3, .1);
            element.setScaleUpdate(.04);
            element.setDepth(7);
            break;
          case 13:
            element.setDirection(2.5, .04);
            element.setScaleUpdate(.02);
            element.setDepth(6);
            break;
          case 14:
            element.setDirection(2.4, .01);
            element.setScaleUpdate(.016);
            element.setDepth(5);
            break;
          case 15:
            element.setDirection(2.6, .008);
            element.setScaleUpdate(.012);
            element.setDepth(4);
            break;
          case 16:
            element.setDirection(2.6, .008);
            element.setScaleUpdate(.012);
            element.setDepth(3);
            break;
          case 17:
            element.setDirection(2.6, .008);
            element.setScaleUpdate(.012);
            element.setDepth(3);
            break;
          case 18:
            element.setDirection(2.6, .008);
            element.setScaleUpdate(.012);
            element.setDepth(3);
            break;
          case 19:
            element.setDirection(2.6, .008);
            element.setScaleUpdate(.012);
            element.setDepth(3);
            break;
        }
      });
    }

    if(this.W.isDown)
    {
      this.buildings.forEach(element => {
        element.x += element.getDirection()[0] * (element.scale/3);
        element.y += element.getDirection()[1] * (element.scale/3);
        element.setScale(element.scale+element.getScaleUpdate());
      });

      this.generationBar += Phaser.Math.Between(1, 2);
    }
    else if(this.S.isDown)
    {
      this.buildings.forEach(element => {
        element.x -= element.getDirection()[0] * (element.scale/3);
        element.y -= element.getDirection()[1] * (element.scale/3);
        element.setScale(element.scale-element.getScaleUpdate());
      });
    }

    //random generation
    if(this.generationBar >= 200)
    {
      this.buildings.push(new Building(this, 95, this.centerY-90, "sword0", Phaser.Math.Between(1, 19)))
      this.generationBar = 0;
    }

  }

  //animation
  private CreateAnimation()
  {
    if (!this.anims.exists("groundTexture")) {
      this.anims.create({
      key: "groundTexture",
      frames: this.anims.generateFrameNumbers("textureGround", {
          frames: [0, 1, 2],
      }),
      frameRate: 8,
      yoyo: false,
      repeat: -1,
      });
  }
  }


}

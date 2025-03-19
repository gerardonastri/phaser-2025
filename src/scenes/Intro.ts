import { Vector } from "matter";
import { GameData } from "../GameData";

export default class Intro extends Phaser.Scene {

  private spada: Phaser.GameObjects.Image;
  private vel: integer = 1;

  //player
  private player: Phaser.Physics.Arcade.Sprite[] = [];
  private playerTop = 0;
  private playerBottom = 1;

  //atk
  private atkR: boolean = false;
  private atkL: boolean = false;
  private atkTriggered: boolean = false;
  private firstAttack: boolean = false;

  constructor() {
    super({
      key: "Intro",
    });

  }

  preload() 
  {
    
  }
  create() 
  {
    this.add.image(GameData.globals.gameWidth/2, GameData.globals.gameHeight/2, "maskGround").setScale(3).setOrigin(0.5).setDepth(0);
    //this.spada = this.add.image(GameData.globals.gameWidth/2-50, GameData.globals.gameHeight/2 - 50, "sword").setScale(3).setDepth(1);
    this.add.image(0, 0, "UI_prova").setScale(3).setOrigin(0).setDepth(3);

    this.player[this.playerTop] = this.physics.add.sprite(580, 700, "").setScale(6).setDepth(3);
    this.player[this.playerBottom] = this.physics.add.sprite(580, 700, "").setScale(6).setDepth(2);
  }

  update(time: number, delta: number): void 
  {
    //movement system
    //this.GroundMovement();

    //attack system
    this.HandleAttack();

    //animation system
    this.CreateAnimation();
    this.PlayerAnimation();
  }

  private GroundMovement()
  {
    this.vel = this.spada.scale/3;


    if(this.input.keyboard.addKey("W").isDown)
    {
      this.spada.setPosition(this.spada.x + (2.5*this.vel), this.spada.y + (1*this.vel)).setScale(this.spada.scale + 0.15);
    }
    else if(this.input.keyboard.addKey("S").isDown)
    {
      this.spada.setPosition(this.spada.x - (2.5*this.vel), this.spada.y - (1*this.vel)).setScale(this.spada.scale - 0.15);
    }
    
    
  }

  private HandleAttack()
  {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if(pointer.rightButtonReleased() && !this.atkTriggered)
      {
        this.atkR = true;
        if(!this.firstAttack)
        {
          this.firstAttack = true;
        }
      }
      else if(pointer.leftButtonReleased() && !this.atkL && !this.atkTriggered)
      {
        this.atkL = true;
      }
    })
  }

  private PlayerAnimation()
  {
    //movements
    if(this.input.keyboard.addKey("W").isDown)
    {
      this.player[this.playerTop].anims.play("run_top", true);
      this.player[this.playerBottom].anims.play("run_btm", true);
    }
    else
    {
      this.player[this.playerTop].anims.play("idle_top", true);
      this.player[this.playerBottom].anims.play("idle_btm", true);
    }
    
    //atks
    /*
    if(this.atkR && !this.atkTriggered)
    {
      this.atkTriggered = true;
      console.log("atk");
      this.player[this.playerTop].anims.play("atkR", true);
    }*/
  }

  private CreateAnimation()
  {
    //idle
    if (!this.anims.exists("idle_top")) {
      this.anims.create({
        key: "idle_top",
        frames: this.anims.generateFrameNumbers("playerSheet_top", {
          frames: [0],
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1,
      });
    }
    if (!this.anims.exists("idle_btm")) {
      this.anims.create({
        key: "idle_btm",
        frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
          frames: [0],
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1,
      });
    }

    //run
    if (!this.anims.exists("run_top")) {
      this.anims.create({
        key: "run_top",
        frames: this.anims.generateFrameNumbers("playerSheet_top", {
          frames: [1, 2, 3, 4, 5],
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1,
      });
    }
    if (!this.anims.exists("run_btm")) {
      this.anims.create({
        key: "run_btm",
        frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
          frames: [1, 2, 3, 4, 5],
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1,
      });
    }

    if (!this.anims.exists("atkRun_top")) {
      this.anims.create({
        key: "atkRun_top",
        frames: this.anims.generateFrameNumbers("playerSheet_top", {
          frames: [6, 7, 8, 9, 10],
        }),
        frameRate: 10,
        yoyo: false,
        repeat: -1,
      });
    }

    //atk
    if (!this.anims.exists("atkR")) {
      this.anims.create({
        key: "atkR",
        frames: this.anims.generateFrameNumbers("playerSheet_top", {
          frames: [11, 12, 13, 14, 15],
        }),
        frameRate: 20,
        yoyo: false,
        repeat: 0,
      });
    }
  }

}


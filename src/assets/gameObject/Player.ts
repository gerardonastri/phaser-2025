import { Scene } from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Scene, x: number, y: number, depth: number, texture?: string){
        super(scene, x, y, texture);

        //add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //create
        this.top = scene.physics.add.sprite(x, y, "").setDepth(depth).setScale(5);
        this.bottom = scene.physics.add.sprite(x, y, "").setDepth(depth-1).setScale(5);
    }

    private top: Phaser.Physics.Arcade.Sprite;
    private bottom: Phaser.Physics.Arcade.Sprite;

    private attacking: boolean = false;
    private atkOrientation: boolean[] = [false, false];

    
    private W = this.scene.input.keyboard.addKey("W");
    private S = this.scene.input.keyboard.addKey("S");

    //set
    public Scale(value: integer)
    {
        this.top.setScale(value);
        this.bottom.setScale(value);
    }

    //get

    //anims
    public EnableAttack(canAttack: boolean)
    {
      if(canAttack && !this.attacking)
      {
        this.scene.input.on("pointerdown", (pointer:Phaser.Input.Pointer) => {
          this.attacking = true;
          
          if(pointer.leftButtonDown() && !this.atkOrientation[0])
          {
            this.atkOrientation[0] = true;
            this.atkOrientation[1] = false;
          }
          else if(pointer.rightButtonDown() && !this.atkOrientation[1])
          {
            this.atkOrientation[0] = false;
            this.atkOrientation[1] = true;
          }
        });
      }
    }

    public HandleAnimation()
    {   
        if(this.W.isDown) //run forward
        {
          this.bottom.anims.play("runF_btm", true);

          if(this.atkOrientation[0] && !this.atkOrientation[1])//left orientation
          {
            if(this.attacking)
            {
              console.log("atk left");
              
              this.top.anims.play("runFatkL_top", true);
                    
              if(this.top.anims.currentFrame.index == this.top.anims.currentAnim.frames.length - 1) 
              {
                this.attacking = false;
              }
            }
            else if(!this.attacking)
            {
              this.top.anims.play("LrunF_top", true);
            }
            
          }
          else if(!this.atkOrientation[0] && this.atkOrientation[1])//right orientation
          {
            if(this.attacking)
            {
              console.log("atk right");
                
              this.top.anims.play("runFatkR_top", true);
                    
              if(this.top.anims.currentFrame.index == this.top.anims.currentAnim.frames.length - 1) 
              {
                this.attacking = false;
              }
            }
            else if(!this.attacking)
            {
              this.top.anims.play("RrunF_top", true);
            }
            
          }
          else if(!this.attacking)
          {
            this.top.anims.play("runF_top", true);
          }
        }
        else if(this.S.isDown && !this.attacking) //run backwards -end-
        {
          this.top.anims.play("runB_top", true);
          this.bottom.anims.play("runB_btm", true);
        }
        else//idle
        {
          if(this.atkOrientation[0] && !this.atkOrientation[1])//left orientation
          {
            if(this.attacking)
            {
              this.top.anims.play("idleAtkL_top", true);
              this.bottom.anims.play("idleAtkL_btm", true);
                    
              if (this.top.anims.currentFrame.index == this.top.anims.currentAnim.frames.length - 1) 
              {
                this.attacking = false;
              }
            }
            else if(!this.attacking)
            {
              this.top.anims.play("idleL_top", true);
              this.bottom.anims.play("idleL_btm", true);
            }
            
          }
          else if(!this.atkOrientation[0] && this.atkOrientation[1])//right orientation
          {
            if(this.attacking)
            {
              this.top.anims.play("idleAtkR_top", true);
              this.bottom.anims.play("idleAtkR_btm", true);
                    
              if (this.top.anims.currentFrame.index == this.top.anims.currentAnim.frames.length - 1) 
              {
                this.attacking = false;
              }
            }
            else if(!this.attacking)
            {
              this.top.anims.play("idleR_top", true);
              this.bottom.anims.play("idleR_btm", true);
            }
          }
          else 
          {
            this.top.anims.play("idle_top", true);
            this.bottom.anims.play("idle_btm", true);
          }
        }
    }

    public CreateAnimation()
    {
        //idle
        if (!this.scene.anims.exists("idleL_top")) {
            this.scene.anims.create({
            key: "idleL_top",
            frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [0],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
            });
        }
        if (!this.scene.anims.exists("idleL_btm")) {
            this.scene.anims.create({
            key: "idleL_btm",
            frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
                frames: [0],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
            });
        }
        if (!this.scene.anims.exists("idle_top")) {
            this.scene.anims.create({
            key: "idle_top",
            frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [1],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
            });
        }
        if (!this.scene.anims.exists("idle_btm")) {
            this.scene.anims.create({
            key: "idle_btm",
            frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
                frames: [1],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
            });
        }
        if (!this.scene.anims.exists("idleR_top")) {
            this.scene.anims.create({
            key: "idleR_top",
            frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [2],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
            });
        }
        if (!this.scene.anims.exists("idleR_btm")) {
            this.scene.anims.create({
            key: "idleR_btm",
            frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
                frames: [2],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: -1,
            });
        }

        //run
        if (!this.scene.anims.exists("runF_top")) {
            this.scene.anims.create({
              key: "runF_top",
              frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [19, 20, 21, 22, 23],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }
        if (!this.scene.anims.exists("runF_btm")) {
            this.scene.anims.create({
              key: "runF_btm",
              frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
                frames: [19, 20, 21, 22, 23],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }
        if (!this.scene.anims.exists("LrunF_top")) {
            this.scene.anims.create({
              key: "LrunF_top",
              frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [34, 35, 36, 37, 38],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }
        if (!this.scene.anims.exists("RrunF_top")) {
            this.scene.anims.create({
              key: "RrunF_top",
              frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [29, 30, 31, 32, 33],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }
        if (!this.scene.anims.exists("runB_top")) {
            this.scene.anims.create({
              key: "runB_top",
              frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [24, 25, 26, 27, 28],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }
        if (!this.scene.anims.exists("runB_btm")) {
            this.scene.anims.create({
              key: "runB_btm",
              frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
                frames: [24, 25, 26, 27, 28],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }

        //atks
        if (!this.scene.anims.exists("idleAtkR_top")) {
          this.scene.anims.create({
            key: "idleAtkR_top",
            frames: this.anims.generateFrameNumbers("playerSheet_top", {
              frames: [11, 12, 13, 14, 15, 16, 17, 18 ],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: 0,
          });
      }
      if (!this.scene.anims.exists("idleAtkR_btm")) {
        this.scene.anims.create({
          key: "idleAtkR_btm",
          frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
            frames: [11, 12, 13, 14, 15, 16, 17, 18 ],
          }),
          frameRate: 10,
          yoyo: false,
          repeat: 0,
        });
    }
      if (!this.scene.anims.exists("idleAtkL_top")) {
          this.scene.anims.create({
            key: "idleAtkL_top",
            frames: this.anims.generateFrameNumbers("playerSheet_top", {
              frames: [3, 4, 5, 6, 7, 8, 9, 10],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: 0,
          });
      }
      if (!this.scene.anims.exists("idleAtkL_btm")) {
          this.scene.anims.create({
            key: "idleAtkL_btm",
            frames: this.anims.generateFrameNumbers("playerSheet_bottom", {
              frames: [3, 4, 5, 6, 7, 8, 9, 10],
            }),
            frameRate: 10,
            yoyo: false,
            repeat: 0,
          });
      }

        if (!this.scene.anims.exists("runFatkR_top")) {
            this.scene.anims.create({
              key: "runFatkR_top",
              frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [39, 40, 41, 42, 43],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: 0,
            });
        }
        if (!this.scene.anims.exists("runFatkL_top")) {
            this.scene.anims.create({
              key: "runFatkL_top",
              frames: this.anims.generateFrameNumbers("playerSheet_top", {
                frames: [34, 35, 36, 37, 38],
              }),
              frameRate: 10,
              yoyo: false,
              repeat: -1,
            });
        }
    }

}
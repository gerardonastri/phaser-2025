import Building from "../assets/gameObject/Building";
import Player from "../assets/gameObject/Player";
import { GameData } from "../GameData";

export default class GamePlay extends Phaser.Scene {
  // ground
  private ground: Phaser.GameObjects.Sprite;
  // props
  private props: Phaser.GameObjects.Image[] = [];
  private prospectivePoint: Phaser.GameObjects.Rectangle;
  private finish: Phaser.GameObjects.Rectangle;
  // buildings
  private buildings: Building[] = [];
  private buildSection: Phaser.Physics.Arcade.Image[] = [];
  private generationBar: integer = 0;

  // player
  private player: Player;

  // Input keys
  private W: Phaser.Input.Keyboard.Key;
  private S: Phaser.Input.Keyboard.Key;
  // Nuovi input per parata, attacchi, schivata e lancio sfera
  private parryKey: Phaser.Input.Keyboard.Key;
  private attackLeftKey: Phaser.Input.Keyboard.Key;
  private attackRightKey: Phaser.Input.Keyboard.Key;
  private dodgeKey: Phaser.Input.Keyboard.Key;    
  private launchSphereKey: Phaser.Input.Keyboard.Key; 

  // Gestione nemici
  private enemies: EnemyData[] = [];
  private enemySpawnTimer: number = 0; // contatore tempo per spawnare nemici

  // ----- centri
  private centerX = GameData.globals.gameWidth / 2;
  private centerY = GameData.globals.gameHeight / 2;

  // Barre: vita ed entropia
  private health: number;
  private healthBar: Phaser.GameObjects.Graphics;
  private healthBarBorder: Phaser.GameObjects.Graphics;
  private entropy: number;
  private entropyBar: Phaser.GameObjects.Graphics;
  private entropyBarBorder: Phaser.GameObjects.Graphics;

  // Danno temporizzato se il nemico resta attaccato
  private enemyIsAttached: boolean;
  private nextHealthTick: number;

  // Sfera generata dalla perfetta schivata
  private sphereProjectile: Phaser.GameObjects.Arc | null;
  private sphereActive: boolean = false;

  constructor() {
    super({ key: "GamePlay" });
  }

  init() {
    // init keys
    this.W = this.input.keyboard.addKey("W");
    this.S = this.input.keyboard.addKey("S");

    // Tasti per parry e attacchi
    this.parryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.attackLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.attackRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Tasto per eseguire la schivata (dodge)
    this.dodgeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    // Tasto per lanciare la sfera generata dalla perfetta schivata
    this.launchSphereKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Hide mouse
    this.game.canvas.style.cursor = "none";
    this.input.mouse.disableContextMenu();
  }

  create() {
    // (Codice originale UI, ground, props...)
    this.add.image(this.centerX, this.centerY, "UI_prova")
      .setScale(3)
      .setOrigin(0.5)
      .setDepth(20);

    this.add.image(this.centerX, this.centerY, "prospetticGrid")
      .setScale(3)
      .setOrigin(0.5)
      .setDepth(1)
      .setAlpha(0);
    this.add.image(this.centerX, this.centerY + 10, "path")
      .setScale(3)
      .setOrigin(0.5)
      .setAlpha(1);
    this.add.image(this.centerX, this.centerY + 10, "maskGround")
      .setScale(3)
      .setOrigin(0.5)
      .setDepth(2);
    this.ground = this.add.sprite(this.centerX, this.centerY - 30, "textureGround")
      .setScale(3)
      .setOrigin(0.5)
      .setDepth(1);

    this.prospectivePoint = this.add.rectangle(
      this.centerX - 155,
      this.centerY - 65,
      10,
      10,
      0x00ff00,
      1
    ).setDepth(30);
    this.finish = this.add.rectangle(0, 1080, 10, 10, 0xff0000, 1).setDepth(30);
    this.props[0] = this.add.image(this.centerX - 300, this.centerY, "props1").setScale(3);

    // player
    this.player = new Player(this, 570, 690, 11);

    // Health & Entropy
    this.health = 100;
    this.healthBarBorder = this.add.graphics().setDepth(100);
    this.healthBar = this.add.graphics().setDepth(101);
    this.entropy = 0;
    this.entropyBarBorder = this.add.graphics().setDepth(100);
    this.entropyBar = this.add.graphics().setDepth(101);
    this.updateHealthBar();
    this.updateEntropyBar();
    this.nextHealthTick = 0;

    this.enemyIsAttached = false;
    this.sphereProjectile = null;
  }

  private updateHealthBar() {
    this.healthBarBorder.clear();
    this.healthBarBorder.lineStyle(4, 0xffffff, 1);
    this.healthBarBorder.strokeRect(18, 18, 204, 24);

    this.healthBar.clear();
    this.healthBar.fillStyle(0xff0000, 1);
    this.healthBar.fillRect(20, 20, this.health * 2, 20);
  }

  private updateEntropyBar() {
    this.entropyBarBorder.clear();
    this.entropyBarBorder.lineStyle(4, 0xffffff, 1);
    this.entropyBarBorder.strokeRect(18, 50, 204, 24);

    this.entropyBar.clear();
    this.entropyBar.fillStyle(0x0000ff, 1);
    this.entropyBar.fillRect(20, 52, (this.entropy / 100) * 200, 20);
  }

  private playerDies() {
    console.log("Il player è morto!");
    this.scene.restart();
  }

  update(time: number, delta: number): void {
    // (Codice originale che gestisce W, S, entropia, movimenti props, ecc.)

    if (this.W.isDown) {
      this.entropy = Math.min(this.entropy + 0.02, 100);
      this.updateEntropyBar();
    }

    if (this.W.isDown && this.props[0] != null) {
      this.tweens.add({
        targets: this.props[0],
        x: this.finish.x,
        y: this.finish.y,
        duration: 1000,
        ease: "linear",
      });
    } else if (this.S.isDown && this.props[0] != null) {
      this.tweens.add({
        targets: this.props[0],
        x: this.prospectivePoint.x,
        y: this.prospectivePoint.y,
        duration: 1000,
        ease: "linear",
      });
    } else if (this.props[0] != null) {
      this.tweens.killTweensOf(this.props[0]);
    }

    // Player
    this.player.CreateAnimation();
    this.player.HandleAnimation();
    this.player.EnableAttack(true);
    this.CreateAnimation();

    // Nemici
    this.enemySpawnTimer += delta;
    if (this.enemySpawnTimer > 2000) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;
    }
    this.handleEnemies();

    if (Phaser.Input.Keyboard.JustDown(this.parryKey)) {
      this.handleParry();
    }
    if (Phaser.Input.Keyboard.JustDown(this.attackLeftKey)) {
      this.handleAttack("left");
    } else if (Phaser.Input.Keyboard.JustDown(this.attackRightKey)) {
      this.handleAttack("right");
    }
    if (Phaser.Input.Keyboard.JustDown(this.dodgeKey)) {
      this.handleDodge();
    }
    if (Phaser.Input.Keyboard.JustDown(this.launchSphereKey) && this.sphereProjectile) {
      this.launchSphere();
    }

    this.enemyIsAttached = this.enemies.some((enemy) => enemy.state === "attached");

    if (this.enemyIsAttached) {
      if (time > this.nextHealthTick) {
        this.health -= 5;
        this.entropy = Math.max(this.entropy - 2, 0);
        this.updateHealthBar();
        this.updateEntropyBar();
        this.nextHealthTick = time + 1000;
      }
      if (this.health <= 0) {
        this.playerDies();
      }
    } else {
      this.nextHealthTick = time + 1000;
    }
  }

  // =========================
  //        ENEMIES
  // =========================

  private spawnEnemy() {
    const size = 30;
    const color = 0xff0000;
    const startX = this.prospectivePoint.x + Phaser.Math.Between(-20, 20);
    const startY = this.prospectivePoint.y + Phaser.Math.Between(-20, 20);

    const enemyRect = this.add.rectangle(startX, startY, size, size, color)
      .setDepth(5);

    const smallZone = this.add.zone(startX, startY, size * 0.8, size * 0.8);
    const largeZone = this.add.zone(startX, startY, size * 2, size * 2);
    this.physics.world.enable(smallZone);
    this.physics.world.enable(largeZone);

    // Debug
    const smallZoneDebug = this.add.graphics();
    smallZoneDebug.setDepth(10);
    smallZoneDebug.lineStyle(2, 0x00ff00, 1);
    smallZoneDebug.strokeRect(
      smallZone.x - smallZone.width / 2,
      smallZone.y - smallZone.height / 2,
      smallZone.width,
      smallZone.height
    );

    const largeZoneDebug = this.add.graphics();
    largeZoneDebug.setDepth(10);
    largeZoneDebug.lineStyle(2, 0xff0000, 1);
    largeZoneDebug.strokeRect(
      largeZone.x - largeZone.width / 2,
      largeZone.y - largeZone.height / 2,
      largeZone.width,
      largeZone.height
    );

    const enemyData: EnemyData = {
      sprite: enemyRect,
      state: "moving",
      speed: 0.5,
      parryWindow: false,
      parryWindowTimer: 0,
      isAboutToHit: false,
      smallZone: smallZone,
      largeZone: largeZone,
      smallZoneDebug: smallZoneDebug,
      largeZoneDebug: largeZoneDebug
    };

    this.enemies.push(enemyData);
  }

  private handleEnemies() {
    const playerX = this.player.x;
    const playerY = this.player.y;

    this.enemies.forEach((enemy) => {
      if (enemy.state === "knocked") {
        return;
      }
      if (enemy.state === "attached") {
        enemy.sprite.x = playerX;
        enemy.sprite.y = playerY - 40;
        enemy.smallZone.x = enemy.sprite.x;
        enemy.smallZone.y = enemy.sprite.y;
        enemy.largeZone.x = enemy.sprite.x;
        enemy.largeZone.y = enemy.sprite.y;
      } else {
        const angle = Phaser.Math.Angle.Between(
          enemy.sprite.x,
          enemy.sprite.y,
          playerX,
          playerY
        );
        const dx = Math.cos(angle) * enemy.speed;
        const dy = Math.sin(angle) * enemy.speed;
        enemy.sprite.x += dx;
        enemy.sprite.y += dy;
        enemy.smallZone.x = enemy.sprite.x;
        enemy.smallZone.y = enemy.sprite.y;
        enemy.largeZone.x = enemy.sprite.x;
        enemy.largeZone.y = enemy.sprite.y;

        // parry window
        const dist = Phaser.Math.Distance.Between(
          enemy.sprite.x,
          enemy.sprite.y,
          playerX,
          playerY
        );
        if (dist < 60 && !enemy.isAboutToHit) {
          enemy.isAboutToHit = true;
          enemy.parryWindow = true;
          enemy.parryWindowTimer = 300;
        }
        if (enemy.parryWindow) {
          enemy.parryWindowTimer -= this.game.loop.delta;
          if (enemy.parryWindowTimer <= 0) {
            enemy.parryWindow = false;
            enemy.state = "attached";
          }
        }
      }

      // Aggiorno debug
      enemy.smallZoneDebug.clear();
      enemy.smallZoneDebug.lineStyle(2, 0x00ff00, 1);
      enemy.smallZoneDebug.strokeRect(
        enemy.smallZone.x - enemy.smallZone.width / 2,
        enemy.smallZone.y - enemy.smallZone.height / 2,
        enemy.smallZone.width,
        enemy.smallZone.height
      );

      enemy.largeZoneDebug.clear();
      enemy.largeZoneDebug.lineStyle(2, 0xff0000, 1);
      enemy.largeZoneDebug.strokeRect(
        enemy.largeZone.x - enemy.largeZone.width / 2,
        enemy.largeZone.y - enemy.largeZone.height / 2,
        enemy.largeZone.width,
        enemy.largeZone.height
      );
    });
  }

  /**
   * PARATA: 
   * - Se il player “para” e il nemico si trova nel collider grande => parata normale.
   * - Se il player “para” e il nemico si trova nel collider piccolo => parata perfetta (crea sfera blu che uccide i nemici vicini).
   */
  private handleParry() {
    // AGGIUNTA: Creiamo una parryZone attorno al player
    const parryZone = this.add.zone(this.player.x, this.player.y, 80, 80);
    this.physics.world.enable(parryZone);

    this.enemies.forEach((enemy) => {
      if (enemy.state === "moving" && enemy.parryWindow) {
        // 1) Controllo se il player “para” sul collider piccolo => parata perfetta
        if (this.checkOverlap(parryZone, enemy.smallZone)) {
          enemy.state = "knocked";
          enemy.parryWindow = false;
          // Creiamo la sfera blu che uccide i nemici vicini
          this.createBlueParrySphere(enemy.sprite.x, enemy.sprite.y);
          // Rimuoviamo il nemico colpito
          this.tweens.add({
            targets: enemy.sprite,
            x: enemy.sprite.x + Phaser.Math.Between(-300, 300),
            y: enemy.sprite.y + Phaser.Math.Between(-300, 300),
            duration: 400,
            onComplete: () => {
              this.destroyEnemy(enemy);
            },
          });
          // Entropia +15 ad esempio
          this.entropy = Math.min(this.entropy + 15, 100);
          this.updateEntropyBar();
        }
        // 2) Se non è nel piccolo, ma è nel grande => parata normale
        else if (this.checkOverlap(parryZone, enemy.largeZone)) {
          enemy.state = "knocked";
          enemy.parryWindow = false;
          this.tweens.add({
            targets: enemy.sprite,
            x: enemy.sprite.x + Phaser.Math.Between(-300, 300),
            y: enemy.sprite.y + Phaser.Math.Between(-300, 300),
            duration: 500,
            onComplete: () => {
              this.destroyEnemy(enemy);
            },
          });
          // Entropia +5 ad esempio
          this.entropy = Math.min(this.entropy + 5, 100);
          this.updateEntropyBar();
        }
      }
    });

    // Rimuoviamo la zone dopo il check
    parryZone.destroy();
  }

  /**
   * Attacco contro i nemici attaccati (collider grande).
   */
  private handleAttack(direction: "left" | "right") {
    this.enemies.forEach((enemy) => {
      if (enemy.state === "attached") {
        enemy.state = "knocked";
        const offsetX = direction === "left" ? -300 : 300;
        const offsetY = Phaser.Math.Between(-50, 50);
        this.tweens.add({
          targets: enemy.sprite,
          x: enemy.sprite.x + offsetX,
          y: enemy.sprite.y + offsetY,
          duration: 400,
          onComplete: () => {
            this.destroyEnemy(enemy);
            // Se distruggiamo il nemico, entropia +5
            this.entropy = Math.min(this.entropy + 5, 100);
            this.updateEntropyBar();
          },
        });
      }
    });
  }

  private handleDodge() {
    // (Codice originale di schivata)
    const dodgeZone = this.add.zone(this.player.x, this.player.y, 150, 150);
    this.physics.world.enable(dodgeZone);
    this.time.delayedCall(100, () => {
      dodgeZone.destroy();
    });

    this.enemies.forEach((enemy) => {
      if (this.checkOverlap(dodgeZone, enemy.largeZone)) {
        if (this.checkOverlap(dodgeZone, enemy.smallZone)) {
          this.entropy = Math.min(this.entropy + 15, 100);
          this.updateEntropyBar();
          if (!this.sphereProjectile) {
            this.createSphereProjectile();
          }
        } else {
          this.entropy = Math.min(this.entropy + 5, 100);
          this.updateEntropyBar();
        }
        enemy.state = "knocked";
        this.destroyEnemy(enemy);
      }
    });
  }

  private destroyEnemy(enemy: EnemyData) {
    enemy.sprite.destroy();
    enemy.smallZone.destroy();
    enemy.largeZone.destroy();
    enemy.smallZoneDebug.destroy();
    enemy.largeZoneDebug.destroy();
  }

  private checkOverlap(
    obj1: Phaser.GameObjects.Zone | Phaser.GameObjects.Arc,
    obj2: Phaser.GameObjects.Zone | Phaser.GameObjects.Arc
  ): boolean {
    const body1 = obj1.body as Phaser.Physics.Arcade.Body;
    const body2 = obj2.body as Phaser.Physics.Arcade.Body;
    if (!body1 || !body2) return false;

    const rect1 = new Phaser.Geom.Rectangle(body1.x, body1.y, body1.width, body1.height);
    const rect2 = new Phaser.Geom.Rectangle(body2.x, body2.y, body2.width, body2.height);
    return Phaser.Geom.Intersects.RectangleToRectangle(rect1, rect2);
  }

  /**
   * Crea una sfera “perfetta parry” (blu) che uccide i nemici vicini immediatamente.
   */
  // AGGIUNTA: nuova sfera blu per la parata perfetta
  private createBlueParrySphere(x: number, y: number) {
    const sphere = this.add.arc(x, y, 40, 0, 360, false, 0x0000ff)
      .setDepth(60);
    // Subito dopo la creazione, controlla i nemici vicini e li elimina
    const explosionZone = this.add.zone(x, y, 80, 80);
    this.physics.world.enable(explosionZone);

    this.enemies.forEach((enemy) => {
      if (this.checkOverlap(explosionZone, enemy.largeZone)) {
        enemy.state = "knocked";
        this.destroyEnemy(enemy);
      }
    });

    explosionZone.destroy();
    // Rimuoviamo la sfera dopo un piccolo delay (effetto scenico)
    this.time.delayedCall(300, () => {
      sphere.destroy();
    });
  }

  // (Codice già esistente per la sfera da schivata perfetta)
  private createSphereProjectile() {
    this.sphereProjectile = this.add.arc(this.player.x, this.player.y, 15, 0, 360, false, 0xffff00)
      .setDepth(50);
    this.physics.world.enable(this.sphereProjectile);
    (this.sphereProjectile.body as Phaser.Physics.Arcade.Body).setCircle(15);
    this.sphereActive = true;
    this.time.delayedCall(3000, () => {
      if (this.sphereActive) {
        this.explodeSphere();
      }
    });
  }

  private launchSphere() {
    if (this.sphereProjectile) {
      this.sphereActive = false;
      const targetX = this.sphereProjectile.x + Phaser.Math.Between(-300, 300);
      const targetY = this.sphereProjectile.y + Phaser.Math.Between(-300, 300);
      this.tweens.add({
        targets: this.sphereProjectile,
        x: targetX,
        y: targetY,
        duration: 500,
        onComplete: () => {
          this.explodeSphere();
        }
      });
    }
  }

  private explodeSphere() {
    if (this.sphereProjectile) {
      const explosionZone = this.add.zone(
        this.sphereProjectile.x,
        this.sphereProjectile.y,
        100,
        100
      );
      this.physics.world.enable(explosionZone);

      this.enemies.forEach((enemy) => {
        if (this.checkOverlap(explosionZone, enemy.largeZone)) {
          enemy.state = "knocked";
          this.destroyEnemy(enemy);
        }
      });

      explosionZone.destroy();
      this.sphereProjectile.destroy();
      this.sphereProjectile = null;
    }
  }

  // =========================
  //       BUILDINGS
  // =========================

  private CreateBuildingSector() {
    for (let i = 0; i < 20; i++) {
      this.buildSection.push(
        this.physics.add.image(96 * i + 50, this.centerY - 80, "coll")
          .setScale(96, 20)
          .setOrigin(0)
          .setDepth(2)
          .setAlpha(0)
      );
      if (i % 2 > 0) {
        this.buildSection[i].setTint(0x00ff00);
      }
    }
  }

  private Buildings() {
    if (this.buildings[0] != null) {
      this.buildings.forEach((element) => {
        switch (element.getSection()) {
          case 1:
            element.setDirection(-1, 0.02);
            element.setScaleUpdate(0.01);
            element.setDepth(3);
            break;
          case 2:
            element.setDirection(-1, 0.05);
            element.setScaleUpdate(0.01);
            element.setDepth(4);
            break;
          case 3:
            element.setDirection(-1, 0.05);
            element.setScaleUpdate(0.01);
            element.setDepth(5);
            break;
          case 4:
            element.setDirection(-1, 0.06);
            element.setScaleUpdate(0.01);
            element.setDepth(6);
            break;
          case 5:
            element.setDirection(-1, 0.07);
            element.setScaleUpdate(0.014);
            element.setDepth(7);
            break;
          case 6:
            element.setDirection(-1, 0.1);
            element.setScaleUpdate(0.018);
            element.setDepth(8);
            break;
          case 7:
            element.setDirection(-2.1, 0.15);
            element.setScaleUpdate(0.04);
            element.setDepth(9);
            break;
          case 8:
            element.setDirection(-2.2, 0.2);
            element.setScaleUpdate(0.08);
            element.setDepth(10);
            break;
          case 9:
            element.setDirection(0.7, 0.5);
            element.setScaleUpdate(0.1);
            element.setDepth(10);
            break;
          case 10:
            element.setDirection(2.2, 0.5);
            element.setScaleUpdate(0.1);
            element.setDepth(9);
            break;
          case 11:
            element.setDirection(2, 0.25);
            element.setScaleUpdate(0.06);
            element.setDepth(8);
            break;
          case 12:
            element.setDirection(2.3, 0.1);
            element.setScaleUpdate(0.04);
            element.setDepth(7);
            break;
          case 13:
            element.setDirection(2.5, 0.04);
            element.setScaleUpdate(0.02);
            element.setDepth(6);
            break;
          case 14:
            element.setDirection(2.4, 0.01);
            element.setScaleUpdate(0.016);
            element.setDepth(5);
            break;
          case 15:
            element.setDirection(2.6, 0.008);
            element.setScaleUpdate(0.012);
            element.setDepth(4);
            break;
          case 16:
            element.setDirection(2.6, 0.008);
            element.setScaleUpdate(0.012);
            element.setDepth(3);
            break;
          case 17:
            element.setDirection(2.6, 0.008);
            element.setScaleUpdate(0.012);
            element.setDepth(3);
            break;
          case 18:
            element.setDirection(2.6, 0.008);
            element.setScaleUpdate(0.012);
            element.setDepth(3);
            break;
          case 19:
            element.setDirection(2.6, 0.008);
            element.setScaleUpdate(0.012);
            element.setDepth(3);
            break;
        }
      });
    }

    if (this.W.isDown) {
      this.buildings.forEach((element) => {
        element.x += element.getDirection()[0] * (element.scale / 3);
        element.y += element.getDirection()[1] * (element.scale / 3);
        element.setScale(element.scale + element.getScaleUpdate());
      });
      this.generationBar += Phaser.Math.Between(1, 2);
    } else if (this.S.isDown) {
      this.buildings.forEach((element) => {
        element.x -= element.getDirection()[0] * (element.scale / 3);
        element.y -= element.getDirection()[1] * (element.scale / 3);
        element.setScale(element.scale - element.getScaleUpdate());
      });
    }

    if (this.generationBar >= 200) {
      this.buildings.push(
        new Building(
          this,
          95,
          this.centerY - 90,
          "sword0",
          Phaser.Math.Between(1, 19)
        )
      );
      this.generationBar = 0;
    }
  }

  private CreateAnimation() {
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

// =========================
//     TIPO DATI NEMICO
// =========================

interface EnemyData {
  sprite: Phaser.GameObjects.Rectangle;
  state: "moving" | "attached" | "knocked";
  speed: number;
  parryWindow: boolean;
  parryWindowTimer: number;
  isAboutToHit: boolean;
  smallZone: Phaser.GameObjects.Zone;
  largeZone: Phaser.GameObjects.Zone;
  smallZoneDebug: Phaser.GameObjects.Graphics;
  largeZoneDebug: Phaser.GameObjects.Graphics;
}

class EmergencyServices extends Phaser.Scene {
    constructor() {
        super({
            key: 'emergencyServicesScene',
            physics: {
            matter: {
                debug: true,
                gravity: { y: 0 },
                //debugShowBody: true,
                debugBodyColor: 0x0000ff
            }
            }
        });
    }
    
    preload() {
        this.load.path = 'assets/Emergency/';
        this.load.image('ambulance',    'ambulance.png');
        this.load.image('arrow',        'arrow.png');
        this.load.image('tilesetImage', 'tileset.png');
        this.load.tilemapTiledJSON('tilemapJSON', 'CityTilemap.json');
    }

    create(){
      //
      this.map = this.add.tilemap('tilemapJSON');
      const tileset       = this.map.addTilesetImage('tileset', 'tilesetImage');
      const roadLayer     = this.map.createLayer('Road', tileset, 0, 0);
      const buildingLayer = this.map.createLayer('Buildings', tileset, 0, 0);
      buildingLayer.setCollisionByProperty({ collides: true });
      this.objectives = this.map.getObjectLayer('Objective Layer').objects;
      this.curObjective = Phaser.Utils.Array.GetRandom(this.objectives, 0, this.objectives.length);
      
      this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);

      this.cursors = this.input.keyboard.addKeys({
          up:  Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right:Phaser.Input.Keyboard.KeyCodes.D });

      //Set up ambulance
      this.ambulance = this.matter.add.sprite(centerX, centerY, 'ambulance').setOrigin(0.5, 0.5);
      this.ambulanceScale = 0.5;
      this.ambulance.setScale(this.ambulanceScale);
      this.ambulance.speed = 0.0006 * this.ambulanceScale;
      this.ambulance.turnSpeed = 0.05;
      this.ambulance.setBounce(0);
      this.ambulance.setFrictionAir(0.2);
      this.ambulance.setFriction(0.5);
      this.ambulance.isMoving = function() { return (this.body.velocity > 0.05 || this.body.velocity < -0.05); }

      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.setZoom(2);
      this.cameras.main.startFollow(this.ambulance, true, 0.25, 0.25);

      
      this.arrow = new ObjectiveArrow(this, 0, 0, 'arrow', this.curObjective, this.ambulance).setOrigin(0.5, 0.5);
      //this.arrow.setScrollFactor(0);

      this.frameTime = 0;
    }

    update(time, delta){
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }
        this.frameTime = 0;

        //Handle ambulance movement
        if (this.cursors.up.isDown) {
          this.ambulance.thrust(this.ambulance.speed);
          this.ambulance.moving = true;
        } else if (this.cursors.down.isDown) {
          this.ambulance.thrust(-this.ambulance.speed);
          this.ambulance.moving = true;
        } else {
          this.ambulance.moving = false;
        }
        
        if (this.cursors.left.isDown && this.ambulance.moving) {
          this.ambulance.setAngularVelocity(-this.ambulance.turnSpeed);
        } else if (this.cursors.right.isDown && this.ambulance.moving) {
          this.ambulance.setAngularVelocity(this.ambulance.turnSpeed);
        } else {
          this.ambulance.setAngularVelocity(0);
        }

        this.arrow.update();
    }


    generateObjective(){

    }
}
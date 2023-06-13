class EmergencyServices extends Phaser.Scene {
    constructor() {
        super({
            key: 'ambulanceScene',
            physics: {
            matter: {
                debug: false,
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
        this.load.image('objective',    'ObjectiveSprite.png');
        this.load.image('tilesetImage', 'tileset.png');
        this.load.tilemapTiledJSON('tilemapJSON', 'CityTilemap.json');
    }

    create(){
      //Set up map and physics
      this.map = this.add.tilemap('tilemapJSON');
      const tileset       = this.map.addTilesetImage('tileset', 'tilesetImage');
      const roadLayer     = this.map.createLayer('Road', tileset, 0, 0);
      const buildingLayer = this.map.createLayer('Buildings', tileset, 0, 0);
      buildingLayer.setCollisionByProperty({ collides: true });
      this.matter.world.convertTilemapLayer(buildingLayer);
      buildingLayer.setDepth(4);

      this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);

      //Set up objectives
      this.objectives = this.map.getObjectLayer('Objective Layer').objects;
      this.objectiveSprite = this.add.sprite(centerX, centerY, 'objective').setOrigin(0.5, 1);
      this.objectiveSprite.setScale(0.5);
      this.curObjective = Phaser.Utils.Array.GetRandom(this.objectives, 0, this.objectives.length);
      this.objectiveSprite.x = this.curObjective.x; this.objectiveSprite.y = this.curObjective.y;

      //Set up input
      this.cursors = this.input.keyboard.addKeys({
          up:  Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right:Phaser.Input.Keyboard.KeyCodes.D });
      this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
      this.keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

      //Set up ambulance
      this.ambulance = this.matter.add.sprite(centerX, centerY, 'ambulance').setOrigin(0.5, 0.5);
      this.ambulanceScale = 0.5;
      this.ambulance.setScale(this.ambulanceScale);
      this.ambulance.speed = 0.0015 * this.ambulanceScale;
      this.ambulance.turnSpeed = 0.06;
      this.ambulance.setBounce(0);
      this.ambulance.setFrictionAir(0.2);
      this.ambulance.setFriction(0.5);
      this.ambulance.isMoving = function() { return (this.body.velocity > 0.05 || this.body.velocity < -0.05); }

      //Camera
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.setZoom(2);
      this.cameras.main.startFollow(this.ambulance, true, 0.25, 0.25);

      //Objective arrow
      this.arrow = new ObjectiveArrow(this, 0, 0, 'arrow', this.curObjective, this.ambulance).setOrigin(0.5, 0.5);
      //this.arrow.setScrollFactor(0);

      //Variables and setup for managing the game timer
      this.frameTime = 0;
      timeLeft = secondsPerGame * 1000.0;
      secondsLeft = secondsPerGame;
      timeCounter.setText("Time: " + secondsPerGame);

      // Pause to show the tutorial      
      this.scene.pause();  
    }

    update(time, delta){
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }
        timeLeft -= this.frameTime; 
        this.frameTime = 0;
  
        //Update the clock
        if(timeLeft / 1000.0 < secondsLeft){ 
          secondsLeft = Math.trunc(timeLeft / 1000.0);
          timeCounter.setText("Time: " + secondsLeft);
        }
        //Move to the next scene if time has run out
        if(secondsLeft <= 0){
          this.scene.stop().start('operatorScene');
        }

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

        //Handle pause and fullscreen button input
        if (Phaser.Input.Keyboard.JustDown(this.keyPause)) {
          this.scene.pause().launch('pauseScene', { sceneTitle: 'ambulanceScene' });
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyFullscreen)){
          this.scale.toggleFullscreen();
        }

        //Check objectives
        //console.log(Phaser.Math.Distance.Between(this.ambulance.position, this.curObjective.position))
        if(Phaser.Math.Distance.Between(this.ambulance.x, this.ambulance.y, this.curObjective.x, this.curObjective.y) < 20){
          score += 5;
          this.generateObjective();
        }

        this.arrow.update();
    }

    generateObjective(){
      const curObj = this.curObjective;
      while(curObj == this.curObjective){
        this.curObjective = Phaser.Utils.Array.GetRandom(this.objectives, 0, this.objectives.length);
      }
      this.objectiveSprite.x = this.curObjective.x; this.objectiveSprite.y = this.curObjective.y;
      this.arrow.objective = this.curObjective;
    }
}


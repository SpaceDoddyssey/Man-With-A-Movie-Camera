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
      //
      this.map = this.add.tilemap('tilemapJSON');
      const tileset       = this.map.addTilesetImage('tileset', 'tilesetImage');
      const roadLayer     = this.map.createLayer('Road', tileset, 0, 0);
      const buildingLayer = this.map.createLayer('Buildings', tileset, 0, 0);
      buildingLayer.setCollisionByProperty({ collides: true });
      this.matter.world.convertTilemapLayer(buildingLayer);
      buildingLayer.setDepth(4);

      this.objectives = this.map.getObjectLayer('Objective Layer').objects;
      this.objectiveSprite = this.add.sprite(centerX, centerY, 'objective').setOrigin(0.5, 1);
      this.objectiveSprite.setScale(0.5);
      this.curObjective = Phaser.Utils.Array.GetRandom(this.objectives, 0, this.objectives.length);
      this.objectiveSprite.x = this.curObjective.x; this.objectiveSprite.y = this.curObjective.y;
      
      this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);

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

      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.setZoom(2);
      this.cameras.main.startFollow(this.ambulance, true, 0.25, 0.25);

      
      this.arrow = new ObjectiveArrow(this, 0, 0, 'arrow', this.curObjective, this.ambulance).setOrigin(0.5, 0.5);
      //this.arrow.setScrollFactor(0);

      this.frameTime = 0;
      
      this.timeLeft = 60000.0;
      this.secondsLeft = Math.trunc(this.timeLeft / 1000);

      // UI text
      this.scoreCounter = this.add.text(this.cameras.main.worldView.x, 
                                        this.cameras.main.worldView.y, 
                                        'Score: ' + score, EmergScoreConfig).setDepth(6);
      this.timeCounter  = this.add.text(this.cameras.main.worldView.x + this.cameras.main.worldView.width - 80,
                                        this.cameras.main.worldView.y, 
                                        'Time: ' + this.secondsLeft, EmergTimeConfig).setDepth(6);

      this.scene.pause().launch('emergTutorial');                
    }

    update(time, delta){
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }
        this.frameTime = 0;
        this.timeLeft -= delta; 
        if(this.timeLeft / 1000.0 < this.secondsLeft){ 
          this.secondsLeft = Math.trunc(this.timeLeft / 1000.0);
          this.timeCounter.text = 'Time: ' + this.secondsLeft; 
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
          this.scoreCounter.text = 'Score: ' + score;
          this.generateObjective();
        }

        this.arrow.update();

        this.uiUpdate();

        if(this.timeLeft <= 0){
          this.scene.stop().start('operatorScene');
        }
    }

    generateObjective(){
      const curObj = this.curObjective;
      while(curObj == this.curObjective){
        this.curObjective = Phaser.Utils.Array.GetRandom(this.objectives, 0, this.objectives.length);
      }
      this.objectiveSprite.x = this.curObjective.x; this.objectiveSprite.y = this.curObjective.y;
      this.arrow.objective = this.curObjective;
    }

    uiUpdate() {
      this.scoreCounter.x = this.cameras.main.worldView.x;
      this.scoreCounter.y = this.cameras.main.worldView.y;

      this.timeCounter.x = this.cameras.main.worldView.x + this.cameras.main.worldView.width - EmergTimeConfig.fixedWidth;
      this.timeCounter.y = this.cameras.main.worldView.y;
  }
}


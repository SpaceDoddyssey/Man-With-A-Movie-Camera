class EmergencyServices extends Phaser.Scene {
    constructor() {
        super({
            key: 'emergencyServicesScene',
            physics: {
            matter: {
                debug: true,
                gravity: { y: 0 },
                debugShowBody: true,
                debugBodyColor: 0x0000ff
            }
            }
        });
    }
    
    preload() {
        this.load.path = 'assets/Emergency/';
        this.load.image('ambulance',           'ambulance.png')
    }

    create(){
        this.worldWidth = game.config.width * 4;
        this.worldHeight = game.config.height * 4;

        this.matter.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        this.cursors = this.input.keyboard.addKeys({
            up:  Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D });

        this.ambulance = this.matter.add.sprite(centerX, centerY, 'ambulance').setOrigin(0.5, 0.5);
        this.ambulance.setScale(0.5);
        this.ambulance.speed = 0.03;
        this.ambulance.turnSpeed = 0.04;
        this.ambulance.setBounce(0);
        this.ambulance.setFrictionAir(0.2);
        this.ambulance.setFriction(0.5);
        this.ambulance.isMoving = function() { return (this.body.velocity > 0.05 || this.body.velocity < -0.05); }

        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.ambulance, true, 0.25, 0.25);
        this.physics.world.bounds.setTo(0, 0, this.worldWidth, this.worldHeight);
    }

    update(){

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
    }
}
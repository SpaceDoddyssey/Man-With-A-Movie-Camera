class ShootingGallery extends Phaser.Scene {
    constructor() {
        super("shootingGalleryScene");
    }
    
    preload() {
      //load images (planning to do this)
    }

    create(){
        // Initialize list of enemy sprites

        // Create enemies
        this.enemies = this.physics.add.group();
        this.createEnemies();

        this.rifleFX = this.sound.add('airRifle', { volume: 1 })

        // Set up mouse click event
        this.input.on('pointerdown', this.shoot, this);

        //Start timer
        this.frameTime = 0;
        timeLeft = secondsPerGame * 1000.0;
        secondsLeft = secondsPerGame;
        timeCounter.setText("Time: " + secondsPerGame);

        //I really don't know why but having a universal key variable didn't work, I have to set it at the start of each scene :|
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        this.keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        //this.scene.pause().launch('shootingTutorial'); //Doesn't exist yet  
    }

    shoot(pointer){
        this.rifleFX.play();
        console.log(pointer.x, pointer.y);
    }

    update(time, delta){
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }
        timeLeft -= this.frameTime;
        this.frameTime = 0;
        
        if(timeLeft / 1000.0 < secondsLeft){ 
            secondsLeft = Math.trunc(timeLeft / 1000.0);
            timeCounter.setText("Time: " + secondsLeft);
        }
        
        if(timeLeft <= 0){
            this.scene.start("gameOverScene");
        }

        //Handle pause and fullscreen button input
        if (Phaser.Input.Keyboard.JustDown(this.keyPause)) {
            this.scene.pause().launch('pauseScene', { sceneTitle: 'shootingGalleryScene' });
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }

    createEnemies() {
        // enemySlot 1: Moves up and down
        const enemySlot1 = this.enemies.create(Phaser.Math.Between(50, 750), 50, 'enemySlot1');
        this.tweens.add({
            targets: enemySlot1,
            y: 550,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // enemySlot 2: Moves across the screen in a sine wave pattern
        const enemySlot2 = this.enemies.create(50, 150, 'enemySlot2');
        this.tweens.add({
            targets: enemySlot2,
            x: 750,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // enemySlots 3-6: Stationary targets
        const enemySlot3 = this.enemies.create(750, 300, 'enemySlot3');
    }
}
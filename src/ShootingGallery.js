class ShootingGallery extends Phaser.Scene {
    constructor() {
        super({
            key: "shootingGalleryScene",
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
        this.load.path = 'assets/Gallery/';
        this.load.image('Brute', 'Brute.png');
        this.load.image('Soldier1', 'Soldier1.png');
        this.load.image('Soldier2', 'Soldier2.png');
        this.load.image('Uncle_Fascist', 'Uncle_Fascist.png');
        this.load.image('bang', 'bang.png');
    }

    create(){
        // Initialize list of enemy sprites

        // Create enemies
        this.enemies = []
        this.createEnemies();

        this.rifleFX = this.sound.add('airRifle', { volume: 1 })

        // Set up mouse click event
        this.input.on('pointerdown', this.shoot, this);

        //Start timer
        this.frameTime = 0;
        timeLeft = secondsPerGame * 500.0;
        secondsLeft = secondsPerGame / 2;
        timeCounter.setText("Time: " + secondsPerGame);

        //I really don't know why but having a universal key variable didn't work, I have to set it at the start of each scene :|
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        this.keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        //pause to show tutorial
        this.scene.pause(); 
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

        //Update the clock
        if(timeLeft / 1000.0 < secondsLeft){ 
            secondsLeft = Math.trunc(timeLeft / 1000.0);
            timeCounter.setText("Time: " + secondsLeft);
        }
        //Finish if time has run out
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
        this.enemySlot1 = this.matter.add.sprite(Phaser.Math.Between(50, 750), 50, 'enemySlot1');
        this.tweens.add({
            targets: this.enemySlot1,
            y: 550,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        this.enemies.push(this.enemySlot1);

        // enemySlot 2: Moves across the screen in a sine wave pattern
        this.enemySlot2 = this.add.sprite(50, 150, 'enemySlot2');
        this.tweens.add({
            targets: this.enemySlot2,
            x: 750,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.enemies.push(this.enemySlot2);

        // enemySlots 3-6: Stationary targets
        this.enemySlot3 = this.add.sprite(750, 300, 'enemySlot3');
        this.enemies.push(this.enemySlot3);

        this.enemySlot3 = this.add.sprite(750, 500, 'enemySlot3');
        this.enemies.push(this.enemySlot3);

        this.enemies.forEach(enemy => {
            //enemy.visible = false;
        })
    }
}
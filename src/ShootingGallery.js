class ShootingGallery extends Phaser.Scene {
    constructor() {
        super({
            key: "shootingGalleryScene",
            physics: {
                matter: {
                    debug: false,
                    gravity: { y: 0 },
                    debugShowBody: true,
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
        this.load.image('crosshairs', 'Crosshairs.png')
        this.load.image('fullbackground', 'fullbg.png')
    }

    create(){
        // Create background
        this.bg = this.add.sprite(centerX, centerY, 'fullbackground');
        // This bool is so that, when I'm checking the list of objects you clicked on, I can check if the first object is the background (i.e., you missed)
        this.bg.isBackground = true;

        // Create enemies
        this.enemies = []
        this.createEnemies();
        // Array of enemy sprites for random picking
        this.enemySprites = ['Brute', 'Soldier1', 'Soldier2', 'Uncle_Fascist'];

        this.rifleFX = this.sound.add('airRifle', { volume: 1 })

        // Set up mouse click event
        this.input.on('pointerdown', this.shoot, this);

        //Start timer
        this.frameTime = 0;
        timeLeft = secondsPerGame * 500.0;
        secondsLeft = secondsPerGame / 2;
        timeCounter.setText("Time: " + secondsPerGame);

        //Start enemy timer
        this.enemyTimer = 1500;
        this.enemyRate = 1500;

        //I really don't know why but having a universal key variable didn't work, I have to set it at the start of each scene :|
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        this.keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        //pause to show tutorial
        this.scene.pause(); 
    }

    shoot(pointer, targets){
        this.rifleFX.play();
        
        targets.forEach(target => {
            this.hit(target);
        })

        //Creates the little temporary explosion effect    
        if(targets[0] != undefined){
            let sprite = this.add.sprite(pointer.x, pointer.y, 'bang').setOrigin(0.5);
            let timer = this.time.addEvent({
                delay: 100, 
                callback: () => sprite.destroy(),
            });
        }
    }

    hit(target){
        score += target.scoreVal;
        target.setVisible(false);
    }

    update(time, delta){
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }

        //Update timers
        timeLeft -= this.frameTime;
        this.enemyTimer -= this.frameTime;
        this.enemies.forEach(enemy => {
            enemy.timer -= this.frameTime;
            if(enemy.timer <= 0){
                enemy.visible = false;
                enemy.isActive = false;
            }
        })
        this.frameTime = 0;

        //Update the clock
        if(timeLeft / 1000.0 < secondsLeft){ 
            secondsLeft = Math.trunc(timeLeft / 1000.0);
        }
        //Finish the game if time has run out
        if(timeLeft <= 0){
            this.input.setDefaultCursor('');
            this.scene.stop('hudScene');
            this.scene.stop().start("gameOverScene");
        }

        //Spawn enemies if it's time
        if(this.enemyTimer <= 0){
            this.spawnEnemies(2);
            this.enemyTimer = this.enemyRate;
        }
        
        //Handle pause and fullscreen button input
        if (Phaser.Input.Keyboard.JustDown(this.keyPause)) {
            this.input.setDefaultCursor('');
            this.scene.pause().launch('pauseScene', { sceneTitle: 'shootingGalleryScene' });
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }

    spawnEnemies(num){
        for(let i = 0; i < 2; i++){
            let enemy = Phaser.Utils.Array.GetRandom(this.enemies, 0, this.enemies.length);
            while (enemy.isActive) {
            enemy = Phaser.Utils.Array.GetRandom(this.enemies, 0, this.enemies.length);
            } 

            enemy.isActive = true;
            enemy.visible = true;
            enemy.timer = enemy.timeUp;

            enemy.setTexture(Phaser.Utils.Array.GetRandom(this.enemySprites, 0, this.enemySprites.length))
            enemy.setInteractive();
        }
    }

    createEnemies() {
        // enemySlot 1: Moves up and down
        this.enemySlot1 = this.matter.add.sprite(centerX, 50, 'enemySlot1');
        this.tweens.add({
            targets: this.enemySlot1,
            y: 550,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        this.enemies.push(this.enemySlot1);
        this.enemySlot1.timeUp = 2000;
        this.enemySlot1.scoreVal = 2;
  
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
        this.enemySlot2.timeUp = 2000;
        this.enemySlot2.scoreVal = 2;

        // enemySlots 3-6: Stationary targets
        this.enemySlot3 = this.add.sprite(750, 300, 'enemySlot3');
        this.enemies.push(this.enemySlot3);
        this.enemySlot3.timeUp = 1500;
        this.enemySlot3.scoreVal = 1;

        this.enemySlot4 = this.add.sprite(750, 500, 'enemySlot4');
        this.enemies.push(this.enemySlot4);
        this.enemySlot4.timeUp = 1500;
        this.enemySlot4.scoreVal = 1;

        this.enemySlot5 = this.add.sprite(200, 500, 'enemySlot5');
        this.enemies.push(this.enemySlot5);
        this.enemySlot5.timeUp = 1500;
        this.enemySlot5.scoreVal = 1;

        this.enemySlot6 = this.add.sprite(200, 300, 'enemySlot6');
        this.enemies.push(this.enemySlot6);
        this.enemySlot6.timeUp = 1500;
        this.enemySlot6.scoreVal = 1;

        this.enemies.forEach(enemy => {
            enemy.visible = false;
             //We also have to do this for every enemy unfortunately
            enemy.setInteractive({ cursor: 'url(assets/Gallery/Crosshairs.png) 32 32, auto' });
            enemy.isActive = false;
            enemy.timer = 0;
        })
    }
}
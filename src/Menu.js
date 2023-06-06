class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      this.load.path = 'assets/Sounds/';
      this.load.audio('music', '1st Contact - The Long Let Go.mp3');
      this.load.audio('ring1', 'Ring1.wav');
      this.load.audio('ring2', 'Ring2.wav');
      this.load.audio('ring3', 'Ring3.mp3');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // Music
        if(musicPlaying == false){
          this.music = this.sound.add('music');
          this.sound.play('music', { volume: 0.4 });
        }
        musicPlaying = true;

        // show menu text
        this.add.text(centerX, centerY - 160, ' Man With A Movie Camera ', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';

        const EmergencyButton = this.add.text(centerX, centerY - 80, ' Begin ', menuConfig).setOrigin(0.5).setInteractive();
        EmergencyButton.on('pointerdown', (pointer) =>
        {
          this.scene.stop().start('ambulanceScene');
        });

        // const OperatorButton = this.add.text(centerX, centerY , ' Operator scene ', menuConfig).setOrigin(0.5).setInteractive();
        // OperatorButton.on('pointerdown', (pointer) =>
        // {
        //   this.scene.stop().start('operatorScene');
        // });      

        // const ShootingGalleryButton = this.add.text(centerX, centerY + 80, ' Shooting Gallery scene (Not Implemented) ', menuConfig).setOrigin(0.5).setInteractive();
        // ShootingGalleryButton.on('pointerdown', (pointer) =>
        // {
        //   this.scene.start('shootingGalleryScene');
        // });

        menuConfig.backgroundColor = '#1111AA';
        const CreditsButton = this.add.text(centerX, centerY + 160, ' Credits ', menuConfig).setOrigin(0.5).setInteractive();
        CreditsButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('creditsScene');
        });

        score = 0;

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
      }

    update() {
      if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
        this.scale.toggleFullscreen();
      }
    }
}
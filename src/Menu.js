class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      this.load.path = 'assets/';
      this.load.audio('music', 'Sounds/1st Contact - The Long Let Go.mp3');
      this.load.audio('ring1', 'Sounds/Ring1.wav');
      this.load.audio('ring2', 'Sounds/Ring2.wav');
      this.load.audio('ring3', 'Sounds/Ring3.mp3');

      this.load.image('bgImage', 'MenuBG.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            backgroundColor: '#AAAAAA',
            color: '#000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // Menu background image
        this.bgImage = this.add.image(centerX, centerY, 'bgImage');

        // Music
        if(musicPlaying == false){
          this.music = this.sound.add('music');
          this.sound.play('music', { volume: 0.4, repeat: -1 });
        }
        musicPlaying = true;

        // show menu text
        this.add.text(centerX, centerY - 160, ' Man With A Movie Camera ', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#F3B141';
        menuConfig.fontSize = '28px'

        const EmergencyButton = new Button(centerX, centerY-80, ' Scene 1: Ambulance ', this, () => {
          this.scene.stop().start('ambulanceScene');
        }, menuConfig);

        const OperatorButton = new Button(centerX, centerY, ' Scene 2: Operator ', this, () => {
          this.scene.stop().start('operatorScene');
        }, menuConfig);

        const ShootingGalleryButton = new Button(centerX, centerY + 80, ' Scene 3: Shooting Gallery ', this, () => {
          this.scene.stop().start('shootingGalleryScene');
        }, menuConfig);

        menuConfig.backgroundColor = '#1111AA';
        menuConfig.fontSize = '28px';
        const CreditsButton = new Button(centerX, centerY + 160, ' Credits ', this, () => {
          this.scene.stop().start('creditsScene');
        }, menuConfig);


        // const CreditsButton = this.add.text(centerX, centerY + 160, ' Credits ', menuConfig).setOrigin(0.5).setInteractive();
        // CreditsButton.on('pointerdown', (pointer) =>
        // {
        //   this.scene.start('creditsScene');
        // });

        score = 0;

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
      }

    update() {
      if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
        this.scale.toggleFullscreen();
      }
    }
}
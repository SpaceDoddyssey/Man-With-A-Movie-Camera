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
      this.load.audio('airRifle', 'Sounds/AirRifle.mp3')

      this.load.image('bgImage', 'MenuBG.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'RedOctober_Fat',
            fontSize: '40px',
            backgroundColor: '#000000',
            color: '#FFF',
            align: 'left',
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

        let menuButtonXOffset = 400;
        // show menu text
        this.add.text(centerX - menuButtonXOffset, centerY - 160, ' Man With A Movie Camera ', menuConfig);
        menuConfig.fontSize = '28px'
        menuConfig.backgroundColor = '#FFD700';
        menuConfig.color = '#000000';

        const EmergencyButton = new Button(centerX - menuButtonXOffset, centerY-80, ' Scene 1: Ambulance ', this, () => {
          this.scene.start('hudScene');
          this.scene.launch('ambulanceScene').launch('emergTutorial');
        }, menuConfig, 0);

        const OperatorButton = new Button(centerX - menuButtonXOffset, centerY, ' Scene 2: Operator ', this, () => {
          this.scene.start('hudScene')
          this.scene.launch('operatorScene').launch('operatorTutorial');
        }, menuConfig, 0);

        const ShootingGalleryButton = new Button(centerX - menuButtonXOffset, centerY + 80, ' Scene 3: Shooting Gallery ', this, () => {
          this.scene.start('hudScene');
          this.scene.stop().launch('shootingGalleryScene').launch('shootingTutorial');
        }, menuConfig, 0);

        menuConfig.backgroundColor = '#CC0000';
        menuConfig.color = '#FFFFFF';
        menuConfig.fontSize = '28px';
        const CreditsButton = new Button(centerX - menuButtonXOffset, centerY + 160, ' Credits ', this, () => {
          this.scene.stop().start('creditsScene');
        }, menuConfig, 0);

        score = 0;

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
      }

    update() {
      if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
        this.scale.toggleFullscreen();
      }
    }
}

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      
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

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 4 - borderPadding, ' Man With A Movie Camera ', menuConfig).setOrigin(0.5);
        //let tutorialText = this.add.text(game.config.width/2, game.config.height/2 + borderUISize, 'WASD to move, click to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';

        const OperatorButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 6, ' Operator scene ', menuConfig).setOrigin(0.5).setInteractive();
        OperatorButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('operatorScene');
        });
      
        const EmergencyButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 2, ' Emergency scene ', menuConfig).setOrigin(0.5).setInteractive();
        EmergencyButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('emergencyServicesScene');
        });

        const ShootingGalleryButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 10, ' Shooting Gallery scene (Not Implemented) ', menuConfig).setOrigin(0.5).setInteractive();
        ShootingGalleryButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('shootingGalleryScene');
        });

      }

    update() {
    }
}
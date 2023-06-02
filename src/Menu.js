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
        this.add.text(centerX, centerY - 160, ' Man With A Movie Camera ', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 180, ' Cameron Dodd: \n Programming (Ambulance/Phone Operator scenes) \n Miles Anderson: \n Programming (Shooting Gallery scene), Art ', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';

        const EmergencyButton = this.add.text(centerX, centerY - 80, ' Emergency scene ', menuConfig).setOrigin(0.5).setInteractive();
        EmergencyButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('emergencyServicesScene');
        });

        const OperatorButton = this.add.text(centerX, centerY , ' Operator scene ', menuConfig).setOrigin(0.5).setInteractive();
        OperatorButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('operatorScene');
        });      

        const ShootingGalleryButton = this.add.text(centerX, centerY + 80, ' Shooting Gallery scene (Not Implemented) ', menuConfig).setOrigin(0.5).setInteractive();
        ShootingGalleryButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('shootingGalleryScene');
        });
      }

    update() {
    }
}
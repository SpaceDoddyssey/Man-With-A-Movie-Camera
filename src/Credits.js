class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create(){
        let creditsConfig = {
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

        this.add.text(centerX, centerY - 180, ' Cameron Dodd: \n Programming (Ambulance/Phone Operator scenes) ', creditsConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 90,  ' Miles Anderson: \n Programming (Shooting Gallery scene), Art ', creditsConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 90,  ' Music: \n "The Long Let Go" by 1st Contact \n Licensed under CC BY-SA 4.0 \n https://freemusicarchive.org/music\n /1st-contact/single/the-long-let-go/ ', creditsConfig).setOrigin(0.5);

        creditsConfig.backgroundColor = '#1111AA';
        const MenuButton = this.add.text(centerX, centerY + 190, ' Return to Menu ', creditsConfig).setOrigin(0.5).setInteractive();
        MenuButton.on('pointerdown', (pointer) =>
        {
          this.scene.start('menuScene');
        });
    }
}
class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create(){
        let creditsConfig = {
            fontFamily: 'Red October',
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

        this.bgImage = this.add.image(centerX, centerY, 'bgImage');

        this.add.text(centerX, centerY - 180, ' Cameron Dodd: \n Programming ', creditsConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 90,  ' Miles Anderson: \n Art, Misc. Programming', creditsConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 80,  ' Music: \n "The Long Let Go" by 1st Contact \n Licensed under CC BY-SA 4.0 \n https://freemusicarchive.org/music\n /1st-contact/single/the-long-let-go/ ', creditsConfig).setOrigin(0.5);

        creditsConfig.backgroundColor = '#1111AA';

        const MenuButton = new Button(centerX, centerY + 190, ' Return to Menu ', this, () => {
            this.scene.stop().start('menuScene');
        }, creditsConfig);

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }
}

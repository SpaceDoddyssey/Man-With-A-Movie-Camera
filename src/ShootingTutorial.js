class ShootingTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'shootingTutorial' })
    }

    create() {
        const TutStyle = {
            fontFamily: 'RedOctober_Light',
            fontSize: '24px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center'
        }
        let tutText = this.add.text(centerX, centerY, " Click on the targets as they pop up \n Be warned: You have less time than the other scenes! ", TutStyle).setOrigin(0.5);

        this.input.setDefaultCursor('');

        let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
            this.scene.stop('shootingGalleryScene');
            this.scene.stop('hudScene');
            this.scene.start('menuScene');
        })

        let playButton = new Button(centerX, centerY + 100, 'Begin', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.input.setDefaultCursor('url(assets/Gallery/Crosshairs.png) 32 32, pointer');
            this.scene.resume('shootingGalleryScene').stop();
        })

        // input
        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }
}

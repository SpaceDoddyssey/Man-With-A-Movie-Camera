class EmergTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'emergTutorial' })
    }

    create() {
        const TutStyle = {
            fontFamily: 'RedOctober_Light',
            fontSize: '24px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center'
        }
        let tutText = this.add.text(centerX, centerY, " Use W/S to move forward/back \n A/D turn left and right \n Reach as many objectives as you can ", TutStyle).setOrigin(0.5);

        let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
            this.scene.stop('ambulanceScene');
            this.scene.stop('hudScene');
            this.scene.start('menuScene');
        })

        let playButton = new Button(centerX, centerY + 100, 'Begin', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume('ambulanceScene').stop();
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
// Miles Re-commit test
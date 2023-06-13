class EmergTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'emergTutorial' })
    }

    create() {
        const TutStyle = {
            fontFamily: 'American Typewriter',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center'
        }
        let tutText = this.add.text(centerX, centerY, " Use W/S to move forward/back \n A/D turn left and right \n Reach as many objectives as you can ", TutStyle).setOrigin(0.5);

        let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.start('menuScene').stop();
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
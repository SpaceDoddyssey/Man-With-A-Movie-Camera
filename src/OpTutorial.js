class OpTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'operatorTutorial' })
    }

    create() {
        const TutStyle = {
            fontFamily: 'American Typewriter',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left'
        }
        let tutText = this.add.text(centerX, centerY, " Incoming calls will light up red \n Click and drag plugs to answer the calls \n Busy switches will be yellow \n They will turn green when the call is done \n Answer as many calls as you can ", TutStyle).setOrigin(0.5);

        let playButton = new Button(centerX, centerY + 100, 'Begin', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume('operatorScene').stop();
        })

        let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.start('menuScene').stop();
        })

        // input
        keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
        if (Phaser.Input.Keyboard.JustDown(keyPause)) {
            // same as above
            this.scene.resume('playScene').stop();
        }
    }
}
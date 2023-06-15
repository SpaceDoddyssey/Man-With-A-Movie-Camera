class OpTutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'operatorTutorial' })
    }

    create() {
        const TutStyle = {
            fontFamily: 'RedOctober_Light',
            fontSize: '24px',
            backgroundColor: '#FFD700',
            color: '#000000',
            align: 'center'
        }
        let tutText = this.add.text(centerX, centerY, " Incoming calls will light up red \n Click and drag plugs to answer the calls \n Busy plugs will be yellow \n They will turn green when the call is done \n Answer as many calls as you can ", TutStyle).setOrigin(0.5);

        let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
            this.scene.stop('operatorScene');
            this.scene.stop('hudScene');
            this.scene.start('menuScene');
        })

        let playButton = new Button(centerX, centerY + 100, 'Begin', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume('operatorScene').stop();
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

class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' });
    }

    create(data) {
        this.sceneTitle = data.sceneTitle;
       
        let pauseButton = new Button(centerX, centerY + 100, '(P)ause', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume(this.sceneTitle).stop();
        })

        // let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
        //     // .resume will start the update loop of the target scene again
        //     // .stop will shutdown this scene, clear its display list, timers, etc.
        //     this.scene.start('menuScene');
        // })

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
            this.scene.resume(this.sceneTitle).stop();
        }
    }
}
class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' });
    }

    create(data) {
        this.sceneTitle = data.sceneTitle;
        
        //  console.log(this.manager.scenes);
        let menuButton = new Button(centerX, centerY - 100, 'Return to Menu', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.stop(this.sceneTitle);
            this.scene.stop('hudScene');
            this.scene.start('menuScene');
        })

        let playButton = new Button(centerX, centerY + 100, '(P)lay', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume(this.sceneTitle).stop();
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
            if(this.sceneTitle == 'shootingGalleryScene'){
                this.input.setDefaultCursor('url(assets/Gallery/Crosshairs.png), pointer');
            }
            this.scene.resume(this.sceneTitle).stop();
        }
    }
}
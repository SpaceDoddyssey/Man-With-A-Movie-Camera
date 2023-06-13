class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'hudScene' });
    }

    create(){
        scoreCounter = this.add.text(0, 0, 
            'Score: ' + score, ScoreConfig);
        timeCounter  = this.add.text(game.config.width - TimeConfig.fixedWidth, 0, 
            'Time: ' + secondsLeft, TimeConfig);
    }

    update(time, delta){
        scoreCounter.setText("Score: " + score);
        timeCounter.setText("Time: " + secondsLeft);
    }
}
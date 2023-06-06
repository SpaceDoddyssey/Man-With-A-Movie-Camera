class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    preload() {
        
    }

    create() {
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        let textConfig = {
            fontFamily: 'Georgia',
            fontSize: '40px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 15,
                bottom: 15,
                right: 15,
                left: 15
            },
            fixedWidth: 0
        }

        // check for high score in local storage
        // uncomment console.log statements if you need to debug local storage
        if(localStorage.getItem('highscore') != null) {
            let storedScore = parseInt(localStorage.getItem('highscore'));
            //console.log(`storedScore: ${storedScore}`);
            // see if current score is higher than stored score
            if(score > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('highscore', score.toString());
                highScore = score;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('highscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = score;
            localStorage.setItem('highscore', highScore.toString());
            newHighScore = true;
        }


        let textSpacer = 40;
        //Add text 
        this.add.text(centerX, centerY - textSpacer*2, 'Thanks for playing!', textConfig).setOrigin(0.5);
        if(newHighScore) {
            this.add.text(centerX, centerY - borderUISize - borderPadding, 'New High Score!', textConfig).setOrigin(0.5);
        }

        this.add.text(centerX, centerY + textSpacer, `Score: ${score}`, textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*3,`Local high score: ${highScore}`, textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*5, `Press ESC to Return to menu`, textConfig).setOrigin(0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            score = 0;
            this.scene.start('menuScene');
        }
    }
}

let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 560,
    scale: {
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.RESIZE
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Menu, OperatorScene, ShootingGallery, EmergencyServices, 
             Credits, Pause, EmergTutorial, OpTutorial, GameOver, HUDScene ]
}


let game = new Phaser.Game(config);

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let centerX = game.config.width/2;
let centerY = game.config.height/2;

let PlayButton, Ready;

let keyESC, keyPause, keyFullscreen;

let musicPlaying = false;

let score = 0;
let highScore = 0;

//Timer stuff
let secondsPerGame = 10;
let timeLeft; 
let secondsLeft = secondsPerGame;
let newHighScore = false;

//Global pointers to the HUD counters
let scoreCounter, timeCounter;

//Text configs
const ScoreConfig = {
    fontFamily: 'American Typewriter',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    fixedWidth: 140,
    setDepth: 0
}

const TimeConfig = Object.assign({}, ScoreConfig, { fixedWidth: 120 });
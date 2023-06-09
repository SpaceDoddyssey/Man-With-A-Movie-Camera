//Man With A Movie Camera

//Team members: 
// - Cameron Dodd
// - Miles Anderson

//Phaser components:
// - Physics
// - Camera
// - Text objects
// - Tween manager
// - Tilemap

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
             Credits, Pause, EmergTutorial, OpTutorial, ShootingTutorial, GameOver, HUDScene ]
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
let secondsPerGame = 40;
let timeLeft; 
let secondsLeft = secondsPerGame;
let newHighScore = false;

//Global pointers to the HUD counters
let scoreCounter, timeCounter;

//Text configs
const ScoreConfig = {
    fontFamily: 'RedOctober_Light',
    fontSize: '28px',
    backgroundColor: '#FFD700',
    color: '#000000',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    fixedWidth: 200,
    setDepth: 0
}

const TimeConfig = Object.assign({}, ScoreConfig, { fixedWidth: 160 });
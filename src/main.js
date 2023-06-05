let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 560,
    scale: {
        autoCenter: Phaser.Scale.RESIZE
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Menu, OperatorScene, ShootingGallery, EmergencyServices, Credits ]
}



let game = new Phaser.Game(config);

// set UI

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let centerX = game.config.width/2;
let centerY = game.config.height/2;

let PlayButton, Ready;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC;

let musicPlaying = false;

let score = 0;

const EmergScoreConfig = {
    fontFamily: 'American Typewriter',
    fontSize: '14px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    fixedWidth: 70,
    setDepth: 0,
    resolution: 128
  }
const EmergTimeConfig = Object.assign({}, EmergScoreConfig, { fixedWidth: 60 });
const OperScoreConfig = Object.assign({}, EmergScoreConfig, { fixedWidth: 140, fontSize: '28px'});
const OperTimeConfig  = Object.assign({}, OperScoreConfig,  { fixedWidth: 120 });
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
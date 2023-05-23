let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 560,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [ Menu, OperatorScene, ShootingGallery, EmergencyServices ]
}



let game = new Phaser.Game(config);

// set UI

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let PlayButton, Ready;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC;
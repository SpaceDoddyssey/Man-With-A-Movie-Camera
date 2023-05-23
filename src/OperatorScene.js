class OperatorScene extends Phaser.Scene {
    constructor() {
        super("operatorScene");
    }

    preload() {
      this.load.image('switchSprite', 'assets/switch.png')
      this.load.image('plugSprite', 'assets/plug.png')
    }

    create(){
        // Enable Matter physics
        const config = {
            default: 'matter',
            matter: {
                debug: true
            }
        };
        // this.physics.world.enable(this, config);
        // this.matter.world.setBounds();
        // this.matter.world.gravity.y = 0;

        this.switches = [];

        //Spawn grid
        this.createGrid();

        //Spawn plugs

    }


    createGrid(){
        const spriteWidth = 100;   // Width of the space given to each sprite
        const spriteHeight = 100; // Height of the space given to each sprite
        const gridWidth = 7;  // Number of switches in a row
        const gridHeight = 5; // Number of switches in a column

        // Calculate the starting position for the grid
        const startX = (this.cameras.main.width  - (spriteWidth  * gridWidth ) ) / 2;
        const startY = (this.cameras.main.height - (spriteHeight * gridHeight) ) / 2;
    
        // Create a group to hold the switches
        //const switchesGroup = this.physics.add.group();

        // Generate and distribute switches in the grid
        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                const x = startX + (col * spriteWidth ) + (spriteWidth  - 64);
                const y = startY + (row * spriteHeight) + (spriteHeight - 64);

                let switchSprite = this.add.sprite(x, y, 'switchSprite');
                this.switches.push(this);
                //switchesGroup.add(switchSprite);
            }
        }
    }
}
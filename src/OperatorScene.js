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
        this.plugs = [];

        //this.input.on('pointerdown',this.startDrag,this);

        this.spriteWidth = 100;   // Width of the space given to each sprite
        this.spriteHeight = 100; // Height of the space given to each sprite
        this.gridWidth = 7;  // Number of switches in a row
        this.gridHeight = 5; // Number of switches in a column

        //Spawn grid
        this.createGrid();

        //Spawn plugs
        const numPlugs = 6;
        for(let i = 0; i < numPlugs; i++){
            let x = Phaser.Math.Between(0, this.gridWidth-1);
            let y = Phaser.Math.Between(0, this.gridHeight-1);
            let coords = [ x, y ];
            
            let failure = false;
            for (let index = 0; index < this.plugs.length; index++) {
                const plug = this.plugs[index];
                if (plug.coords[0] == coords[0] && plug.coords[1] == coords[1]){
                    failure = true;
                    break;
                }   
            }
            if(failure){
                i--;
                continue;
            }

            console.log(this.plugs.length);
            console.log(y, x, this.gridWidth * y + x)
            let xPos = this.switches[this.gridWidth * y + x].x;
            let yPos = this.switches[this.gridWidth * y + x].y;
            let plugSprite = this.add.sprite(xPos, yPos, 'plugSprite');
            plugSprite.setInteractive();
            plugSprite.coords = coords;
            this.plugs.push(plugSprite);
        }
    }




















    startDrag(pointer, targets){
        this.dragObject = targets[0];
        if(this.dragObject != undefined){
            this.dragObject.isGrabbed = true;
            this.input.off('pointerdown', this.startDrag, this);
            this.input.on('pointermove', this.doDrag, this);
            this.input.on('pointerup', this.stopDrag, this);
        }
    }
    doDrag(pointer){
        this.dragObject.x = pointer.x;
        this.dragObject.y = pointer.y;
    }
    stopDrag(pointer){
        this.input.on('pointerdown', this.startDrag, this);
        this.input.off('pointermove', this.doDrag, this);
        this.input.off('pointerup', this.stopDrag, this);

        this.dragObject.isGrabbed = false;

        //Determine which switch you are dropping the plug onto
        //let xPos = ()
    }




    createGrid(){
        // Calculate the starting position for the grid
        this.startX = (this.cameras.main.width  - (this.spriteWidth  * this.gridWidth ) ) / 2;
        this.startY = (this.cameras.main.height - (this.spriteHeight * this.gridHeight) ) / 2;
    
        // Create a group to hold the switches
        //const switchesGroup = this.physics.add.group();

        // Generate and distribute switches in the grid
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const x = this.startX + (col * this.spriteWidth ) + (this.spriteWidth  - 64);
                const y = this.startY + (row * this.spriteHeight) + (this.spriteHeight - 64);

                let switchSprite = this.add.sprite(x, y, 'switchSprite');
                this.switches.push(switchSprite);
                //switchesGroup.add(switchSprite);
            }
        }
    }
}
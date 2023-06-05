class OperatorScene extends Phaser.Scene {
    constructor() {
        super("operatorScene");
    }

    preload() {
        this.load.path = 'assets/Operator/';
        this.load.image('background',           'switchboardbg.png')
        this.load.image('switchSprite',         'slot_empty.png')
        this.load.image('switchIncomingSprite', 'slot_incoming.png')
        this.load.image('plugSprite',           'plug_finished.png')
        this.load.image('plug_ongoing',         'plug_ongoing.png')
        this.load.image('plug_finished',        'plug_finished.png');
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

        this.input.on('pointerdown', this.startDrag,this);

        let bg = this.add.sprite(centerX, centerY, 'background');
        bg.scale = 1.5;

        //Spawn grid
        this.spriteWidth = 100;   // Width of the space given to each sprite
        this.spriteHeight = 100; // Height of the space given to each sprite
        this.gridWidth = 7;  // Number of switches in a row
        this.gridHeight = 5; // Number of switches in a column
        this.totalSwitches = this.gridHeight * this.gridWidth;
        this.createGrid();

        //Spawn plugs
        this.numPlugs = 6;
        this.numFreePlugs = this.numPlugs;
        this.spawnPlugs(this.numPlugs);

        //Initialize call variables
        this.incomingCallTimer = 40; //Ticks left before receiving a new call
        this.incomingCallBaseRate = 100; 
        this.incomingCallTimeVariance = 40
        this.numIncomingCalls = 0; //How many incoming calls are currently waiting
        this.maxIncomingCalls = 5; //Max number of incoming calls that can be "in the queue"
        this.waitingState = 0; this.busyState = 1; this.doneState = 2; //Enums for managing state of answered calls
        this.minCallDuration = 300;
        this.maxCallDuration = 600;

        this.score = 0;
        this.initUI();

        this.ringTones = [];
        this.ringTones.push(this.sound.add('ring1', { volume: 0.06 }));
        this.ringTones.push(this.sound.add('ring2', { volume: 0.03 }));
        this.ringTones.push(this.sound.add('ring3', { volume: 0.05 }));
    }

    update(){
        this.incomingCallTimer--;
        if(this.incomingCallTimer <= 0){
            let newTimer = Phaser.Math.Between(this.incomingCallBaseRate - this.incomingCallTimeVariance, 
                                               this.incomingCallBaseRate + this.incomingCallTimeVariance);
            //console.log(newTimer);
            this.incomingCallTimer = newTimer;
            if(this.numIncomingCalls < this.maxIncomingCalls && this.numFreePlugs > 0){
                this.receiveCall();
            }
        }

        this.plugs.forEach(plug => {
            if(plug.timeLeftOnCall > 0){
                plug.timeLeftOnCall--;
            } else if(plug.callState == this.busyState) {
                plug.callState = this.doneState;
                plug.setTexture('plug_finished');
            }
        });
    }

    receiveCall(){
        //Searches for a valid slot to send the incoming call to
        let foundOne = false;
        let x, y, s;
        while(!foundOne){
            x = Phaser.Math.Between(0, this.gridWidth-1);
            y = Phaser.Math.Between(0, this.gridHeight-1);
            s = this.switches[this.gridWidth * y + x];
            if(!s.occupied && !s.incomingCall){ 
                foundOne = true; 
            } 
        }
        
        s.ringTone = Phaser.Utils.Array.GetRandom(this.ringTones, 0, this.ringTones.length);
        s.ringTone.play();

        s.incomingCall = true;
        s.setTexture('switchIncomingSprite');

        this.numIncomingCalls++;
    }

    reset(object){
        object.x = object.oldX;
        object.y = object.oldY;
    }

    plugInto(x, y, plug){
        let s = this.switches[this.gridWidth * y + x];
        //console.log(x, y, plug.switch.x, plug.switch.y, plug.switch.occupied, s.occupied);
        if(s.occupied){
            this.reset(plug);
            return;
        }
        //Location is valid
        s.occupied = true;
        s.plug = plug;
        plug.switch.occupied = false;
        plug.switch = s;
        //console.log(s.x, s.y);

        if(s.incomingCall){
            this.connectCall(s);
        }
    }

    connectCall(s){
        s.incomingCall = false;
        s.ringTone.stop();

        let plug = s.plug;
        plug.callState = this.busyState;
        plug.timeLeftOnCall = Phaser.Math.Between(this.minCallDuration, this.maxCallDuration);
        plug.setTexture('plug_ongoing');

        this.numIncomingCalls--;
        this.score++;
        this.scoreCounter.text = 'Score: ' + this.score;
        s.setTexture('switchSprite');
    }

















    startDrag(pointer, targets){
        this.dragObject = targets[0];
        if(this.dragObject != undefined && this.dragObject.callState != this.busyState){
            this.dragObject.oldX = this.dragObject.x;
            this.dragObject.oldY = this.dragObject.y;
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

        //Snap the plug to the right location
        let xFloor = Math.floor((pointer.x - this.startX) / this.spriteWidth);
        if(xFloor < 0) { xFloor = 0; } else if (xFloor > this.gridWidth-1) { xFloor = this.gridWidth-1; } 
        let xPos = this.startX + this.spriteWidth  / 2 + (xFloor * this.spriteWidth) - 14;

        let yFloor = Math.floor((pointer.y - this.startY) / this.spriteHeight)  
        if(yFloor < 0) { yFloor = 0; } else if (yFloor > this.gridHeight-1) { yFloor = this.gridHeight-1; } 
        let yPos = this.startY + this.spriteHeight / 2 + (yFloor * this.spriteHeight) - 14; //I have absolutely no idea why this -14 is necessary but it is

        this.dragObject.x = xPos; this.dragObject.y = yPos;
        //console.log(xFloor, yFloor, pointer.x, pointer.y, xPos, yPos);

        //(Attempt to) plug it into the appropriate switch
        this.plugInto(xFloor, yFloor, this.dragObject);
    }

    createGrid(){
        // Calculate the starting position for the grid
        this.startX = (this.cameras.main.width  - (this.spriteWidth  * this.gridWidth ) ) / 2;
        this.startY = (this.cameras.main.height - (this.spriteHeight * this.gridHeight) ) / 2 + 32;
    
        // Create a group to hold the switches
        //const switchesGroup = this.physics.add.group();

        // Generate and distribute switches in the grid
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const x = this.startX + (col * this.spriteWidth ) + (this.spriteWidth  - 64);
                const y = this.startY + (row * this.spriteHeight) + (this.spriteHeight - 64);

                let switchSprite = this.add.sprite(x, y, 'switchSprite').setOrigin(0.5, 0.5);
                switchSprite.occupied = false;
                switchSprite.incomingCall = false;
                this.switches.push(switchSprite);
                //switchesGroup.add(switchSprite);
            }
        }
    }
    spawnPlugs(numPlugs){
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

            //console.log(y, x, this.gridWidth * y + x)
            let s = this.switches[this.gridWidth * y + x];
            s.occupied = true;
            let xPos = s.x;
            let yPos = s.y;

            let plugSprite = this.add.sprite(xPos, yPos, 'plugSprite').setOrigin(0.5, 0.5);
            s.plug = plugSprite;
            plugSprite.switch = s;
            plugSprite.callState = this.waitingState;
            plugSprite.setInteractive();
            plugSprite.coords = coords;
            this.plugs.push(plugSprite);
        }
    }
    initUI(){
        // Score text
        const scoreConfig = {
            fontFamily: 'Courier',
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
            fixedWidth: 170,
            setDepth: 0
        }
        const timeConfig = Object.assign({}, scoreConfig, { fixedWidth: 160 });

        // With a beyond borders map, UI should be later be constantly updated at a distance away from the player rather than a constant fixed distance.

        this.scoreCounter = this.add.text(0, 0, 'Score: ' + this.score, scoreConfig);
    }
}
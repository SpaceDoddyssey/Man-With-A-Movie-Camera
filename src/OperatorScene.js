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
        this.switches = [];
        this.plugs = [];

        this.input.on('pointerdown', this.startDrag,this);

        let bg = this.add.sprite(centerX, centerY, 'background');
        bg.scale = 1.0;

        //this.graphics is used for drawing the cables
        this.graphics = this.add.graphics();

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

        //Initialize variables for the incoming call system
        this.incomingCallTimer = 40; //Ticks left before receiving a new call
        this.incomingCallBaseRate = 100; 
        this.incomingCallTimeVariance = 40
        this.numIncomingCalls = 0; //How many incoming calls are currently waiting
        this.maxIncomingCalls = 5; //Max number of incoming calls that can be "in the queue"
        this.waitingState = 0; this.busyState = 1; this.doneState = 2; //Enums for managing state of answered calls
        this.minCallDuration = 300;
        this.maxCallDuration = 600;

        this.score = 0;

        //The list of ring sounds that can play when a call is received
        this.ringTones = [];
        this.ringTones.push(this.sound.add('ring1', { volume: 0.06 }));
        this.ringTones.push(this.sound.add('ring2', { volume: 0.03 }));
        this.ringTones.push(this.sound.add('ring3', { volume: 0.05 }));
        
        //Variables used in handling the passage of time
        this.frameTime = 0;
        timeLeft = secondsPerGame * 1000.0;
        secondsLeft = secondsPerGame;
        timeCounter.setText("Time: " + secondsPerGame);

        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        this.keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        this.drawPlugCables();

        this.scene.pause();
    }

    update(time, delta){
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }
        timeLeft -= this.frameTime;
        this.frameTime = 0;
        
        if(timeLeft / 1000.0 < secondsLeft){ 
            secondsLeft = Math.trunc(timeLeft / 1000.0);
            timeCounter.setText("Time: " + secondsLeft);
        }
        
        if(timeLeft <= 0){
            this.switches.forEach(s => {
                if(s.ringTone != undefined){
                    s.ringTone.stop();
                }
            });
            this.scene.stop().launch('shootingGalleryScene').launch('shootingTutorial');
        }
        
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

        //Handle pause and fullscreen button input
        if (Phaser.Input.Keyboard.JustDown(this.keyPause)) {
            this.scene.pause().launch('pauseScene', { sceneTitle: 'operatorScene' });
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyFullscreen)){
            this.scale.toggleFullscreen();
        }

        this.drawPlugCables();
    }

    drawPlugCables(){
        //Thanks to user "not luke#9330" on the Phaser discord for assistance with this 
        //- See catenary-curve.js 
        this.graphics.clear();

        //the length parameter determines how long the arc is in total
        //If the plug and the offscreen 'target' are closer than maxDist, 
        //we use maxdist to get a tighter curve and simulate drooping. 
        //Otherwise, we set the limit to slightly above the distance, 
        //so it doesn't pull completely straight
        let maxDist = 600;  
        this.graphics.lineStyle(6, 0x000000, 1.0);
        this.graphics.setDepth(5);
        this.plugs.forEach(plug => {
            
            let dist = Phaser.Math.Distance.Between(plug.x, plug.y, plug.offSideX, plug.offSideY);
            if(dist > maxDist){
                dist *= 1.01;
            } else {
                dist = maxDist * 1.01; //so we get drooping all the way to maxDist
            }
        
            const point1 = new Phaser.Math.Vector2(plug.x, plug.y);
            const point2 = new Phaser.Math.Vector2(plug.offSideX, plug.offSideY);
            const catenary = getCatenaryCurve(point1, point2, dist);
            if (catenary.type === "quadraticCurve") {
                // draw quadratic curves to create the catenary
                let p0 = catenary.start;
                catenary.curves.forEach(curve => {
                    const p1 = [curve[0], curve[1]];
                    const p2 = [curve[2], curve[3]];
                    new Phaser.Curves.QuadraticBezier([...p0, ...p1, ...p2]).draw(this.graphics);
                    p0 = p2;
                });
                // finish last segment
                this.graphics.beginPath();
                this.graphics.moveTo(...p0);
                this.graphics.lineTo(point2.x, point2.y);
                this.graphics.closePath();
                this.graphics.strokePath();
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
        if(s.occupied){
            this.reset(plug);
            return;
        }
        //Location is valid
        s.occupied = true;
        s.plug = plug;
        plug.switch.occupied = false;
        plug.switch = s;

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
        score++;
        s.setTexture('switchSprite');
    }










    startDrag(pointer, targets){
        //Called when we begin dragging something
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
        //Called every frame while dragging something
        this.dragObject.x = pointer.x;
        this.dragObject.y = pointer.y;
    }
    stopDrag(pointer){
        //Called when we release the mouse while dragging something
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

        //(Attempt to) plug it into the appropriate switch
        this.plugInto(xFloor, yFloor, this.dragObject);
    }

    createGrid(){
        // Calculate the starting position for the grid
        this.startX = (this.cameras.main.width  - (this.spriteWidth  * this.gridWidth ) ) / 2;
        this.startY = (this.cameras.main.height - (this.spriteHeight * this.gridHeight) ) / 2 + 32;

        // Generate and distribute switches in the grid
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const x = this.startX + (col * this.spriteWidth ) + (this.spriteWidth  - 64);
                const y = this.startY + (row * this.spriteHeight) + (this.spriteHeight - 64);

                let switchSprite = this.add.sprite(x, y, 'switchSprite').setOrigin(0.5, 0.5);
                switchSprite.occupied = false;
                switchSprite.incomingCall = false;
                this.switches.push(switchSprite);
            }
        }
    }
    spawnPlugs(numPlugs){
        for(let i = 0; i < numPlugs; i++){
            let x = Phaser.Math.Between(0, this.gridWidth-1);
            let y = Phaser.Math.Between(0, this.gridHeight-1);
            let coords = [ x, y ];
            
            //Loop until we find a valid place to put a plug
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

            //Set some variables and get some variables from the switch
            let s = this.switches[this.gridWidth * y + x];
            s.occupied = true;
            let xPos = s.x;
            let yPos = s.y;

            //Actually create the plug
            let plugSprite = this.add.sprite(xPos, yPos, 'plugSprite').setOrigin(0.5, 0.5);
            s.plug = plugSprite;
            plugSprite.switch = s;
            plugSprite.callState = this.waitingState;
            plugSprite.setInteractive();
            plugSprite.coords = coords;
            this.plugs.push(plugSprite);

            //Variables needed for the cable 
            let leftOrRight = Math.random() < 0.5 ? -1 : 1;
            plugSprite.offSideX = (leftOrRight > 0 
                ? Phaser.Math.Between(-200, -20) 
                : game.config.width + Phaser.Math.Between(20, 200));
            plugSprite.offSideY = Phaser.Math.Between (this.startY, game.config.height - this.startY);
        }
    }
}
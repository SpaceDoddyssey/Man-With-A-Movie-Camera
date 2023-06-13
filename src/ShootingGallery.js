class ShootingGallery extends Phaser.Scene {
    constructor() {
        super("shootingGalleryScene");
    }
    
    preload() {
      //load images (planning to do this)
    }

    create(){
        // Create enemies
        this.enemies = this.physics.add.group();
        this.createEnemies();

        this.rifleFX = this.sound.add('airRifle', { volume: 1 })

        // Set up mouse click event
        this.input.on('pointerdown', this.shoot, this);
    }

    shoot(pointer){
        this.rifleFX.play();
        console.log(pointer.x, pointer.y);
    }

    update(){

    }

    createEnemies() {
        // enemySlot 1: Moves up and down
        const enemySlot1 = this.enemies.create(Phaser.Math.Between(50, 750), 50, 'enemySlot1');
        this.tweens.add({
            targets: enemySlot1,
            y: 550,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // enemySlot 2: Moves across the screen in a sine wave pattern
        const enemySlot2 = this.enemies.create(50, 150, 'enemySlot2');
        this.tweens.add({
            targets: enemySlot2,
            x: 750,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // enemySlots 3-6: Stationary targets
        const enemySlot3 = this.enemies.create(750, 300, 'enemySlot3');
    }
}
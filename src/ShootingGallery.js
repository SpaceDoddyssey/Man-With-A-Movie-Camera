class ShootingGallery extends Phaser.Scene {
    constructor() {
        super("shootingGalleryScene");
    }
    
    preload() {
      //load images (planning to do this)
    }

    create(){
        // Create player
        this.player = this.physics.add.sprite(400, 500, 'player');

        // Create enemies
        this.enemies = this.physics.add.group();
        createEnemies(this);

        // Create bullets
        this.bullets = this.physics.add.group();

        // Set up mouse click event
        this.input.on('pointerdown', shoot, this);
    }

    createEnemies(scene) {
        // Enemy 1: Moves up and down
        const enemy1 = scene.enemies.create(Phaser.Math.Between(50, 750), 50, 'enemy1');
        scene.tweens.add({
            targets: enemy1,
            y: 550,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // Enemy 2: Moves across the screen in a sine wave pattern
        const enemy2 = scene.enemies.create(50, 150, 'enemy2');
        scene.tweens.add({
            targets: enemy2,
            x: 750,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Enemy 3: Moves up and stops at y = 300
        const enemy3 = scene.enemies.create(750, 300, 'enemy3');
        scene.tweens.add({
            targets: enemy3,
            y: 300,
            duration: 2000,
            repeat: 0
        });
        }
}
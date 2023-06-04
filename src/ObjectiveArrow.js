class ObjectiveArrow extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, objective, playerSprite) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.5;

        this.objective = objective;

        this.distanceFromPlayer = 36; 
        this.minDistToRender = 70;
        this.playerSprite = playerSprite; //Set by Play
    }

    update() {
        this.aimTowardsObjective();
    }

    aimTowardsObjective() {
        // Calculate angle between player sprite and objective position
        let distance = Phaser.Math.Distance.Between(this.playerSprite.x, this.playerSprite.y, this.objective.x, this.objective.y);
        if (distance < this.minDistToRender) {
            this.x = -1000;
            this.y = -1000;
            return;
        }

        let angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, this.objective.x, this.objective.y);

        this.rotation = angle;

        // Calculate the position of the moving sprite based on the angle and distance
        let targetX = this.playerSprite.x + Math.cos(angle) * this.distanceFromPlayer;
        let targetY = this.playerSprite.y + Math.sin(angle) * this.distanceFromPlayer;

        //this.scene.add.graphics().fillStyle(0x55aa55).fillPoint(targetX, targetY, 10);

        this.x = targetX;
        this.y = targetY;
    }
}
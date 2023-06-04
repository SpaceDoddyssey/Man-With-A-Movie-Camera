class ObjectiveArrow extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, objective, playerSprite) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.5;

        this.objective = objective;

        this.distanceFromPlayer = 36; 
        this.playerSprite = playerSprite; //Set by Play
    }

    update() {
        this.aimTowardsObjective();
    }

    aimTowardsObjective() {
        // Calculate angle between player sprite and objective position
        console.log(this.playerSprite.x, this.playerSprite.y, this.objective.x, this.objective.y)
        //var angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, this.objective.x, this.objective.y);
        var angle = 45;

        this.rotation = angle;

        // Calculate the position of the moving sprite based on the angle and distance
        var targetX = this.playerSprite.x + Math.cos(angle) * this.distanceFromPlayer;
        var targetY = this.playerSprite.y + Math.sin(angle) * this.distanceFromPlayer;

        this.x = targetX;
        this.y = targetY;
    }
}
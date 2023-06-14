// Slightly modified from Button class code from Ferenc Almasi: https://webtips.dev/webtips/phaser/interactive-buttons-in-phaser3
class Button {
    constructor(x, y, label, scene, callback, style) {
        const button = scene.add.text(x, y, label)
            .setOrigin(0.5)
            .setPadding(10)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => button.setStyle({ fill: '#EFEFEF' }))
            .on('pointerout', () => button.setStyle({ fill: '#000000' }))
        if(style){
            button.setStyle(style)
        } else {
            button.setStyle({ backgroundColor: '#F3B141', fill: '#FFFFF' })
        }
    }
}
// Miles Re-commit test
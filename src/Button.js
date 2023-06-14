// Slightly modified from Button class code from Ferenc Almasi: https://webtips.dev/webtips/phaser/interactive-buttons-in-phaser3
class Button {
    constructor(x, y, label, scene, callback, style, origin) {
        const button = scene.add.text(x, y, label)
            .setPadding(10)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => button.setStyle({ fill: '#EFEFEF' }))
            .on('pointerout', () => button.setStyle({ fill: '#000000' }))
        if(style){
            button.setStyle(style)
        } else {
            button.setStyle({ fontFamily: 'RedOctober_Light', backgroundColor: '#F3B141', fill: '#000000' })
        }
        if(origin != undefined){
            button.setOrigin(origin)
        } else {
            button.setOrigin(0.5);
        }
    }
}

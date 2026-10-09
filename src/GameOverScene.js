import Phaser from 'phaser'
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('over-scene')
    }
    init(data) {
        this.replayButton = undefined
        this.score = data.score //mengisi properti score dengan nilai score yang dikirim dari wallet defend scene
    }

    preload() {
        this.load.image('background', 'images/background_3.png')
        this.load.image('gameover', 'images/game_over.png')
        this.load.image('replay-button', 'images/replay_btn.png')
    }

    create() {
        this.add.image(200, 320, 'background')
        this.add.image(200, 200, 'gameover')
        // @ts-ignore
        this.add.text(100,300, 'Score: ' + this.score, {fontSize: '32px', fill: 'white'})
        this.add.text(30, 500, 'Menabung adalah langkah awal untuk kesuksesan', {
            fontSize: '13px',
            //@ts-ignore
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: 'white',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 4,
                stroke: false,
                fill: true
            }
        });
       
        this.replayButton = this.add.image(200, 400, 'replay-button').setInteractive().setScale(0.5)

        this.replayButton.once('pointerup', () => {
            this.scene.start('wallet-defend-scene')
        }, this)
    }
}
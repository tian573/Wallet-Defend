import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('start-scene');
    }

    preload() {
        this.load.image('background', 'images/background_3.png');
        this.load.image('title', 'images/Title_WalletDefend.png')
        this.load.image('start_button', 'images/start_btn.png'); 
    }

    create() {
        this.add.image(200, 320, 'background'); 
        this.add.image(200, 200, 'title')

        // start button
        const playButton = this.add.image(200, 400, 'start_button').setInteractive().setScale(0.5);

        // Handle button click
        playButton.once('pointerup', () => {
            this.scene.start('wallet-defend-scene'); // Transition ke scene wallet defend
        }, this);
    }
}
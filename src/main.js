import Phaser from 'phaser'

import StartScene from './StartScene'

import WalletDefendScene from './WalletDefendScene'

import GameOverScene from './GameOverScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 620,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [StartScene, WalletDefendScene, GameOverScene],
	scale : {
		mode :Phaser.Scale.FIT,
		autoCenter : Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)

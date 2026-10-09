import Phaser from 'phaser'

import FallingObject from "../src/FallingObject"

import Coin from '../src/Coin';

export default class WalletDefendScene extends Phaser.Scene {
	constructor() {
		super('wallet-defend-scene')
	}

	init() {
		this.nav_left = false;

        this.nav_right = false;

        this.shoot = false;

		this.player = undefined;

        this.speed = 200

        this.pizzas = undefined
        this.pizzaSpeed = 50;

        this.bags = undefined
        this.bagSpeed = 50;

        this.robbers = undefined
        this.robberSpeed = 80;

        this.coins = undefined
        this.lastFired = 10

        this.scoreLabel = undefined
        this.score = 0

        this.lifeLabel = undefined
        this.life = 3

        this.celengan = undefined

        this.backsound = undefined

	}

	preload() {
		this.load.image('background', 'images/background_3.png')

		this.load.image('left_btn', 'images/left_btn.png')

		this.load.image('right_btn', 'images/right_btn.png')

        this.load.image('shoot_btn', 'images/shoot_btn.png')

		this.load.spritesheet('player', 'images/wallet.png', {

            frameWidth: 100,
            frameHeight: 100
            
            })
        
        this.load.image('pizza', 'images/pizza.png')

		this.load.image('bag', 'images/bag.png')

		this.load.image('robber', 'images/robber.png')

        this.load.image('coin','images/coin.png')

        this.load.image('celengan', 'images/celengan.png')

        this.load.audio('bgsound','sfx/simplelofi.mp3')

        this.load.audio('coin','sfx/sfx_coin.mp3')

        this.load.audio('destroy','sfx/destroy.mp3')

        this.load.audio('gameover','sfx/gameover.mp3')

        this.load.audio('celengan','sfx/sfx_celengan.mp3')

		
	}

	create() {
		const gameWidht = this.scale.width*0.5;

        const gameHeight = this.scale.height*0.5;

        this.add.image(gameWidht,gameHeight,"background")

		this.createButton()

        this.player = this.createPlayer()

        this.pizzas = this.physics.add.group ({
            classType: FallingObject,
            maxSize: 4, //banyaknya enemy dalam satu kali grup
            runChildUpdate: true 
        })

        this.time.addEvent ({
            delay: Phaser.Math.Between(1000, 5000), //delay random rentang 1-5 detik
            callback: this.spawnPizza, //memanggil method bernama spawnPizza
            callbackScope: this,
            loop: true
        })

        this.bags = this.physics.add.group ({
            classType: FallingObject,
            maxSize: 4, //banyaknya enemy dalam satu kali grup
            runChildUpdate: true 
        })

        this.time.addEvent ({
            delay: Phaser.Math.Between(1000, 5000), //delay random rentang 1-5 detik
            callback: this.spawnBag, //memanggil method bernama spawnBag
            callbackScope: this,
            loop: true
        })

        this.robbers = this.physics.add.group ({
            classType: FallingObject,
            maxSize: 2, //banyaknya enemy dalam satu kali grup
            runChildUpdate: true 
        })

        this.time.addEvent ({
            delay: Phaser.Math.Between(1000, 5000), //delay random rentang 1-5 detik
            callback: this.spawnRobber, //memanggil method bernama spawnRobber
            callbackScope: this,
            loop: true
        })

        this.coins = this.physics.add.group({
            classType: Coin,
            maxSize: 10,
            runChildUpdate: true
        })

        this.physics.add.overlap(
            this.coins,
            this.pizzas,
            this.hitPizza,
            null,
            this
        )

        this.physics.add.overlap(
            this.coins,
            this.bags,
            this.hitBag,
            null,
            this
        )

        this.scoreLabel = this.add.text(10,10,'Score', {
            fontSize: '16px',
            //@ts-ignore
            fill: 'white'
        }).setDepth(1)

        this.lifeLabel = this.add.text(10, 30,'life', {
            fontSize: '16px',
            // @ts-ignore
            fill: 'white',
        }).setDepth(1)

        this.physics.add.overlap(
            this.player,
            this.pizzas,
            this.decreaseLife1,
            null,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.bags,
            this.decreaseLife2,
            null,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.robbers,
            this.decreaseLife3,
            null,
            this
        )

        this.celengan = this.physics.add.group({
            classType: FallingObject,
            runChildUpdate: true
        })
        this.time.addEvent({
            delay: 20000, //celengan spawn setiap 20 detik
            callback: this.spawnCelengan,
            callbackScope: this,
            loop: true
        })

        this.physics.add.overlap(
            this.player,
            this.celengan,
            this.increaseLife,
            null,
            this
        )

        this.backsound = this.sound.add('bgsound')

        var soundConfig={
            loop: true,
            volume: 0.5,
        }
        this.backsound.play(soundConfig)



		
	}

	update(time) {
        this.movePlayer(this.player, time)

        this.scoreLabel.setText('Score : ' + this.score); //agar scoreLabel selalu menampilkan nilai score terkini

        this.lifeLabel.setText('Life : ' + this.life);

	}

	createButton() {
		this.input.addPointer(3)

		let shoot = this.add.image(320,550, 'shoot_btn')
        .setInteractive().setDepth(0.5).setAlpha(0.8)

        let nav_left = this.add.image(50,550, 'left_btn')
        .setInteractive().setDepth(0.5).setAlpha(0.8)

        let nav_right = this.add.image(nav_left.x +
        nav_left.displayWidth+20, 550,'right_btn')
        .setInteractive().setDepth(0.5).setAlpha(0.8)

		
        nav_left.on('pointerdown', () => {
            this.nav_left = true
            }, this)
            nav_left.on('pointerout', () => {
            this.nav_left = false
            }, this)
        
            nav_right.on('pointerdown', () => {
                this.nav_right = true
                }, this)
                nav_right.on('pointerout', () => {
                this.nav_right = false
                }, this)
                shoot.on('pointerdown', () => {
                this.shoot = true
                }, this)
                shoot.on('pointerout', () => {
                this.shoot = false
                }, this)

	}

    movePlayer(player, time) {
        if (this.nav_left ){ 
            this.player.setVelocityX(this.speed * -1)

            this.player.anims.play('left', true)

            this.player.setFlipX(false)
        } else if (this.nav_right) {
            this.player.setVelocityX(this.speed)

            this.player.anims.play('right', true)

            this.player.setFlipX(true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }

        //kondisi untuk tombol nembak coin
        if ((this.shoot) && time > this.lastFired) {
            const coin = this.coins.get(0, 0, 'coin')
            if (coin) {
                coin.fire(this.player.x, this.player.y)
                this.lastFired = time + 150
                this.sound.play('coin')
            }
        }

    }

    createPlayer() {
        const player = this.physics.add.sprite(200, 450,'player')

        player.setCollideWorldBounds(true)

        this.anims.create({
            key: 'turn',
            frames: [{
            key: 'player',frame: 0
            }],
            })
            this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
            start: 1, end: 2
            }),
            })
            this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
            start: 1,end: 2
            })
            })
        return player


    }

    spawnPizza() {
        const config = { // mengatur kecepatan dan besar rotasi dari enemy
            speed: 75,
            //rotation: 0.1
        }
        //@ts-ignore
        const pizza = this.pizzas.get(0,0,'pizza',config)
        const positionX = Phaser.Math.Between(50, 350) //memanggil angka acak dari 50-350
        if (pizza) {
            pizza.spawn(positionX) //memanggil method spawn dengan parameter nilai posisi sumbu x
        }
    }

    spawnBag() {
        const config = { // mengatur kecepatan dan besar rotasi dari enemy
            speed: 75,
            //rotation: 0.1
        }
        //@ts-ignore
        const bag = this.bags.get(0,0,'bag',config)
        const positionX = Phaser.Math.Between(50, 350) //memanggil angka acak dari 50-350
        if (bag) {
            bag.spawn(positionX) //memanggil method spawn dengan parameter nilai posisi sumbu x
        }
    }

    spawnRobber() {
        const config = { // mengatur kecepatan dan besar rotasi dari enemy
            speed: 300,
            //rotation: 0.1
        }
        //@ts-ignore
        const robber = this.robbers.get(0,0,'robber',config)
        const positionX = Phaser.Math.Between(50, 350) //memanggil angka acak dari 50-350
        if (robber) {
            robber.spawn(positionX) //memanggil method spawn dengan parameter nilai posisi sumbu x
        }
    } 

    hitPizza(coin, pizza) { 
        coin.die()
        pizza.die()
        this.score +=10;
        this.sound.play('destroy')
       
    }

    hitBag(coin, bag) { 
        coin.die()
        bag.die()
        this.score +=5;
        this.sound.play('destroy')
      
    }

    decreaseLife1(player, pizza){
        pizza.die()
        this.sound.play('celengan')
        this.life--
        if (this.life == 2){
            player.setTint(0xff0000) //setTint itu perintah untuk mengubah warna objek
        }else if (this.life == 1){
            player.setTint(0xff0000).setAlpha(0.5) //kode 0xff0000 itu untuk warna merah, set alpha digunakan jadi lebih transparan warnanya
        }else if (this.life == 0) { //kondisi 3 membuat pindah scene ke GameOverScene saat Life = 0
            this.sound.stopAll()
            this.sound.play('gameover')
            this.scene.start('over-scene', {score:this.score})
        
        }
    }
    decreaseLife2(player, bag){
        bag.die()
        this.sound.play('celengan')
        this.life--
        if (this.life == 2){
            player.setTint(0xff0000) //setTint itu perintah untuk mengubah warna objek
        }else if (this.life == 1){
            player.setTint(0xff0000).setAlpha(0.5) //kode 0xff0000 itu untuk warna merah, set alpha digunakan jadi lebih transparan warnanya
        }else if (this.life == 0) { //kondisi 3 membuat pindah scene ke GameOverScene saat Life = 0
            this.sound.stopAll()
            this.sound.play('gameover')
            this.scene.start('over-scene', {score:this.score})
        }

    
    }
    decreaseLife3(player, robber){
        robber.die()
        this.sound.play('celengan')
        this.life--
        if (this.life == 2){
            player.setTint(0xff0000) //setTint itu perintah untuk mengubah warna objek
        }else if (this.life == 1){
            player.setTint(0xff0000).setAlpha(0.5) //kode 0xff0000 itu untuk warna merah, set alpha digunakan jadi lebih transparan warnanya
        }else if (this.life == 0) { //kondisi 3 membuat pindah scene ke GameOverScene saat Life = 0
            this.sound.stopAll()
            this.sound.play('gameover')
            this.scene.start('over-scene', {score:this.score})
        }

        
    }
    spawnCelengan() {
        const config = {
            speed: 60,
            rotation: 0 // tidak berputar
        }
        //@ts-ignore
        const celengan = this.celengan.get(0, 0, 'celengan', config)
        const positionX = Phaser.Math.Between(70, 330)
        if (celengan) {
            celengan.spawn(positionX)
        }
    }
    increaseLife(player, celengan) {
        celengan.die()

        if (this.life < 3) {
            this.life++
        }

        this.sound.play('celengan')
        if (this.life >= 3) {
            player.clearTint().setAlpha(2) //clearTint menghapus warna objek
        }

    
    }

}

import Phaser from 'phaser'

export default class FallingObject extends

Phaser.Physics.Arcade.Sprite //class ini digunakan untuk membuat object dengan tipe sprite
{
    constructor(scene, x, y, texture, config) {
        super (scene, x, y, texture)
        this.scene = scene
        this.speed = config.speed

    }
    spawn(positionX){
        this.setPosition(positionX, -10) //Nilai positionX akan diatur ketika method ini dipanggil
        this.setActive(true)
        this.setVisible(true)

    }
    die(){ //untuk menghancurkan(menghilangkan) objek enemy
        this.destroy()

    }
    update(time){ //merekam perubahan yang terjadi secara terus menuerus(forever), parameter time berfungsi untuk menyimpan waktu sekarang(current time) dan digunakan ketika game ingin menampilkan objek berdasarkan rentang waktu
        this.setVelocityY(this.speed) //object bergerak turun dan berotasi
        //this.rotation += this.rotationVal

        const gameHeight = this.scene.scale.height //Jika object melewati batas bawah layout, maka menghilang
        if (this.y > gameHeight +5) {
            this.die()
        }

    }
}
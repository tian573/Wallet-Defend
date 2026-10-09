import Phaser from 'phaser'

export default class Coin extends

Phaser.Physics.Arcade.Sprite
{
    
    constructor(scene,x, y, texture) {
        super (scene, x,y, texture)
        this.setScale(2)



    }
    fire(x, y){
        this.setPosition(x,y-50) //nilai x dan y akan diatur ketika method ini dipanggil
        this.setActive(true)
        this.setVisible(true)



    }
    die() { //untu membunuh objek enemy
        this.destroy()



    }
    update(time) {
        this.setVelocityY(-200) //object bergerak naik, kalau yang this.setVelocityY(this.speed) itu dipake untuk object bergerak kebawah
        if (this.y <-10) {
            this.die() //jika object melewati batas atas, maka akan menghilang
        }



    }
}

export { CharModel }

const CAMERA_LERP = .15
const MOVE_SPEED = 250


class CharModel {
    constructor(game) {
        this.game = game
    }

    preload() {
        this.game.load.image('chowder', 'assets/henry.png')
        this.game.load.image('henry', 'assets/chowder.png')
        this.keys = this.game.input.keyboard.addKeys("W,A,S,D,R")
    }

    create() {
        this.sprite = this.game.physics.add.image(0, 0, 'chowder')
        this.sprite.setScale(.5)
        this.game.cameras.main.startFollow(this.sprite, true, CAMERA_LERP, CAMERA_LERP)
    }

    update() {
        if (this.keys.A.isDown) {
            this.sprite.setVelocityX(-MOVE_SPEED)
        } else if (this.keys.D.isDown) {
            this.sprite.setVelocityX(MOVE_SPEED)
        } else {
            this.sprite.setVelocityX(0)
        }

        if (this.keys.W.isDown) {
            this.sprite.setVelocityY(-MOVE_SPEED)
        } else if (this.keys.S.isDown) {
            this.sprite.setVelocityY(MOVE_SPEED)
        } else {
            this.sprite.setVelocityY(0)
        }
    }

    despawn() {
        this.sprite.destroy();
    }
}
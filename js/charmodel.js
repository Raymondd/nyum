export { CharModel }

const CAMERA_LERP = .15
const MOVE_SPEED = 250


class CharModel {
    constructor(game) {
        this.game = game
    }

    preload() {
        this.game.load.spritesheet('wizard', 'assets/wizard_run.png', {
            frameWidth: 16,
            frameHeight: 28
        });
        this.keys = this.game.input.keyboard.addKeys("W,A,S,D,R")
    }

    create() {
        let walk = this.game.anims.create({
            key: 'walk',
            frames: this.game.anims.generateFrameNumbers('wizard'),
            frameRate: 16,
        });

        this.sprite = this.game.physics.add.sprite(0, 0, 'wizard')
        this.sprite.smoothed = false
        this.sprite.setScale(2)

        this.game.cameras.main.startFollow(this.sprite, true, CAMERA_LERP, CAMERA_LERP)
    }

    update() {
        if (this.keys.A.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-MOVE_SPEED)
            this.sprite.play('walk', true)
        } else if (this.keys.D.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(MOVE_SPEED)
            this.sprite.play('walk', true)
        } else {
            this.sprite.setVelocityX(0)
        }

        if (this.keys.W.isDown) {
            this.sprite.setVelocityY(-MOVE_SPEED)
            this.sprite.play('walk', true)
        } else if (this.keys.S.isDown) {
            this.sprite.setVelocityY(MOVE_SPEED)
            this.sprite.play('walk', true)
        } else {
            this.sprite.setVelocityY(0)
        }
    }

    despawn() {
        this.sprite.destroy();
    }
}
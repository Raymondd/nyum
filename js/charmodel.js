export { CharModel }

const CAMERA_LERP = .15
const MOVE_SPEED = 250
const HEALTH_BAR_SIZE = 50


class CharModel {
    constructor(game) {
        this.game = game
        this.health = HEALTH_BAR_SIZE
        this.cooldown = false
    }

    preload() {
        this.game.load.spritesheet('wizard', 'assets/wizard_run.png', {
            frameWidth: 16,
            frameHeight: 28
        });
        this.keys = this.game.input.keyboard.addKeys("W,A,S,D,R")
    }

    create(endGameCallBack) {
        this.game.anims.create({
            key: 'walk',
            frames: this.game.anims.generateFrameNumbers('wizard'),
            frameRate: 16,
        });

        // Create main sprite
        this.sprite = this.game.physics.add.sprite(0, 0, 'wizard')
        this.sprite.smoothed = false
        this.sprite.setScale(2)

        this.game.cameras.main.startFollow(this.sprite, true, CAMERA_LERP, CAMERA_LERP)

        // Create health bar
        this.healthBar = this.game.add.rectangle(0, 0, HEALTH_BAR_SIZE, HEALTH_BAR_SIZE / 10, 0xA3255A)
        this.endGameCallBack = endGameCallBack
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

        this.healthBar.x = this.sprite.x
        this.healthBar.y = this.sprite.y + this.sprite.height + 10
        this.healthBar.width = this.health
    }

    removeHealth(minusHealth) {
        if (!this.cooldown) {
            this.cooldown = true
            this.health = Math.max(this.health - minusHealth, 0);
            this.game.time.addEvent({
                delay: 100,
                callback: _ => this.cooldown = false,
                callbackScope: this,
            })
        }

        if (this.health == 0) {
            this.sprite.destroy()
            this.endGameCallBack()
        }
    }

    addHealth(health) {

    }

    despawn() {
        this.sprite.destroy();
    }
}
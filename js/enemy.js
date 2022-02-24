const HEALTH_BAR_SIZE = 50

class Enemy {
    constructor(name, walk, speed, scale, char, enemyGroup, game) {
        this.speed = speed
        this.name = name
        this.spin = 0
        this.walk = walk
        this.game = game
        this.enemyGroup = enemyGroup
        this.scale = scale
        this.char = char
        this.health = 1
        this.cooldown = false
    }

    setHealth(health) {
        this.health = health
        return this
    }

    spawn() {
        const dist = 1500
        var x = 0
        var y = 0
        let point = Math.random() * (dist * 4)

        if (point < dist) {
            x = point
        } else if (point < dist * 2) {
            x = dist
            y = point - dist
        } else if (point < dist * 3) {
            y = dist
            x = point - dist * 2
        } else {
            y = point - dist * 3
        }


        var spawnX = this.char.x + x - dist / 2
        var spawnY = this.char.y + y - dist / 2
        this.sprite = this.game.physics.add.sprite(spawnX, spawnY, this.name)
        this.sprite.setScale(this.scale)
        this.sprite.body.setBounce(1, 1);
        this.enemyGroup.add(this.sprite)
        this.sprite.removeHealth = this.removeHealth()

        this.healthBar = this.game.add.rectangle(0, 0, HEALTH_BAR_SIZE, HEALTH_BAR_SIZE / 7, 0xA3255A)
        if (this.health == 1) {
            this.healthBar.visible = false
        }

        return this
    }

    removeHealth() {
        var _this = this;
        return function(minusHealth) {
            if (!_this.cooldown) {
                _this.cooldown = true
                _this.health = Math.max(_this.health - minusHealth, 0);
                _this.game.time.addEvent({
                    delay: 100,
                    callback: _ => _this.cooldown = false,
                    callbackScope: _this,
                })
            }

            if (_this.health == 0) {
                _this.sprite.destroy()
                _this.healthBar.destroy()
            }
        }
    }

    update(char) {
        if (this.sprite.active) {
            const speed = this.speed + Math.random() * 20
            const tol = 0
            if (this.sprite.x + tol < char.x) {
                // Go right
                this.sprite.setVelocityX(speed)
                this.sprite.flipX = false
            } else if (this.sprite.x - tol > char.x) {
                // Go left
                this.sprite.setVelocityX(-speed)
                this.sprite.flipX = true
            } else {
                this.sprite.setVelocityX(0)
            }

            if (this.sprite.y + tol < char.y) {
                // Go down
                this.sprite.setVelocityY(speed)
            } else if (this.sprite.y - tol > char.y) {
                // Go up
                this.sprite.setVelocityY(-speed)
            } else {
                this.sprite.setVelocityY(0)
            }

            this.sprite.angle += this.spin;
            this.sprite.play(this.walk, true)

            if (this.healthBar !== undefined) {
                this.healthBar.x = this.sprite.x
                this.healthBar.y = this.sprite.y + this.sprite.displayHeight / 2 + 10
                this.healthBar.width = this.health
            }
        }
    }

    destroy() {
        this.sprite.destroy()
        this.healthBar.destroy()
    }

}

export class Orc extends Enemy {
    constructor(char, enemyGroup, game) {
        super('orc', 'orc-walk', 50, 2, char, enemyGroup, game, 1);
    }
}

export class Ogre extends Enemy {
    constructor(char, enemyGroup, game) {
        super('ogre', 'ogre-walk', 50, 7, char, enemyGroup, game, 10);
    }
}
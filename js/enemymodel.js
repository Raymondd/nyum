export { EnemyModel }


class EnemyModel {
    constructor(game) {
        this.game = game
        this.active = new Set()
    }

    preload(abilityModel) {
        this.abilityModel = abilityModel
        this.game.load.image('kelley', 'assets/kelley.png');
        this.game.load.image('roffles', 'assets/roffles.png');
        this.game.load.image('redbull', 'assets/redbull.png');

        this.game.load.spritesheet('orc', 'assets/orc_run.png', {
            frameWidth: 16,
            frameHeight: 20
        });
    }

    create(char, endGameCallBack, updateScoreCallback) {
        this.score = 0
        this.char = char
        this.endGameCallBack = endGameCallBack
        this.updateScoreCallback = updateScoreCallback

        // Setup collisions groups
        this.enemyGroup = this.game.physics.add.group()
        this.game.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.game.physics.add.overlap(this.enemyGroup, this.char, function() {
            this.char.destroy()
            this.endGameCallBack()
        }, null, this)

        this.game.physics.add.overlap(this.enemyGroup, this.abilityModel.group, function(enemy, ability) {
            this.despawn(enemy, this.char)
            ability.destroy()
        }, null, this)

        this.game.anims.create({
            key: 'orc-walk',
            frames: this.game.anims.generateFrameNumbers('orc'),
            frameRate: 16,
        });

        this.startSpawner(200, _ => {
            let spawn = new Orc(char, this.enemyGroup, this.game);
            this.active.add(spawn)
            return spawn.sprite
        })
    }

    startSpawner(delay, spawner) {
        this.game.time.addEvent({
            delay: delay,
            callback: _ => spawner(),
            callbackScope: this,
            loop: true,
        })
    }

    spawnDrop(enemy, char) {
        let sprite = this.game.physics.add.image(enemy.x, enemy.y, 'redbull')
        sprite.setScale(1)

        this.game.physics.add.overlap(sprite, char, function() {
            if (sprite.active) {
                sprite.destroy()
                this.updateScoreCallback()
            }
        }, null, this)
    }

    update(char) {
        this.active.forEach(e => e.update(char))

        // Start cleaning up entities that are far away from the character
        if (this.active.size > 100) {
            for (let e of this.active) {
                if (Math.hypot(e.sprite.x - this.char.x, e.sprite.y - this.char.y) > 2000) {
                    this.despawn(e.sprite)
                }
            }
        }
    }

    despawn(entity, char) {
        if (entity.active) {
            this.active.delete(entity)
            this.spawnDrop(entity, char)
            entity.destroy()
        }
    }
}

class Enemy {
    constructor(name, walk, speed, scale, char, enemyGroup, game) {
        let dist = 1500
        let x = 0
        let y = 0
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

        var spawnX = char.x + x - dist / 2
        var spawnY = char.y + y - dist / 2
        this.speed = speed
        this.spin = 0
        this.walk = walk
        this.game = game
        this.sprite = this.game.physics.add.sprite(spawnX, spawnY, name)

        this.sprite.setScale(scale)
        enemyGroup.add(this.sprite)
    }

    update(char) {
        if (this.sprite.active) {
            let tol = 0
            if (this.sprite.x + tol < char.x) {
                // Go right
                this.sprite.setVelocityX(this.speed)
                this.sprite.flipX = false
            } else if (this.sprite.x - tol > char.x) {
                // Go left
                this.sprite.setVelocityX(-this.speed)
                this.sprite.flipX = true
            } else {
                this.sprite.setVelocityX(0)
            }

            if (this.sprite.y + tol < char.y) {
                // Go down
                this.sprite.setVelocityY(this.speed)
            } else if (this.sprite.y - tol > char.y) {
                // Go up
                this.sprite.setVelocityY(-this.speed)
            } else {
                this.sprite.setVelocityY(0)
            }

            this.sprite.angle += this.spin;
            this.sprite.play(this.walk, true)
        }
    }
}

class Orc extends Enemy {
    constructor(char, enemyGroup, game) {
        super('orc', 'orc-walk', 50, 2, char, enemyGroup, game);
    }
}
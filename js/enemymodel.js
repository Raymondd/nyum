export { EnemyModel }


class EnemyModel {
    constructor(game) {
        this.game = game
        this.active = new Set()
    }

    preload() {
        this.game.load.image('kelley', 'assets/kelley.png');
        this.game.load.image('roffles', 'assets/roffles.png');
        this.game.load.image('redbull', 'assets/redbull.png');
    }

    create(char, endGameCallBack, updateScoreCallback) {
        this.score = 0
        this.char = char
        this.endGameCallBack = endGameCallBack
        this.updateScoreCallback = updateScoreCallback

        // Starts a roffles spawner at 500 ms intervals
        this.startSpawner(500, _ => {
            let spawn = new Roffles(char, this.game);
            this.active.add(spawn)
            return spawn.sprite
        })

        this.startSpawner(50, _ => {
            let spawn = new Kelley(char, this.game);
            this.active.add(spawn)
            return spawn.sprite
        })
    }

    startSpawner(delay, spawner) {
        this.game.time.addEvent({
            delay: delay,
            callback: function () {
                let spawn = spawner()

                this.game.physics.add.overlap(spawn, this.char, function () {
                    this.char.destroy()
                    this.endGameCallBack()
                }, null, this)
            },
            callbackScope: this,
            loop: true,
        })
    }

    spawnDrop(enemy, char) {
        let sprite = this.game.physics.add.image(enemy.x, enemy.y, 'redbull')
        sprite.setScale(1)

        this.game.physics.add.overlap(sprite, char, function () {
            if (sprite.active) {
                sprite.destroy()
                this.updateScoreCallback()
            }
        }, null, this)
    }

    updateAll(char) {
        this.active.forEach(e => e.update(char))
    }

    despawn(entity, char) {
        if (entity.active) {
            this.active.delete(entity)
            this.spawnDrop(entity, char)
            entity.destroy()
        }
    }

    despawnAll() {
        this.active.forEach(function (e) { if (e.active) e.destroy() })
        this.active.clear()
    }
}

class Enemy {
    constructor(name, speed, spin, scale, char, game) {
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
            x = point - dist*2
        } else {
            y = point - dist*3
        }

        var spawnX = char.x + x - dist / 2
        var spawnY = char.y + y - dist / 2
        this.speed = speed
        this.spin = spin

        this.sprite = game.physics.add.image(spawnX, spawnY, name)
        this.sprite.setScale(scale)
    }

    update(char) {
        if (this.sprite.active) {
            this.sprite.setVelocityX(this.sprite.x < char.x ? this.speed : -this.speed)
            this.sprite.setVelocityY(this.sprite.y < char.y ? this.speed : -this.speed)
            this.sprite.angle += this.spin;
        }
    }
}

class Roffles extends Enemy {
    constructor(char, game) {
        super('roffles', 100, 5, 1, char, game);
    }
}


class Kelley extends Enemy {
    constructor(char, game) {
        super('kelley', 50, 5, .2, char, game);
    }
}
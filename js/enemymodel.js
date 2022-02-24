import { Ogre, Orc } from "./enemy.js"


export class EnemyModel {
    constructor(game) {
        this.game = game
        this.active = new Set()
    }

    preload(abilityModel, charModel) {
        this.abilityModel = abilityModel
        this.charModel = charModel
        this.game.load.image('kelley', 'assets/kelley.png');
        this.game.load.image('roffles', 'assets/roffles.png');
        this.game.load.image('redbull', 'assets/redbull.png');

        this.game.load.spritesheet('orc', 'assets/orc_run.png', {
            frameWidth: 16,
            frameHeight: 20
        });
        this.game.load.spritesheet('ogre', 'assets/ogre_run.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create(char, updateScoreCallback) {
        this.score = 0
        this.char = char
        this.updateScoreCallback = updateScoreCallback

        // Setup collisions groups
        this.enemyGroup = this.game.physics.add.group()
        this.game.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.game.physics.add.overlap(this.enemyGroup, this.char, function() {
            this.charModel.removeHealth(5)
        }, null, this)

        this.game.physics.add.overlap(this.enemyGroup, this.abilityModel.group, function(enemy, ability) {
            this.hitEnemy(enemy, this.char)
            ability.destroy()
        }, null, this)

        this.game.anims.create({
            key: 'orc-walk',
            frames: this.game.anims.generateFrameNumbers('orc'),
            frameRate: 16,
        });

        this.game.anims.create({
            key: 'ogre-walk',
            frames: this.game.anims.generateFrameNumbers('ogre'),
            frameRate: 16,
        });

        this.startSpawner(200, _ => {
            let spawn = new Orc(char, this.enemyGroup, this.game).spawn();
            this.active.add(spawn)
        })

        this.startSpawner(2000, _ => {
            const spawn = new Ogre(char, this.enemyGroup, this.game).setHealth(50).spawn();
            this.active.add(spawn)
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

    hitEnemy(enemy, char) {
        if (enemy.active) {
            this.active.delete(enemy)
            enemy.removeHealth(10)

            // Spawn a drop if the enemy died
            if (!enemy.active) {
                this.spawnDrop(enemy, char)
            }
        }
    }
}
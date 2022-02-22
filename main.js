import { EnemyModel } from './js/enemymodel.js'
import { CharModel } from './js/charmodel.js'
import { BackgroundModel } from './js/backgroundmodel.js'

const WIDTH = 1000
const HEIGHT = 1000
const KNIFE_SPEED = 500

const GameState = {
    SETUP: 'SETUP',
    RUNNING: 'RUNNING',
    DONE: 'DONE',
}

class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.knives = []
        this.gameState = GameState.SETUP
        this.keys
        this.knifeSpeedX
        this.knifeSpeedY
        this.score = 0
        this.scoreText

        // Entity models
        this.enemyModel
        this.charModel
        this.backgroundModel;
    }

    preload() {
        this.enemyModel = new EnemyModel(this)
        this.charModel = new CharModel(this)
        this.backgroundModel = new BackgroundModel(this)

        this.backgroundModel.preload()
        this.enemyModel.preload()
        this.charModel.preload()

        this.load.image('knife', 'assets/ball.png')
        this.load.image('thumb', 'assets/thumbs_down.png')
        this.load.audio('roses', 'assets/roses.mp3')
    }

    create() {
        // Set up scoreboard
        this.scoreText = this.add.text(20, 0, 'SCORE: 0', { fontSize: '32px', fill: '#FFF' })
        this.scoreText.setScrollFactor(0)

        this.backgroundModel.create()
        this.charModel.create()

        this.enemyModel.create(this.charModel.sprite,
            _ => this.gameState = GameState.DONE,
            _ => this.updateScore(this.score++)
        )

        // Set up knives
        this.time.addEvent({
            delay: 600,
            callback: function() {
                var knife = this.physics.add.image(this.charModel.sprite.x, this.charModel.sprite.y, 'knife')
                knife.setScale(.02)
                knife.setVelocityX(this.knifeSpeedX)
                knife.setVelocityY(this.knifeSpeedY)

                this.knives.push(knife)
                if (this.knives.length > 5) this.knives.shift().destroy()

                for (const e of this.enemyModel.active) {
                    this.physics.add.overlap(e.sprite, knife, this.knifeHitsBall, null, this)
                }
            },
            callbackScope: this,
            loop: true,
        })

        // Set initial knife speed
        this.knifeSpeedX = KNIFE_SPEED
        this.knifeSpeedY = 0

        // Play music
        var bgm = this.sound.add('roses', { loop: true, volume: .01 })
        bgm.play()

        // Set up keys
        this.keys = this.input.keyboard.addKeys("W,A,S,D,R")

        this.gameState = GameState.RUNNING
    }

    update() {
        if (this.keys.R.isDown) {
            this.scene.restart()
        }

        if (this.gameState == GameState.DONE) {
            const deadText = this.add.text(100, 100, 'U DIED BRO. HAPPENS.', { fontSize: '32px', fill: '#FFF' })
            deadText.setScrollFactor(0)
            const thumb = this.physics.add.image(500, 500, 'thumb')
            thumb.setScrollFactor(0)
            thumb.setScale(5)
            this.knives.forEach(i => i.destroy())
            this.enemyModel.despawnAll()
            this.charModel.despawn();
            return
        }

        if (this.keys.A.isDown) {
            this.knifeSpeedX = -KNIFE_SPEED
        } else if (this.keys.D.isDown) {
            this.knifeSpeedX = KNIFE_SPEED
        } else {
            if (this.keys.W.isDown || this.keys.S.isDown)
                this.knifeSpeedX = 0
        }

        if (this.keys.W.isDown) {
            this.knifeSpeedY = -KNIFE_SPEED
        } else if (this.keys.S.isDown) {
            this.knifeSpeedY = KNIFE_SPEED
        } else {
            if (this.keys.A.isDown || this.keys.D.isDown)
                this.knifeSpeedY = 0
        }

        this.backgroundModel.update()
        this.enemyModel.update(this.charModel.sprite)
        this.charModel.update()

        for (const k of this.knives) {
            k.angle += 20
        }
    }

    knifeHitsBall(e, knife) {
        this.enemyModel.despawn(e, this.charModel.sprite)
    }

    updateScore(score) {
        this.scoreText.setText("SCORE: " + this.score)
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#196F3D',
    physics: {
        default: 'arcade',
    },
    scene: [MainScene],
    scale: {
        width: WIDTH,
        height: HEIGHT,
        parent: 'game',
    },
    pixelArt: true,
})
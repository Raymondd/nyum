import { EnemyModel } from './js/enemymodel.js'
import { CharModel } from './js/charmodel.js'
import { BackgroundModel } from './js/backgroundmodel.js'
import { AbilityModel } from './js/abilitymodel.js'

const WIDTH = 1000
const HEIGHT = 1000

const GameState = {
    SETUP: 'SETUP',
    RUNNING: 'RUNNING',
    DONE: 'DONE',
}

class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.gameState = GameState.SETUP
        this.keys
        this.score = 0
        this.scoreText

        // Entity models
        this.enemyModel
        this.charModel
        this.backgroundModel
        this.abilityModel
    }

    preload() {
        this.enemyModel = new EnemyModel(this)
        this.charModel = new CharModel(this)
        this.backgroundModel = new BackgroundModel(this)
        this.abilityModel = new AbilityModel(this)

        this.backgroundModel.preload()
        this.enemyModel.preload(this.abilityModel, this.charModel)
        this.charModel.preload()
        this.abilityModel.preload(this.charModel)

        this.load.image('thumb', 'assets/thumbs_down.png')
        this.load.audio('roses', 'assets/roses.mp3')
    }

    create() {
        // Set up scoreboard
        this.scoreText = this.add.text(20, 0, 'SCORE: 0', { fontSize: '32px', fill: '#FFF' })
        this.scoreText.setScrollFactor(0)

        this.backgroundModel.create()
        this.charModel.create(_ => this.gameState = GameState.DONE)
        this.enemyModel.create(
            this.charModel.sprite,
            _ => this.updateScore(this.score++)
        )
        this.abilityModel.create(this.enemyModel.enemyGroup)

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
            return
        }

        this.backgroundModel.update()
        this.enemyModel.update(this.charModel.sprite)
        this.charModel.update()
        this.abilityModel.update()
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
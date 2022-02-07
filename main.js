import { EnemyModel } from './js/enemymodel.js'
import { CharModel } from './js/charmodel.js'
import { BackgroundModel } from './js/backgroundmodel.js'

const WIDTH = 1000
const HEIGHT = 1000
const KNIFE_SPEED = 500
var game


game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#196F3D',
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        width: WIDTH,
        height: HEIGHT
    }
})

const GameState = {
    SETUP: 'SETUP',
    RUNNING: 'RUNNING',
    DONE: 'DONE',
}


var knives = []
var gameState = GameState.SETUP
var keys
var knifeSpeedX
var knifeSpeedY
var score = 0
var scoreText

// Entity models
var enemyModel
var charModel
var backgroundModel;

function preload() {
    enemyModel = new EnemyModel(this)
    charModel = new CharModel(this)
    backgroundModel = new BackgroundModel(this)

    backgroundModel.preload()
    enemyModel.preload()
    charModel.preload()

    this.load.image('knife', 'assets/ball.png')
    this.load.image('thumb', 'assets/thumbs_down.png')
    this.load.audio('roses', 'assets/roses.mp3')
}

function create() {
    // Set up scoreboard
    scoreText = this.add.text(20, 0, 'SCORE: 0', { fontSize: '32px', fill: '#FFF' })
    scoreText.setScrollFactor(0)

    backgroundModel.create()
    charModel.create()
    enemyModel.create(charModel.sprite,
        _ => gameState = GameState.DONE,
        function() {
            score += 1
            scoreText.setText("SCORE: " + score)
        })

    // Set up knives
    this.time.addEvent({
        delay: 600,
        callback: function () {
            var knife = this.physics.add.image(charModel.sprite.x, charModel.sprite.y, 'knife')
            knife.setScale(.02)
            knife.setVelocityX(knifeSpeedX)
            knife.setVelocityY(knifeSpeedY)

            knives.push(knife)
            if (knives.length > 5) knives.shift().destroy()

            for (const e of enemyModel.active) {
                this.physics.add.overlap(e.sprite, knife, knifeHitsBall, null, this)
            }
        },
        callbackScope: this,
        loop: true,
    })

    // Set initial knife speed
    knifeSpeedX = KNIFE_SPEED
    knifeSpeedY = 0

    // Play music
    var bgm = this.sound.add('roses', { loop: true, volume: .01 })
    bgm.play()

    // Set up keys
    keys = this.input.keyboard.addKeys("W,A,S,D,R")

    gameState = GameState.RUNNING
}

function update() {
    if (keys.R.isDown) {
        this.scene.restart()
    }

    if (gameState == GameState.DONE) {
        const deadText = this.add.text(100, 100, 'U DIED BRO. HAPPENS.', { fontSize: '32px', fill: '#FFF' })
        deadText.setScrollFactor(0)
        const thumb = this.physics.add.image(500, 500, 'thumb')
        thumb.setScrollFactor(0)
        thumb.setScale(5)
        knives.forEach(i => i.destroy())
        enemyModel.despawnAll()
        charModel.despawn();
        return
    }

    if (keys.A.isDown) {
        knifeSpeedX = -KNIFE_SPEED
    } else if (keys.D.isDown) {
        knifeSpeedX = KNIFE_SPEED
    } else {
        if (keys.W.isDown || keys.S.isDown)
            knifeSpeedX = 0
    }

    if (keys.W.isDown) {
        knifeSpeedY = -KNIFE_SPEED
    } else if (keys.S.isDown) {
        knifeSpeedY = KNIFE_SPEED
    } else {
        if (keys.A.isDown || keys.D.isDown)
            knifeSpeedY = 0
    }

    backgroundModel.update()
    enemyModel.updateAll(charModel.sprite)
    charModel.update()

    for (const k of knives) {
        k.angle += 20
    }
}

function knifeHitsBall(e, knife) {
    enemyModel.despawn(e, charModel.sprite)
}

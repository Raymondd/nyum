import { EnemyModel } from './js/enemymodel.js';

const WIDTH = 1000
const HEIGHT = 1000
const MOVE_SPEED = 250
const KNIFE_SPEED = 500
const CAMERA_LERP = .15
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
});

const GameState = {
    SETUP: 'SETUP',
    RUNNING: 'RUNNING',
    DONE: 'DONE',
};


var char
var knives = []
var knife_count = 10
var score = 0
var gameState = GameState.SETUP
var keys
var knifeSpeedX
var knifeSpeedY
var scoreText
var enemyModel
var grass

function preload() {
    enemyModel = new EnemyModel(this);
    enemyModel.preload(this.load);

    this.load.image('knife', 'assets/ball.png');
    this.load.image('chowder', 'assets/henry.png');
    this.load.image('thumb', 'assets/thumbs_down.png');
    this.load.audio('roses', 'assets/roses.mp3');
    this.load.image('grass', 'assets/grass.png');
}

function create() {
    // Set up scoreboard
    scoreText = this.add.text(20, 0, 'SCORE: 0', { fontSize: '32px', fill: '#FFF' });
    scoreText.setScrollFactor(0)

    // Set up char
    char = this.physics.add.image(0, 0, 'chowder');
    char.setScale(.5)
    this.cameras.main.startFollow(char, true, CAMERA_LERP, CAMERA_LERP);

    // Register keys
    keys = this.input.keyboard.addKeys("W,A,S,D,R");

    // Set up knives
    this.time.addEvent({
        delay: 600,
        callback: function () {
            var knife = this.physics.add.image(char.x, char.y, 'knife')
            knife.setScale(.02)
            knife.setVelocityX(knifeSpeedX)
            knife.setVelocityY(knifeSpeedY)

            knives.push(knife)
            if (knives.length > 5) knives.shift().destroy()


            for (const e of enemyModel.active)
                this.physics.add.overlap(e, knife, knifeHitsBall, null, this);
        },
        callbackScope: this,
        loop: true,
    });

    // Set initial knife speed
    knifeSpeedX = KNIFE_SPEED
    knifeSpeedY = 0

    // Set up enemies
    this.time.addEvent({
        delay: 200,
        callback: function () {
            const spawn = enemyModel.spawn(char)

            enemyModel.active.add(spawn)

            for (const knife of knives)
                this.physics.add.overlap(spawn, knife, knifeHitsBall, null, this)

            this.physics.add.overlap(spawn, char, function () {
                char.destroy()
                gameState = GameState.DONE
            }, null, this);
        },
        callbackScope: this,
        loop: true,
    });

    // Play music
    var bgm = this.sound.add('roses', { loop: true, volume: .01 });
    bgm.play();
    
    gameState = GameState.RUNNING;
}

function update() {
    if (keys.R.isDown) {
        this.scene.restart()
    }

    if (gameState == GameState.DONE) {
        const deadText = this.add.text(100, 100, 'U DIED BRO. HAPPENS.', { fontSize: '32px', fill: '#FFF' });
        deadText.setScrollFactor(0)
        const thumb = this.physics.add.image(500, 500, 'thumb')
        thumb.setScrollFactor(0)
        thumb.setScale(5)
        reset()
        return
    }

    if (keys.A.isDown) {
        char.setVelocityX(-MOVE_SPEED)
        knifeSpeedX = -KNIFE_SPEED
    } else if (keys.D.isDown) {
        knifeSpeedX = KNIFE_SPEED
        char.setVelocityX(MOVE_SPEED)
    } else {
        char.setVelocityX(0)
        if (keys.W.isDown || keys.S.isDown)
            knifeSpeedX = 0
    }

    if (keys.W.isDown) {
        knifeSpeedY = -KNIFE_SPEED
        char.setVelocityY(-MOVE_SPEED)
    } else if (keys.S.isDown) {
        knifeSpeedY = KNIFE_SPEED
        char.setVelocityY(MOVE_SPEED)
    } else {
        char.setVelocityY(0)
        if (keys.A.isDown || keys.D.isDown)
            knifeSpeedY = 0
    }

    enemyModel.updateAll(char)

    for (const k of knives) {
        k.angle += 20;
    }
}

function renderBackground(char, game) {
     
    var tile1 = game.physics.add.image(-250, -250, 'grass');
    var tile2 = game.physics.add.image(250, -250, 'grass');
    var tile3 = game.physics.add.image(-250, 250,'grass');
    var tile4 = game.physics.add.image(250, 250,'grass');
    console.log(tile1.x)
}

function knifeHitsBall(e, knife) {
    enemyModel.despawn(e)
    score += 1
    scoreText.setText("SCORE: " + score)
}

function reset() {
    knives.forEach(i => i.destroy())
    enemyModel.despawnAll()
    char.destroy()
}

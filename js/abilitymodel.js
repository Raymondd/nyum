export { AbilityModel }

const ABILITY_SPEED = 200

class AbilityModel {
    constructor(game) {
        this.game = game
        this.abilityList = []
        this.group = this.game.physics.add.group()
    }

    preload(charModel) {
        this.charModel = charModel
        this.game.load.image('ball', 'assets/ball.png')
    }

    create() {
        this.abilitySpeedX = ABILITY_SPEED
        this.abilitySpeedY = 0

        this.startSpawner(600, _ => this.spawner())
    }

    startSpawner(delay, spawner) {
        this.game.time.addEvent({
            delay: delay,
            callback: _ => spawner(),
            callbackScope: this,
            loop: true,
        })
    }

    spawner() {
        var ability = this.game.physics.add.image(this.charModel.sprite.x, this.charModel.sprite.y, 'ball')
        this.group.add(ability)
        ability.setScale(.01)
        ability.setVelocity(this.abilitySpeedX, this.abilitySpeedY)

        this.abilityList.push(ability)
        if (this.abilityList.length > 5) this.abilityList.shift().destroy()
    }
    x

    update() {
        if (this.game.keys.A.isDown) {
            this.abilitySpeedX = -ABILITY_SPEED
        } else if (this.game.keys.D.isDown) {
            this.abilitySpeedX = ABILITY_SPEED
        } else {
            if (this.game.keys.W.isDown || this.game.keys.S.isDown)
                this.abilitySpeedX = 0
        }

        if (this.game.keys.W.isDown) {
            this.abilitySpeedY = -ABILITY_SPEED
        } else if (this.game.keys.S.isDown) {
            this.abilitySpeedY = ABILITY_SPEED
        } else {
            if (this.game.keys.A.isDown || this.game.keys.D.isDown)
                this.abilitySpeedY = 0
        }
    }
}
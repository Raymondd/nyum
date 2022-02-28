export class HealthBar {
    constructor(game, maxHealth) {
        this.game = game
        this.visible = !(maxHealth <= 1)
        this.maxHealth = maxHealth
        this.health = maxHealth

        this.healthBarBackground = this.game.add.rectangle(0, 0, 0, 0, 0x000000)
        this.healthBar = this.game.add.rectangle(0, 0, 0, 0, 0xA3255A)
        this.healthBar.visible = this.visible
        this.healthBarBackground.visible = this.visible

        this.cooldown = false
    }

    update(char) {
        const healthX = char.x - (char.displayWidth / 2)
        const healthY = char.y + (char.displayHeight / 2) + 5
        const width = char.displayWidth
        const height = char.displayHeight

        this.healthBar.x = healthX
        this.healthBar.y = healthY
        this.healthBar.width = width * (this.health / this.maxHealth)
        this.healthBar.height = height / 10


        this.healthBarBackground.x = healthX
        this.healthBarBackground.y = healthY
        this.healthBarBackground.width = width
        this.healthBarBackground.height = height / 10
    }

    removeHealth(health) {
        if (!this.cooldown) {
            this.cooldown = true
            this.health = Math.max(this.health - health, 0);
            this.game.time.addEvent({
                delay: 100,
                callback: _ => this.cooldown = false,
                callbackScope: this,
            })
        }

        if (this.health <= 0) {
            this.destroy()
        }
    }

    destroy() {
        this.healthBar.destroy()
        this.healthBarBackground.destroy()
    }
}
const HEALTH_BAR_SIZE = 50

export class HealthBar {
    constructor(game, maxHealth) {
        this.game = game
        this.visible = !(maxHealth <= 1)
        this.scale = maxHealth / HEALTH_BAR_SIZE
        this.health = maxHealth

        this.healthBarBackground = this.game.add.rectangle(0, 0, HEALTH_BAR_SIZE, HEALTH_BAR_SIZE / 7, 0x000000)
        this.healthBar = this.game.add.rectangle(0, 0, HEALTH_BAR_SIZE, HEALTH_BAR_SIZE / 7, 0xA3255A)
        this.healthBar.visible = this.visible
        this.healthBarBackground.visible = this.visible

        this.cooldown = false
    }

    update(char) {
        const healthX = char.x
        const healthY = char.y + char.displayHeight / 2 + 10

        this.healthBar.x = healthX
        this.healthBar.y = healthY
        this.healthBarBackground.x = healthX
        this.healthBarBackground.y = healthY
        this.healthBar.width = this.health * this.scale
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
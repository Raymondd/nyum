export { BackgroundModel }

const WIDTH = 1000
const IMAGE_WIDTH = 500

class BackgroundModel {
    constructor(game) {
        this.game = game
        this.tiles = new Set()
    }

    preload() {
        this.game.load.image('grass', 'assets/grass.png')
    }

    create() {
        this.layer = this.game.add.group()
    }

    update() {
        // Tiles the background to follow camera movement
        const x = this.game.cameras.main.midPoint.x;
        const y = this.game.cameras.main.midPoint.y;

        // TODO: recycle tiles to improve perf
        this.tiles.forEach(t => t.destroy())
        this.tiles.clear()

        const iterator = [...Array(5)];

        var tileX = x - x % IMAGE_WIDTH - (IMAGE_WIDTH * 2)
        for (const column in iterator) {
            var tileY = y - y % IMAGE_WIDTH - (IMAGE_WIDTH * 2)
            for (const row in iterator) {
                const tile = this.layer.create(tileX, tileY, 'grass')
                tile.setDepth(-1)
                this.tiles.add(tile)
                tileY += IMAGE_WIDTH
            }
            tileX += IMAGE_WIDTH
        }
    }

    destory() {
        // Keep the pretty tiles around?
    }
}
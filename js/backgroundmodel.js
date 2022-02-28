export class BackgroundModel {
    constructor(game) {
        this.game = game
    }

    preload() {
        this.game.load.image('tiles1', 'assets/dungeon_tiles.png')
    }

    create() {
        this.pathSize = 100
        this.tileSize = 16
            // displays ALL tiles from the tilesheet
            //var level = Array.from({ length: 32 }, (v1, k1) => [...Array.from({ length: 32 }, (v2, k2) => k2 + (32 * k1))])
        var level = Array.from({ length: this.pathSize }, (v1, k1) => [...Array.from({ length: this.pathSize }, (v2, k2) => 129)])
        console.log(level)

        var map = this.game.make.tilemap({ data: level });
        var tileset = map.addTilesetImage('tiles1', null, 16, 16)
        const center = -(this.pathSize * this.tileSize / 2)
        var layer = map.createLayer(0, tileset, center, center);
    }

    update() {}

    destory() {
        // Keep the pretty tiles around?
    }
}
export class SpatialPartitioning {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    addToGrid(entity) {
        const gridX = Math.floor(entity.x / this.cellSize);
        const gridY = Math.floor(entity.y / this.cellSize);

        const key = `${gridX}-${gridY}`;
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }

        this.grid.get(key).push(entity);
        entity.gridKey = key;
    }

    removeFromGrid(entity) {
        const key = entity.gridKey;
        const cell = this.grid.get(key);

        if (cell) {
            const index = cell.indexOf(entity);
            if (index !== -1) {
                cell.splice(index, 1);
                entity.gridKey = null;
            }
        }
    }

    updateEntityGrid(entity) {
        this.removeFromGrid(entity);
        this.addToGrid(entity);
    }

    getEntitiesInSameCell(entity) {
        const gridX = Math.floor(entity.x / this.cellSize);
        const gridY = Math.floor(entity.y / this.cellSize);

        const key = `${gridX}-${gridY}`;
        return this.grid.get(key) || [];
    }

    clearGrid() {
        this.grid.clear();
    }
}
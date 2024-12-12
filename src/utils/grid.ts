export class Grid {
  private grid: boolean[][][];
  private gridSize: number;

  constructor(size: number) {
    this.gridSize = size;
    this.initializeGrid();
  }

  private initializeGrid() {
    this.grid = Array(this.gridSize).fill(null).map(() =>
      Array(this.gridSize).fill(null).map(() =>
        Array(this.gridSize).fill(false)
      )
    );
  }

  public setCell(x: number, y: number, z: number, value: boolean) {
    if (this.isValidPosition(x, y, z)) {
      this.grid[x][y][z] = value;
    }
  }

  public getCell(x: number, y: number, z: number): boolean {
    return this.isValidPosition(x, y, z) ? this.grid[x][y][z] : false;
  }

  public isValidPosition(x: number, y: number, z: number): boolean {
    return x >= 0 && x < this.gridSize &&
           y >= 0 && y < this.gridSize &&
           z >= 0 && z < this.gridSize;
  }

  public getSize(): number {
    return this.gridSize;
  }

  public clearLayer(y: number) {
    if (y >= 0 && y < this.gridSize) {
      for (let x = 0; x < this.gridSize; x++) {
        for (let z = 0; z < this.gridSize; z++) {
          this.grid[x][y][z] = false;
        }
      }
    }
  }
}
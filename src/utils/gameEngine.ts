import * as THREE from 'three';
import { PieceDefinition } from './pieces';

export class GameEngine {
  private scene: THREE.Scene;
  private currentPiece: THREE.Group | null = null;
  private placedPieces: THREE.Group[] = [];
  private gridSize = 5;
  private grid: boolean[][][] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initializeGrid();
  }

  private initializeGrid() {
    this.grid = Array(this.gridSize).fill(null).map(() =>
      Array(this.gridSize).fill(null).map(() =>
        Array(this.gridSize).fill(false)
      )
    );
  }

  public spawnPiece(piece: PieceDefinition) {
    if (this.currentPiece) {
      this.scene.remove(this.currentPiece);
    }
    const newPiece = this.createPieceMesh(piece);
    // Start piece at the top center
    newPiece.position.set(0, this.gridSize, 0);
    this.scene.add(newPiece);
    this.currentPiece = newPiece;
    return newPiece;
  }

  public rotatePiece(axis: 'x' | 'y' | 'z') {
    if (!this.currentPiece) return;
    switch (axis) {
      case 'x':
        this.currentPiece.rotateX(Math.PI / 2);
        break;
      case 'y':
        this.currentPiece.rotateY(Math.PI / 2);
        break;
      case 'z':
        this.currentPiece.rotateZ(Math.PI / 2);
        break;
    }
  }

  public movePiece(direction: 'left' | 'right' | 'forward' | 'backward' | 'down') {
    if (!this.currentPiece) return;
    
    const moveAmount = 1;
    const originalPosition = this.currentPiece.position.clone();
    
    switch (direction) {
      case 'left':
        this.currentPiece.position.x -= moveAmount;
        break;
      case 'right':
        this.currentPiece.position.x += moveAmount;
        break;
      case 'forward':
        this.currentPiece.position.z -= moveAmount;
        break;
      case 'backward':
        this.currentPiece.position.z += moveAmount;
        break;
      case 'down':
        this.currentPiece.position.y -= moveAmount;
        break;
    }

    if (this.checkCollision()) {
      this.currentPiece.position.copy(originalPosition);
      if (direction === 'down') {
        this.placePiece();
      }
      return false;
    }
    return true;
  }

  private checkCollision(): boolean {
    if (!this.currentPiece) return false;

    // Get the world positions of all blocks in the current piece
    const blocks = this.getCurrentPieceBlocks();
    
    for (const position of blocks) {
      const gridX = Math.round(position.x + this.gridSize/2);
      const gridY = Math.round(position.y);
      const gridZ = Math.round(position.z + this.gridSize/2);

      // Check boundaries
      if (gridX < 0 || gridX >= this.gridSize ||
          gridY < 0 || gridY >= this.gridSize ||
          gridZ < 0 || gridZ >= this.gridSize) {
        return true;
      }

      // Check collision with placed pieces
      if (this.grid[gridX][gridY][gridZ]) {
        return true;
      }
    }

    return false;
  }

  private getCurrentPieceBlocks(): THREE.Vector3[] {
    if (!this.currentPiece) return [];
    
    const blocks: THREE.Vector3[] = [];
    this.currentPiece.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);
        blocks.push(worldPosition);
      }
    });
    return blocks;
  }

  private placePiece() {
    if (!this.currentPiece) return;

    // Update grid with placed piece
    const blocks = this.getCurrentPieceBlocks();
    for (const position of blocks) {
      const gridX = Math.round(position.x + this.gridSize/2);
      const gridY = Math.round(position.y);
      const gridZ = Math.round(position.z + this.gridSize/2);
      
      if (gridX >= 0 && gridX < this.gridSize &&
          gridY >= 0 && gridY < this.gridSize &&
          gridZ >= 0 && gridZ < this.gridSize) {
        this.grid[gridX][gridY][gridZ] = true;
      }
    }

    this.placedPieces.push(this.currentPiece);
    this.currentPiece = null;
    this.checkLayerCompletion();
  }

  private checkLayerCompletion() {
    for (let y = 0; y < this.gridSize; y++) {
      let layerComplete = true;
      for (let x = 0; x < this.gridSize; x++) {
        for (let z = 0; z < this.gridSize; z++) {
          if (!this.grid[x][y][z]) {
            layerComplete = false;
            break;
          }
        }
        if (!layerComplete) break;
      }
      
      if (layerComplete) {
        this.clearLayer(y);
      }
    }
  }

  private clearLayer(y: number) {
    // Remove blocks from the scene and update grid
    this.placedPieces = this.placedPieces.filter(piece => {
      let keepPiece = true;
      piece.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const worldPosition = new THREE.Vector3();
          child.getWorldPosition(worldPosition);
          const gridY = Math.round(worldPosition.y);
          if (gridY === y) {
            this.scene.remove(child);
            keepPiece = false;
          }
        }
      });
      return keepPiece;
    });

    // Clear the grid layer
    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        this.grid[x][y][z] = false;
      }
    }
  }

  private createPieceMesh(piece: PieceDefinition): THREE.Group {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
      color: piece.color,
      transparent: true,
      opacity: 0.8,
    });

    piece.blocks.forEach(([x, y, z]) => {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, y, z);
      group.add(cube);
    });

    return group;
  }

  public getCurrentPiece() {
    return this.currentPiece;
  }
}
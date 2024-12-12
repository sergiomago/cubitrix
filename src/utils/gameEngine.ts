import * as THREE from 'three';
import { PieceDefinition } from './pieces';
import { Grid } from './grid';
import { PieceManager } from './pieceManager';
import { isAdjacentToExistingPiece } from './placementRules';

export class GameEngine {
  private scene: THREE.Scene;
  private grid: Grid;
  private pieceManager: PieceManager;
  private gridSize = 5;
  private mainCube: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.grid = new Grid(this.gridSize);
    this.pieceManager = new PieceManager(scene, this.grid);
    this.mainCube = this.createMainCube();
    this.scene.add(this.mainCube);
  }

  private createMainCube() {
    const group = new THREE.Group();
    const size = this.gridSize;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
      color: 0x808080,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    group.add(cube);
    return group;
  }

  public rotatePiece(axis: 'x' | 'y' | 'z') {
    const currentPiece = this.pieceManager.getCurrentPiece();
    if (!currentPiece) return;
    
    switch (axis) {
      case 'x':
        currentPiece.rotateX(Math.PI / 2);
        break;
      case 'y':
        currentPiece.rotateY(Math.PI / 2);
        break;
      case 'z':
        currentPiece.rotateZ(Math.PI / 2);
        break;
    }
  }

  public rotateMainCube(axis: 'x' | 'y' | 'z') {
    if (!this.mainCube) return;
    
    switch (axis) {
      case 'x':
        this.mainCube.rotateX(Math.PI / 2);
        break;
      case 'y':
        this.mainCube.rotateY(Math.PI / 2);
        break;
      case 'z':
        this.mainCube.rotateZ(Math.PI / 2);
        break;
    }
  }

  public movePiece(direction: 'left' | 'right' | 'forward' | 'backward' | 'down') {
    const currentPiece = this.pieceManager.getCurrentPiece();
    if (!currentPiece) return false;
    
    const moveAmount = 1;
    const originalPosition = currentPiece.position.clone();
    
    switch (direction) {
      case 'left':
        currentPiece.position.x -= moveAmount;
        break;
      case 'right':
        currentPiece.position.x += moveAmount;
        break;
      case 'forward':
        currentPiece.position.z -= moveAmount;
        break;
      case 'backward':
        currentPiece.position.z += moveAmount;
        break;
      case 'down':
        currentPiece.position.y -= moveAmount;
        break;
    }

    if (this.checkCollision()) {
      currentPiece.position.copy(originalPosition);
      if (direction === 'down') {
        const blocks = this.pieceManager.getCurrentPieceBlocks();
        let canPlace = false;
        for (const position of blocks) {
          if (isAdjacentToExistingPiece(position, this.pieceManager.getPlacedPieces(), this.gridSize)) {
            canPlace = true;
            break;
          }
        }
        if (canPlace) {
          this.pieceManager.placePiece();
          return true; // Indicate piece was placed
        }
      }
      return false;
    }
    return true;
  }

  private checkCollision(): boolean {
    const currentPiece = this.pieceManager.getCurrentPiece();
    if (!currentPiece) return false;

    const blocks = this.pieceManager.getCurrentPieceBlocks();
    
    for (const position of blocks) {
      const gridX = Math.round(position.x + this.gridSize/2);
      const gridY = Math.round(position.y);
      const gridZ = Math.round(position.z + this.gridSize/2);

      // Check boundaries
      if (!this.grid.isValidPosition(gridX, gridY, gridZ)) {
        return true;
      }

      // Check collision with placed pieces
      if (this.grid.getCell(gridX, gridY, gridZ)) {
        return true;
      }
    }

    return false;
  }

  public spawnPiece(piece: PieceDefinition) {
    return this.pieceManager.spawnPiece(piece);
  }
}
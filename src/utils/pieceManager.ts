import * as THREE from 'three';
import { PieceDefinition, createPieceMesh } from './pieces';
import { Grid } from './grid';
import { isAdjacentToExistingPiece } from './placementRules';

export class PieceManager {
  private currentPiece: THREE.Group | null = null;
  private placedPieces: THREE.Group[] = [];
  private scene: THREE.Scene;
  private grid: Grid;

  constructor(scene: THREE.Scene, grid: Grid) {
    this.scene = scene;
    this.grid = grid;
    this.spawnInitialCenterPiece();
  }

  private spawnInitialCenterPiece() {
    const centerPiece: PieceDefinition = {
      blocks: [[0, 0, 0]],
      color: '#888888'
    };
    const piece = createPieceMesh(centerPiece);
    const gridSize = this.grid.getSize();
    // Place at exact center
    piece.position.set(0, 0, 0);
    this.scene.add(piece);
    this.placedPieces.push(piece);
    
    // Update grid with center piece
    const centerX = Math.floor(gridSize/2);
    const centerY = Math.floor(gridSize/2);
    const centerZ = Math.floor(gridSize/2);
    this.grid.setCell(centerX, centerY, centerZ, true);
  }

  public spawnPiece(piece: PieceDefinition) {
    if (this.currentPiece) {
      this.scene.remove(this.currentPiece);
    }
    const newPiece = createPieceMesh(piece);
    // Start piece outside the grid
    newPiece.position.set(0, this.grid.getSize() + 2, 0);
    this.scene.add(newPiece);
    this.currentPiece = newPiece;
    return newPiece;
  }

  public getCurrentPiece() {
    return this.currentPiece;
  }

  public getPlacedPieces() {
    return this.placedPieces;
  }

  public placePiece() {
    if (!this.currentPiece) return;
    this.placedPieces.push(this.currentPiece);
    this.updateGrid();
    this.currentPiece = null;
  }

  private updateGrid() {
    if (!this.currentPiece) return;
    const blocks = this.getCurrentPieceBlocks();
    const gridSize = this.grid.getSize();
    
    blocks.forEach(position => {
      const gridX = Math.round(position.x + gridSize/2);
      const gridY = Math.round(position.y);
      const gridZ = Math.round(position.z + gridSize/2);
      
      if (this.grid.isValidPosition(gridX, gridY, gridZ)) {
        this.grid.setCell(gridX, gridY, gridZ, true);
      }
    });
  }

  public getCurrentPieceBlocks(): THREE.Vector3[] {
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
}
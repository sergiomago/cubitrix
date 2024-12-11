import * as THREE from 'three';
import { PieceDefinition } from './pieces';

export class GameEngine {
  private scene: THREE.Scene;
  private currentPiece: THREE.Group | null = null;
  private placedPieces: THREE.Group[] = [];
  private gridSize = 5;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public spawnPiece(piece: PieceDefinition) {
    if (this.currentPiece) {
      this.scene.remove(this.currentPiece);
    }
    const newPiece = this.createPieceMesh(piece);
    newPiece.position.set(0, 5, 0);
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
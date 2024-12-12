import * as THREE from 'three';

export const isAdjacentToExistingPiece = (
  position: THREE.Vector3,
  placedPieces: THREE.Group[],
  gridSize: number
): boolean => {
  // Convert world position to grid position
  const gridX = Math.round(position.x + gridSize/2);
  const gridY = Math.round(position.y);
  const gridZ = Math.round(position.z + gridSize/2);

  // Check all six adjacent positions
  const adjacentPositions = [
    [gridX + 1, gridY, gridZ],
    [gridX - 1, gridY, gridZ],
    [gridX, gridY + 1, gridZ],
    [gridX, gridY - 1, gridZ],
    [gridX, gridY, gridZ + 1],
    [gridX, gridY, gridZ - 1],
  ];

  // Check if any placed piece occupies an adjacent position
  for (const piece of placedPieces) {
    const piecePositions: THREE.Vector3[] = [];
    piece.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);
        piecePositions.push(worldPosition);
      }
    });

    for (const piecePos of piecePositions) {
      const pGridX = Math.round(piecePos.x + gridSize/2);
      const pGridY = Math.round(piecePos.y);
      const pGridZ = Math.round(piecePos.z + gridSize/2);

      for (const [adjX, adjY, adjZ] of adjacentPositions) {
        if (pGridX === adjX && pGridY === adjY && pGridZ === adjZ) {
          return true;
        }
      }
    }
  }

  return false;
};
import * as THREE from 'three';

export type PieceDefinition = {
  blocks: [number, number, number][];
  color: string;
};

// Define basic 3D pieces (similar to Tetris but in 3D)
export const PIECES: PieceDefinition[] = [
  // Single cube
  {
    blocks: [[0, 0, 0]],
    color: '#9b87f5',
  },
  // Line of 2 cubes
  {
    blocks: [[0, 0, 0], [1, 0, 0]],
    color: '#F97316',
  },
  // L shape
  {
    blocks: [[0, 0, 0], [1, 0, 0], [1, 1, 0]],
    color: '#0EA5E9',
  },
  // T shape
  {
    blocks: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]],
    color: '#FEC6A1',
  },
];

export const createPieceMesh = (piece: PieceDefinition): THREE.Group => {
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
};

export const getRandomPiece = (): PieceDefinition => {
  return PIECES[Math.floor(Math.random() * PIECES.length)];
};
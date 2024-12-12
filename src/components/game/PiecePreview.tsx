import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { PieceDefinition } from '@/utils/pieces';

interface PiecePreviewProps {
  piece: PieceDefinition;
}

const PiecePreview = ({ piece }: PiecePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(80, 80);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight, directionalLight);

    // Position camera
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      if (!scene || !camera || !renderer) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update preview piece
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing pieces
    sceneRef.current.children = sceneRef.current.children.filter(
      child => child instanceof THREE.Light
    );

    // Create new piece preview
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshPhongMaterial({ 
      color: piece.color,
      transparent: true,
      opacity: 0.8,
    });

    piece.blocks.forEach(([x, y, z]) => {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, y, z);
      sceneRef.current?.add(cube);
    });
  }, [piece]);

  return (
    <div ref={containerRef} className="w-20 h-20 bg-black/30 rounded" />
  );
};

export default PiecePreview;
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';

const GameBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControlsImpl>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControlsImpl(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Grid cube setup
    const size = 5;
    const gridHelper = new THREE.Group();

    // Create grid lines
    for (let i = 0; i <= size; i++) {
      for (let j = 0; j <= size; j++) {
        // Vertical lines
        const verticalGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i - size/2, -size/2, j - size/2),
          new THREE.Vector3(i - size/2, size/2, j - size/2)
        ]);
        const verticalLine = new THREE.Line(
          verticalGeometry,
          new THREE.LineBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.5 })
        );
        gridHelper.add(verticalLine);

        // Horizontal lines
        const horizontalGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-size/2, i - size/2, j - size/2),
          new THREE.Vector3(size/2, i - size/2, j - size/2)
        ]);
        const horizontalLine = new THREE.Line(
          horizontalGeometry,
          new THREE.LineBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.5 })
        );
        gridHelper.add(horizontalLine);

        // Depth lines
        const depthGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i - size/2, j - size/2, -size/2),
          new THREE.Vector3(i - size/2, j - size/2, size/2)
        ]);
        const depthLine = new THREE.Line(
          depthGeometry,
          new THREE.LineBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.5 })
        );
        gridHelper.add(depthLine);
      }
    }
    scene.add(gridHelper);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="game-container" />;
};

export default GameBoard;
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = this.setupCamera();
    this.renderer = this.setupRenderer();
    this.controls = this.setupControls();
    this.setupLights();
    this.setupGrid();
    this.handleResize();
  }

  private setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    return camera;
  }

  private setupRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(renderer.domElement);
    return renderer;
  }

  private setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    return controls;
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  private setupGrid() {
    const size = 5;
    const gridHelper = new THREE.Group();

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
    this.scene.add(gridHelper);
  }

  public handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public animate(callback: () => void) {
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      callback();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  public getScene() {
    return this.scene;
  }

  public cleanup() {
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
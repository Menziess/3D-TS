import * as THREE from 'three';
import Camera from './Camera';
import Main from './Main';


export default class Scene extends THREE.Scene {

  private main: Main;
  private meshes: THREE.Mesh[];

  private defaultMaterial: THREE.MeshBasicMaterial;

  constructor(main: Main) {
    super();
    this.main = main;
    this.meshes = [];
    this.defaultMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 1, wireframe: true });
    this.addCamera(main.camera);
    this.initLight();
    this.initMeshes();
    this.initWater();
  }


  /**
   * Sets camera object in the scene
   * @param camera
   */
  addCamera(camera: Camera) {
    this.add(camera.controls.getCamera());
  }


  /**
   * Set lights in the scene
   */
  initLight() {
    let ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambient);

    const point = new THREE.PointLight(0xffffff, 0.5);
    point.position.set(-2000, 2000, 2000);
    this.add(point);
  }


  /**
   * Initializes meshes
   */
  initMeshes() {
    const geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, geometry.parameters.height / 2, -500);
    this.meshes['cube'] = mesh;
    this.main.renderer.applyShaders(mesh);
    this.add(mesh);

  }


  /**
   * Initializes terrain
   */
  initWater() {
    const geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40);

    let mesh = new THREE.Mesh(geometry, this.defaultMaterial);
    mesh.rotateX(- Math.PI / 2);
    this.meshes['water'] = mesh;
    this.add(mesh);

    this.main.renderer.applyShaders(mesh, () => {
      let height = new Float32Array(geometry.getAttribute('position').count);
      for (let i = 0; i < height.length; i++) {
        height[i] = Math.sin(i);
      }

      geometry.addAttribute('height', new THREE.BufferAttribute(height, 1));
    });
  }


  /**
   * Step
   * @param delta 
   */
  step(delta: number) {
    delta = delta / 1000;

    // Water
    if (this.meshes['water'].material['uniforms']) {
      this.meshes['water'].material.uniforms.delta.value += delta;
      // this.meshes['water'].geometry.attributes.height.needsUpdate = true;
    }

    // CUBE
    this.meshes['cube'].rotation.x += delta;
    this.meshes['cube'].rotation.y += delta;
    this.meshes['cube'].rotation.z += delta;

  }
}


import * as THREE from 'three';
import Camera from './Camera';

export default class Scene extends THREE.Scene {

  private meshes: THREE.Mesh[];

  private genericMaterial: THREE.MeshLambertMaterial;
  private wireMaterial: THREE.MeshBasicMaterial;

  private vertexDisplacement;

  constructor(camera: Camera) {
    super();
    this.meshes = [];
    this.genericMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    this.wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 1, wireframe: true });
    this.setCamera(camera);
    this.initLight();
    this.initMeshes();
    this.initTerrain();
  }


  /**
   * Sets camera object in the scene
   * @param camera
   */
  setCamera(camera: Camera) {
    this.add(camera.getYawObject());
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
    let mesh = new THREE.Mesh(geometry, this.genericMaterial);
    mesh.position.set(0, geometry.parameters.height / 2, -500);
    this.meshes['cube'] = mesh;
    this.add(mesh);
  }


  /**
   * Initializes terrain
   */
  initTerrain() {
    let geometry = new THREE.PlaneBufferGeometry(1000, 1000, 50, 50);

    const vs = <HTMLElement>document.getElementById('vertexShader');
    const fs = <HTMLElement>document.getElementById('fragmentShader');
    const material = new THREE.ShaderMaterial({
      uniforms: {
        delta: { value: 0 }
      },
      vertexShader: vs.textContent!,
      fragmentShader: fs.textContent!,
    });

    let vertexDisplacement = new Float32Array(geometry.getAttribute('position').count);
    for (let i = 0; i < vertexDisplacement.length; i++) {
      vertexDisplacement[i] = Math.sin(i);
    }

    geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));
    this.vertexDisplacement = vertexDisplacement;

    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(- Math.PI / 2);
    this.add(mesh);
    this.meshes['ground'] = mesh;
  }


  /**
   * Step
   * @param delta 
   */
  step(delta: number) {

    // GROUND
    this.meshes['ground'].material.uniforms.delta.value = 0.5 + Math.sin(delta) * 0.6;

    // for(let i = 0; i < this.ground.vertices.length; i+= 2) {
    //   this.ground.vertices[i].x += delta * 4;
    // }
    // this.ground.verticesNeedUpdate = true;

    for (var i = 0; i < this.vertexDisplacement.length; i++) {
      this.vertexDisplacement[i] = 0.5 + Math.sin(i * delta) * 0.25;
    }

    this.meshes['ground'].geometry.attributes.vertexDisplacement.needsUpdate = true;

    // CUBE
    delta = delta / 1000;
    this.meshes['cube'].rotation.x += delta;
    this.meshes['cube'].rotation.y += delta;
    this.meshes['cube'].rotation.z += delta;

  }
}


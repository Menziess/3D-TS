import * as THREE from 'three';
import Camera from './Camera';
import Main from './Main';


export default class Scene extends THREE.Scene {

  private main: Main;
  private meshes: THREE.Mesh[];

  private defaultMaterial: THREE.MeshBasicMaterial;

  private vertexDisplacement;

  constructor(main: Main) {
    super();
    this.main = main;
    this.meshes = [];
    this.defaultMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 1, wireframe: true });
    this.setCamera(main.camera);
    this.initLight();
    this.initMeshes();
    this.initTerrain();
  }


  /**
   * Sets camera object in the scene
   * @param camera
   */
  setCamera(camera: Camera) {
    this.add(camera.controls.getYawObject());
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

    let vs = document.getElementById('vs')!;
    let fs = document.getElementById('fs')!;
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
    this.add(mesh);
  }


  /**
   * Initializes terrain
   */
  initTerrain() {
    const geometry = new THREE.PlaneBufferGeometry(1000, 1000, 50, 50);

    // let vertexDisplacement = new Float32Array(geometry.getAttribute('position').count);
    // for (let i = 0; i < vertexDisplacement.length; i++) {
    //   vertexDisplacement[i] = Math.sin(i);
    // }

    // geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));
    // this.vertexDisplacement = vertexDisplacement;

    let mesh = new THREE.Mesh(geometry, this.defaultMaterial);
    mesh.rotateX(- Math.PI / 2);
    this.add(mesh);
    this.meshes['ground'] = mesh;

    this.main.renderer.applyShaders(mesh);
  }


  /**
   * Step
   * @param delta 
   */
  step(delta: number) {

    // GROUND
    // this.meshes['ground'].material.uniforms.delta.value = 0.5 + Math.sin(delta) * 0.6;

    // for(let i = 0; i < this.ground.vertices.length; i+= 2) {
    //   this.ground.vertices[i].x += delta * 4;
    // }
    // this.ground.verticesNeedUpdate = true;

    // for (var i = 0; i < this.vertexDisplacement.length; i++) {
    //   this.vertexDisplacement[i] = 0.5 + Math.sin(i * delta) * 0.25;
    // }

    // this.meshes['ground'].geometry.attributes.vertexDisplacement.needsUpdate = true;

    // CUBE
    delta = delta / 1000;
    this.meshes['cube'].rotation.x += delta;
    this.meshes['cube'].rotation.y += delta;
    this.meshes['cube'].rotation.z += delta;

  }
}


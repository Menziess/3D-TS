import * as THREE from 'three';

export default class Scene extends THREE.Scene {

  private meshes: THREE.Mesh[];

  private genericMaterial: THREE.MeshLambertMaterial;

  constructor() {
    super();
    this.meshes = [];
    this.genericMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    this.initLight();
    this.initMeshes();
    this.initGround();
  }

  initLight() {
    let ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambient);

    let point = new THREE.PointLight(0xffffff, 0.5);
    point.position.set(-2000, 2000, 2000);
    this.add(point);
  }

  initMeshes() {
    let geometry = new THREE.BoxGeometry(100, 100, 100);
    let material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -1000);
    this.meshes.push(mesh);
    this.add(mesh);
  }

  initGround() {
    let gridGeometry = new THREE.PlaneBufferGeometry(1, 1, 256, 256);
    let mesh = new THREE.Mesh(gridGeometry, this.genericMaterial);
    this.meshes.push(mesh);
    this.add(mesh);
  }

  step(delta: number) {
    this.meshes[0].rotation.x += delta;
    this.meshes[0].rotation.y += delta;
  }
}


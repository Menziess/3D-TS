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
    mesh.position.set(0, 0, 300);
    this.meshes.push(mesh);
    this.add(mesh);
  }

  initGround() {
    let grid = new THREE.GridHelper(200, 10);
    this.add(grid);
  }

  step(delta: number) {
    delta = delta / 1000;
    // this.meshes[0].rotation.x += delta;
    this.meshes[0].rotation.y += delta;
    // this.meshes[0].rotation.z += delta;
    this.meshes[0].translateX(5);
    // this.meshes[0].translateY(-5);
    // this.meshes[0].translateZ(5);
  }
}


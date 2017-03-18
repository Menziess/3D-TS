import * as THREE from 'three';
import Camera from './Camera';

export default class Scene extends THREE.Scene {

  private meshes: THREE.Mesh[];

  private genericMaterial: THREE.MeshLambertMaterial;

  constructor(camera: Camera) {
    super();
    this.meshes = [];
    this.genericMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    this.setCamera(camera);
    this.initLight();
    this.initMeshes();
    this.initGround();
  }

  setCamera(camera: Camera) {
    this.add(camera.getYawObject());
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
    mesh.position.set(500, 0, 0);
    this.meshes.push(mesh);
    this.add(mesh);
  }

  initGround() {
    let grid = new THREE.GridHelper(200, 10);
    let matrix = new THREE.Matrix4();
    matrix.set( 11, 12, 13, 14,
       21, 22, 23, 24,
       31, 32, 33, 34,
       41, 42, 43, 44);
    grid.applyMatrix(matrix);
    this.add(grid);
  }

  step(delta: number) {
    delta = delta / 1000;
    this.meshes[0].rotation.x += delta;
    this.meshes[0].rotation.y += delta;
    this.meshes[0].rotation.z += delta;
    // this.meshes[0].translateX(1);
    // this.meshes[0].translateY(1);
    // this.meshes[0].translateZ(1);
  }
}


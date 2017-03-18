import * as THREE from 'three';
import Camera from './Camera';

export default class Scene extends THREE.Scene {

  private meshes: THREE.Mesh[];
  private ground: THREE.PlaneGeometry;

  private genericMaterial: THREE.MeshLambertMaterial;
  private wireMaterial: THREE.MeshBasicMaterial;

  constructor(camera: Camera) {
    super();
    this.meshes = [];
    this.genericMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    this.wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 1, wireframe: true });
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

    const point = new THREE.PointLight(0xffffff, 0.5);
    point.position.set(-2000, 2000, 2000);
    this.add(point);
  }

  initMeshes() {
    const geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, geometry.parameters.height / 2, -500);
    this.meshes['cube'] = mesh;
    this.add(mesh);
  }

  initGround() {
    let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    this.ground = geometry;

    let mesh = new THREE.Mesh(geometry, this.wireMaterial);
    mesh.rotateX(- Math.PI / 2);
    this.add(mesh); 
  }

  step(delta: number) {
    delta = delta / 1000;
    this.meshes['cube'].rotation.x += delta;
    this.meshes['cube'].rotation.y += delta;
    this.meshes['cube'].rotation.z += delta;

    for(let i = 0; i < this.ground.vertices.length; i+= 2) {
      this.ground.vertices[i].x += delta;
    }
    this.ground.verticesNeedUpdate = true;
  }
}


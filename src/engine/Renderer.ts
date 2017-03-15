import * as THREE from 'three';

export default class Renderer extends THREE.WebGLRenderer {

  constructor(parameters?: THREE.WebGLRendererParameters) {
    super(parameters);
    this.init();
  }

  private init() {
    this.setClearColor(0xffffff);
    this.setPixelRatio(window.devicePixelRatio);
    this.setSize(window.innerWidth, window.innerHeight);
  }
}
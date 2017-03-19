import * as THREE from 'three';
import Shaders from './utils/Shaders';
import Main from './Main';


export default class Renderer extends THREE.WebGLRenderer {

  private enableShaders: boolean;
  private shaders: Shaders;
  private main: Main;

  constructor(main: Main, parameters?: THREE.WebGLRendererParameters) {
    super(parameters);
    this.enableShaders = true;
    this.main = main;
    this.initRenderer();
    this.initShaders();
  }


  /**
   * Initializes renderer
   */
  private initRenderer() {
    this.setClearColor(0xffffff);
    this.setPixelRatio(window.devicePixelRatio);
    this.setSize(window.innerWidth, window.innerHeight);
  }


  /**
   * Initializes shader manager
   */
  private initShaders() {
    if (!this.enableShaders) return;
    this.shaders = new Shaders();
  }


  /**
   * Apply shaders to mesh
   * @param mesh
   */
  public applyShaders(mesh: THREE.Mesh, callback) {
    if (!this.enableShaders) return;

    let vertexShader;
    let fragmentShader;

    this.shaders.getShader('vertex').then((shader) => {

      vertexShader = shader;

    }).then(this.shaders.getShader('fragment').then((shader) => {

      fragmentShader = shader;

      mesh.material = new THREE.ShaderMaterial({
        uniforms: {
          delta: { value: 0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      callback();
    }));
  }
}
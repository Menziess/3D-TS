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
   * Generator getting shaders
   * @param mesh
   * @param callback
   */
  public * shadersGenerator(shaders: string[]) {
    if (!this.enableShaders) return;
    let vertexShader = yield this.shaders.getShader(shaders[0]);
    return this.shaders.getShader(shaders[1]);
  }


  /**
   * Apply shaders to mesh
   * @param mesh 
   * @param callback 
   * @param args 
   */
  public applyShaders(mesh: THREE.Mesh, callback?) {

    const generator = this.shadersGenerator(['vertex', 'fragment']);

    let first = generator.next();
    let second = generator.next(first);
    
    Promise.all([first.value, second.value]).then((shaders) => {

      mesh.material = new THREE.ShaderMaterial({
        uniforms: {
          delta: { value: 0 }
        },
        vertexShader: shaders[0],
        fragmentShader: shaders[1],
      });

      if (callback) callback();
    });
  }
}
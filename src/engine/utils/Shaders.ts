import * as $ from 'jquery';


export default class Shaders {

  private vertexShaders;
  private fragmentShaders;
  private shadersLoaderCount;

  public vertexPromise;
  public fragmentPromise;

  public shadersHolder: Object;

  constructor() {
    this.vertexShaders = $('script[type="x-shader/x-vertex"]');
    this.fragmentShaders = $('script[type="x-shader/x-fragment"]');
    this.shadersLoaderCount = this.vertexShaders.length + this.fragmentShaders.length;
    this.init();
  }


  /**
   * Get shader by type
   * @param type
   */
  public getShader(type: string) {
    switch(type) {
      case 'vertex':
        return this.vertexPromise;
      case 'fragment':
        return this.fragmentPromise;
      default:
        return Error("Shader doesn't exist");
    }
  }


  /**
   * Initializes shaders
   */
  private init() {
    if (!this.shadersLoaderCount) return;
    this.shadersHolder = { vertex: '', fragment: '' };

    this.vertexPromise = this.loadShader('vertex');
    this.fragmentPromise = this.loadShader('fragment');
  }


  /**
   * Get shader
   * @param type 
   */
  private loadShader(shader: string) {
    return new Promise((resolve, reject) => {

      if (!this.shadersLoaderCount) reject(Error("No shader scripts found"));

      if (this.shadersHolder[shader]) {
        
        console.log('shader found: ' + shader);
        resolve(this.shadersHolder[shader]);

      } else {

        let loader;
        switch (shader) {
          case "vertex":
            loader = this.loader(this.vertexShaders[0], shader);
            break;
          case "fragment":
            loader = this.loader(this.fragmentShaders[0], shader);
            break;
          default:
            reject(Error("Shader type doesn't exist"));
        } 
        loader.done((data) => {
          resolve(data);
        });
        loader.fail((jqXHR, textStatus, error) => {
          reject(error);
        });
      }
    });
  }


  /**
   * Async shader loader
   */
  private loader(shader: HTMLElement, type: string) {

    const $shader = $(shader);

    return $.ajax({
      url: $shader.data('src'),
      dataType: 'text',
      context: {
        name: $shader.data('name'),
        type: type
      }
    });
  }

}

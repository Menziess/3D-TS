import * as THREE from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Scene from './Scene';
import Menu from './Menu';


export default class Main {

  private lastRender: number;
  private targetFps: number;
  private lastFps: number;
  private frames: number;

  public canvas: HTMLCanvasElement;
  public renderer: Renderer;
  public camera: Camera;
  public scene: Scene;
  public menu: Menu;
  public running: boolean;

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.renderer = new Renderer(this, { canvas: this.canvas, antialias: true });
    this.camera = new Camera(this, 55, 0.1, 10000, this.canvas);
    this.scene = new Scene(this);
    this.menu = new Menu(this);
    this.running = false;

    this.lastRender = Date.now();
    this.targetFps = 1000 / 60;
    this.lastFps = Date.now();
    this.frames = 0;

    this.init();
    this.draw();
  }


  /**
   * Pause loop when tab is inactive
   */
  public pause() {
    this.running = !this.running;
  }


  /**
   * Resize
   */
  public updateDimensions() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  }


  /**
   * Initialization
   */
  private init() {
    window.addEventListener("resize", this.updateDimensions.bind(this), false);
    this.updateDimensions();
  }


  /**
   * Loop
   */
  private draw() {

    // Check if tab is active
    if (document.hidden) {
      this.running = false;
    }

    // Calculate delta
    let now = Date.now(),
      delta = now - (this.lastRender || now);
    this.lastRender = now;
    requestAnimationFrame(() => {
      this.draw();
    });

    // Display fps and position
    if (now - this.lastFps > 999) {
      this.menu.elements['fpsMeter'].innerText = this.frames.toString();
      this.lastFps = now;
      this.frames = 0;
      let position = this.camera.controls.getYawObject().getWorldPosition();
      this.menu.elements['posDisplay'].innerText = Math.floor(position.x) + ", " + Math.floor(position.y) + ", " + Math.floor(position.z);
    }

    // When tab is inactive
    if (this.running) {
      this.camera.step(delta);
      this.scene.step(delta);
      this.render();
    } else if (this.camera.controls.hasUserInput()) {
      this.camera.step(delta);
      this.render();
    }
  }

  // Render frame
  private render = () => {
    this.renderer.render(this.scene, this.camera);
    this.frames++;
  }
}

new Main();
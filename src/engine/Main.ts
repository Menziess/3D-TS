import * as THREE from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Scene from './Scene';


/**
 * INSTANTIATIONS 
 */
const fpsMeter = <HTMLElement>document.getElementById('fps');

const canvas = <HTMLCanvasElement>document.getElementById('canvas');

const renderer = new Renderer({ canvas: canvas, antialias: true });

const camera = new Camera(70, 0.1, 10000, canvas);

const scene = new Scene();


/**
 * RESIZE MANAGEMENT
 */
const updateDimensions = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}


/**
 * INITIALIZATION
 */
const init = () => {
  window.addEventListener("resize", updateDimensions.bind(this));
  updateDimensions();
}


/**
 * GAME LOOP
 */
const loop = () => {

  let targetFps = 1000 / 60;
  let frames = 0;
  let lastRender = Date.now();
  let lastFps = Date.now();

  draw();

  function draw() {

    // Calculate delta
    let now = Date.now(),
      delta = now - (lastRender || now);

    // Display fps
    if (now - lastFps > 1000) {
      fpsMeter.innerText = frames.toString();
      lastFps = now;
      frames = 0;
    }

    // Render frame
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
    lastRender = now;
    frames++;

    scene.step(delta / 1000);
  }
}


/**
 * START
 */
init();
loop();
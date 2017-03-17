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

const camera = new Camera(55, 0.1, 10000, canvas);

const scene = new Scene(camera);

let running = true;


/**
 * RESIZE MANAGEMENT
 */
const updateDimensions = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}


/**
 * INITIALIZATION
 */
const init = () => {
  fpsMeter.addEventListener("click", pause.bind(this), false);
  window.addEventListener("resize", updateDimensions.bind(this), false);
  updateDimensions();
}


/**
 * Pause loop when tab is inactive
 */
const pause = () => {
  running = !running;
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

    // Check if tab is active
    if (document.hidden) {
      running = false;
    }

    // Calculate delta
    let now = Date.now(),
      delta = now - (lastRender || now);

    requestAnimationFrame(draw);
    lastRender = now;

    // Display fps
    if (now - lastFps > 999) {
      fpsMeter.innerText = frames.toString();
      lastFps = now;
      frames = 0;
    }

    // When tab is inactive
    if (running) {
      camera.step(delta);
      scene.step(delta);
      render();
    } else if (camera.controls.hasUserInput()) {
      camera.step(delta);
      render();
    }

    // Render frame
    function render() {
      renderer.render(scene, camera);
      frames++;
    }

  }
}


/**
 * START
 */
init();
loop();
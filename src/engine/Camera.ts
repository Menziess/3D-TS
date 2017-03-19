import * as THREE from 'three';
import Controls from './utils/Controls';
import Main from './Main';


export default class Camera extends THREE.PerspectiveCamera {

    private main: Main;
    public controls: Controls;

    constructor(main: Main, fov: number, near: number, far: number, canvas: HTMLCanvasElement) {
        let width = 800, height = 600;
        super(fov, width / height, near, far);
        this.main = main;
        this.controls = new Controls(this, canvas);
    }


    /**
     * Step
     * @param delta 
     */
    public step (delta: number) {
        this.controls.step(delta);
    }
}
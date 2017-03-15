import * as THREE from 'three';
import Controls from './Controls';

export default class Camera extends THREE.PerspectiveCamera {

    private controls: Controls;

    constructor(fov: number, near: number, far: number, canvas: HTMLCanvasElement) {
        let width = 800;
        let height = 600;
        super(fov, width / height, near, far);
        this.position.set(0, 20, 0);
        this.controls = new Controls(this, canvas);
    }

    public step(delta: number) {
        this.controls.step(delta);
    }
}
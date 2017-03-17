import * as THREE from 'three';
import Controls from './Controls';

export default class Camera extends THREE.PerspectiveCamera {

    public controls: Controls;

    constructor(fov: number, near: number, far: number, canvas: HTMLCanvasElement) {
        let width = 800;
        let height = 600;
        super(fov, width / height, near, far);
        this.controls = new Controls(this, canvas);
    }

    public getYawObject() {
        return this.controls.getYawObject();
    }

    public step(delta: number) {
        this.controls.step(delta);
    }
}
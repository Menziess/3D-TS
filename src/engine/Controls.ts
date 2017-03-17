import * as THREE from 'three';

export default class FirstPersonControls {

  private camera: THREE.Camera;
  private canvas: HTMLCanvasElement;

  private enabled = true;

  private movementSpeed = 0.08;
  private movementSpeedFast = 3 * this.movementSpeed;
  private movementSpeedSlow = this.movementSpeed;

  private movementX = 0;
  private movementY = 0;

  private activeLook = false;
  private pitchObject: THREE.Object3D;
  private yawObject: THREE.Object3D;
  private PI_2 = Math.PI / 2;

  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private moveUp = false;
  private moveDown = false;


  constructor(camera: THREE.Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    this.movementSpeed = this.movementSpeedFast;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.init();
  }


  /**
   * Get camera's yawobject
   */
  public getYawObject() {
    return this.yawObject;
  }


  /**
   * User is moving camera
   */
  public hasUserInput() {
    return this.activeLook
      || this.moveForward
      || this.moveBackward
      || this.moveLeft
      || this.moveRight
      || this.moveUp
      || this.moveDown;
  }


  /**
   * Initialization
   */
  private init() {
    this.canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
    this.canvas.addEventListener('mousemove', this.bind(this, this.onMouseMove), false);
    this.canvas.addEventListener('mousedown', this.bind(this, this.onMouseDown), false);
    this.canvas.addEventListener('mouseup', this.bind(this, this.onMouseUp), false);
    document.addEventListener('pointerlockchange', this.bind(this, this.lockChange), false);
    window.addEventListener('keydown', this.bind(this, this.onKeyDown), false);
    window.addEventListener('keyup', this.bind(this, this.onKeyUp), false);

    this.yawObject.add(this.pitchObject);
    this.pitchObject.add(this.camera);
  }


  /**
   * Lock change event
   */
  private lockChange() {
    if (document.pointerLockElement) {

    } else {
      this.activeLook = false;
    }
  }


  /**
   * Mousedown event
   */
  private onMouseDown(event) {
    if (!document.pointerLockElement && event.which === 3) {
      this.canvas.requestPointerLock();
    }
    document.body.style.cursor = "pointer";
    this.activeLook = true;
  };


  /**
   * Mouseup event
   */
  private onMouseUp(event) {
    if (!document.pointerLockElement)
      this.activeLook = false;
    document.body.style.cursor = "default";
  };


  /**
   * Mousemove event
   */
  private onMouseMove(event) {
    if (!this.enabled || !this.activeLook) return;

    this.movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    this.movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.yawObject.rotation.y -= this.movementX * 0.002;
    this.pitchObject.rotation.x -= this.movementY * 0.002;

    this.pitchObject.rotation.x = Math.max(- this.PI_2, Math.min(this.PI_2, this.pitchObject.rotation.x));
  };


  /**
   * Step
   * @param delta 
   */
  public step(delta: number) {

    if (!this.enabled) return;

    // MOVEMENT
    let actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward) this.yawObject.translateZ(- actualMoveSpeed);
    if (this.moveBackward) this.yawObject.translateZ(actualMoveSpeed);
    if (this.moveLeft) this.yawObject.translateX(- actualMoveSpeed);
    if (this.moveRight) this.yawObject.translateX(actualMoveSpeed);
    if (this.moveUp) this.yawObject.translateY(actualMoveSpeed / 2);
    if (this.moveDown) this.yawObject.translateY(- actualMoveSpeed / 2);

    // DIRECTION   
    if (this.activeLook) {

      let direction = new THREE.Vector3(0, 0, - 1);
      let rotation = new THREE.Euler(0, 0, 0, "YXZ");

      return function (v) {

        rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);

        v.copy(direction).applyEuler(rotation);

        return v;

      };
    }
  }


  /**
   * Keydown event
   */
  private onKeyDown(event) {
    switch (event.keyCode) {
      case 16: /*shift*/  this.movementSpeed = this.movementSpeedSlow; break;
      case 87: /*W*/      this.moveForward = true; break;
      case 65: /*A*/      this.moveLeft = true; break;
      case 83: /*S*/      this.moveBackward = true; break;
      case 68: /*D*/      this.moveRight = true; break;
      case 32: /*space*/  this.moveUp = true; break;
      case 70: /*X*/      this.moveDown = true; break;
    }
  };


  /**
   * Keyup event
   */
  private onKeyUp(event) {
    switch (event.keyCode) {
      case 16: /*shift*/  this.movementSpeed = this.movementSpeedFast; break;
      case 87: /*W*/      this.moveForward = false; break;
      case 65: /*A*/      this.moveLeft = false; break;
      case 83: /*S*/      this.moveBackward = false; break;
      case 68: /*D*/      this.moveRight = false; break;
      case 32: /*space*/  this.moveUp = false; break;
      case 70: /*X*/      this.moveDown = false; break;
    }
  };


  /**
   * Bind function
   * @param scope 
   * @param fn 
   */
  private bind(scope, fn) {
    return function () {
      fn.apply(scope, arguments);
    };
  };
};
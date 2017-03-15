import * as THREE from 'three';

export default class FirstPersonControls {

  private camera: THREE.Camera;
  private canvas: HTMLCanvasElement;

  private target = new THREE.Vector3(0, 0, -1000);

  private enabled = true;

  private movementSpeed = 1.0;
  private lookSpeed = 0.005;

  private lookVertical = true;
  private autoForward = false;

  private activeLook = false;

  private heightSpeed = false;
  private heightCoef = 1.0;
  private heightMin = 0.0;
  private heightMax = 1.0;

  private constrainVertical = false;
  private verticalMin = 0;
  private verticalMax = Math.PI;

  private autoSpeedFactor = 0.0;

  private mouseX = 0;
  private mouseY = 0;

  private lat = 0;
  private lon = 0;
  private phi = 0;
  private theta = 0;

  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;

  private viewStartX = 0;
  private viewStartY = 0;

  constructor(camera: THREE.Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    this.init();
  }


  /**
   * Initialization
   */
  private init = function() {
    if (this.canvas !== document) this.canvas.setAttribute('tabindex', -1);
    this.canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
    this.canvas.addEventListener('mousemove', this.bind(this, this.onMouseMove), false);
    this.canvas.addEventListener('mousedown', this.bind(this, this.onMouseDown), false);
    this.canvas.addEventListener('mouseup', this.bind(this, this.onMouseUp), false);
    window.addEventListener('keydown', this.bind(this, this.onKeyDown), false);
    window.addEventListener('keyup', this.bind(this, this.onKeyUp), false);
  }


  /**
   * Mousedown event
   */
  private onMouseDown = function (event) {
    if (this.canvas !== document) this.canvas.focus();
    this.viewStartX = event.pageX;
    this.viewStartY = event.pageY;
    this.activeLook = true;
  };


  /**
   * Mouseup event
   */
  private onMouseUp = function (event) {
    this.activeLook = false;
  };


  /**
   * Mousemove event
   */
  private onMouseMove = function (event) {
    if (this.activeLook) {
      this.mouseX = event.pageX - this.viewStartX;
      this.mouseY = event.pageY - this.viewStartY;
    }
  };


  /**
   * Step
   */
  public step = function (delta) {
    if (this.enabled === false) return;
    if (this.heightSpeed) {
      let y = THREE.Math.clamp(this.camera.position.y, this.heightMin, this.heightMax);
      let heightDelta = y - this.heightMin;
      this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    } else {
      this.autoSpeedFactor = 0.0;
    }

    let actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward || (this.autoForward && !this.moveBackward)) this.camera.translateZ(- (actualMoveSpeed + this.autoSpeedFactor));
    if (this.moveBackward) this.camera.translateZ(actualMoveSpeed);
    if (this.moveLeft) this.camera.translateX(- actualMoveSpeed);
    if (this.moveRight) this.camera.translateX(actualMoveSpeed);
    if (this.moveUp) this.camera.translateY(actualMoveSpeed);
    if (this.moveDown) this.camera.translateY(- actualMoveSpeed);

    let actualLookSpeed = delta * this.lookSpeed;

    if (!this.activeLook) {
      actualLookSpeed = 0;
    }

    let verticalLookRatio = 1;

    if (this.constrainVertical) {
      verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    }

    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

    this.lat = Math.max(- 85, Math.min(85, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat);

    this.theta = THREE.Math.degToRad(this.lon);

    if (this.constrainVertical) {
      this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    }

    let targetPosition = this.target,
      position = this.camera.position;

    targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    targetPosition.y = position.y + 100 * Math.cos(this.phi);
    targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(targetPosition);
  };


  /**
   * Keydown event
   */
  private onKeyDown = function (event) {
    switch (event.keyCode) {
      case 16: /*shift*/ this.movementSpeed = 2.0; break;
      case 38: /*up*/
      case 87: /*W*/ this.moveForward = true; break;
      case 37: /*left*/
      case 65: /*A*/ this.moveLeft = true; break;
      case 40: /*down*/
      case 83: /*S*/ this.moveBackward = true; break;
      case 39: /*right*/
      case 68: /*D*/ this.moveRight = true; break;
      case 82: /*R*/ this.moveUp = true; break;
      case 70: /*F*/ this.moveDown = true; break;
    }
  };


  /**
   * Keyup event
   */
  private onKeyUp = function (event) {
    switch (event.keyCode) {
      case 16: /*shift*/ this.movementSpeed = 1.0; break;
      case 38: /*up*/
      case 87: /*W*/ this.moveForward = false; break;
      case 37: /*left*/
      case 65: /*A*/ this.moveLeft = false; break;
      case 40: /*down*/
      case 83: /*S*/ this.moveBackward = false; break;
      case 39: /*right*/
      case 68: /*D*/ this.moveRight = false; break;
      case 82: /*R*/ this.moveUp = false; break;
      case 70: /*F*/ this.moveDown = false; break;
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
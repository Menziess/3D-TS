import Main from './Main';

export default class Menu {

  private main: Main;
  public elements: HTMLElement[];

  constructor(main) {
    this.main = main;
    this.elements = [];
    this.init();
  }

  private init() {
    this.elements['selectSpawn'] = <HTMLElement>document.getElementById('selectSpawn');
    this.elements['pauseButton'] = <HTMLElement>document.getElementById('pauseButton');
    this.elements["posDisplay"] = <HTMLElement>document.getElementById('posDisplay');
    this.elements["fpsMeter"] = <HTMLElement>document.getElementById('fpsMeter');

    this.elements['pauseButton'].addEventListener("click", () => {
      this.elements['pauseButton'].blur();
      this.main.pause();
    }, false);

    this.elements['selectSpawn'].addEventListener("click", () => {
      this.elements['selectSpawn'].blur();
      this.main.camera.getYawObject().position.set(-328, 568, 800);
      this.main.renderer.render(this.main.scene, this.main.camera);
    }, false);
  }
}
import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { screen2world } from './utils';

export class FreeControl {
  enabled: boolean = true;
  private camera: PerspectiveCamera;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;
  }

  private onZoom = (ev: WheelEvent) => {
    const camera = this.camera;
    const delta = ev.deltaY;

    const pos = screen2world(new Vector2(ev.offsetX, ev.offsetY), camera);

    console.log(this.camera, pos);
  };

  update() {
    window.addEventListener('wheel', this.onZoom);
  }
}

import { Camera, Vector2, Vector3 } from 'three';

export function screen2world(screenPos: Vector2, camera: Camera): Vector3 {
  camera.updateMatrixWorld();
  const ndc = new Vector3(
    (screenPos.x / window.innerWidth) * 2 - 1,
    1 - (2 * screenPos.y) / window.innerHeight,
    -1
  );

  const pos = ndc
    .clone()
    .applyMatrix4(camera.projectionMatrixInverse)
    .clone()
    .applyMatrix4(camera.matrixWorld);

  return pos;
}

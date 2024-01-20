import { Camera, Vector2, Vector3 } from 'three'

/**
 *
 * @param screenPos
 * @param camera
 * @param depth ndc's depth
 * @returns
 */
export function screen2world(screenPos: Vector2, camera: Camera, depth: number = 1): Vector3 {
	camera.updateMatrixWorld()
	const ndc = new Vector3(
		(screenPos.x / window.innerWidth) * 2 - 1,
		1 - (2 * screenPos.y) / window.innerHeight,
		depth
	)

	const pos = ndc
		.clone()
		.applyMatrix4(camera.projectionMatrixInverse)
		.clone()
		.applyMatrix4(camera.matrixWorld)

	return pos
}

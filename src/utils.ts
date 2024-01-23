import { Camera, Object3D, PerspectiveCamera, Vector2, Vector3 } from 'three'

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


export function getBufferDepth(camera: PerspectiveCamera, object: Object3D){

	const cameraDir = new Vector3();
	camera.getWorldDirection(cameraDir);
	
	const d = new Vector3()
			.subVectors(camera.position, object.position)
			.projectOnVector(cameraDir)
			.length()
	const { near: n, far: f } = camera
	return (f + n - (2 * n * f) / d) / (f - n)
}
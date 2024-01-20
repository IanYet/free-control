import { Object3D, PerspectiveCamera, Vector2, Vector3 } from 'three'
import { screen2world } from './utils'

export class FocusControl {
	enabled: boolean = true
	enableZoom: boolean = true
	enableRotate: boolean = true
	enablePan: boolean = true

	zoomSpeed: number = 1
	rotateSpeed: number = 1
	panSpeed: number = 1

	private camera: PerspectiveCamera
	private focusObject: Object3D

	private canRotate: boolean = false
	private canPan: boolean = false

	constructor(camera: PerspectiveCamera, focusObject: Object3D) {
		this.camera = camera
		this.focusObject = focusObject

		window['camera'] = camera
		window['focusObject'] = focusObject
	}

	private onZoom = (ev: WheelEvent) => {
		if (!this.enabled || !this.enableZoom) return

		const camera = this.camera
		const delta = ev.deltaY

		const pos = screen2world(new Vector2(ev.offsetX, ev.offsetY), camera)

		const dir = new Vector3().subVectors(pos, camera.position).normalize()

		const zoomScalar = this.zoomSpeed * -0.01 * delta

		camera.position.add(dir.multiplyScalar(zoomScalar))
		// camera.lookAt()
	}

	private onRotate = (startX: number, startY: number, endX: number, endY: number) => {
		const { camera, focusObject } = this
		const cameraDir = new Vector3()
		camera.getWorldDirection(cameraDir)
		const d = new Vector3()
			.subVectors(camera.position, focusObject.position)
			.projectOnVector(cameraDir)
			.length()
		const { near: n, far: f } = camera

		const depth = (f + n - (2 * n * f) / d) / (f - n)

		const start = screen2world(new Vector2(startX, startY), camera, depth)
		const end = screen2world(new Vector2(endX, endY), camera, depth)

		const radius = camera.position.distanceTo(focusObject.position)

		const dir = new Vector3().subVectors(start, end)
		const tarPos = camera.position.clone().add(dir).normalize().multiplyScalar(radius)

		camera.position.copy(tarPos)
		camera.lookAt(focusObject.position)
	}

	private onPanning = (startX: number, startY: number, endX: number, endY: number) => {
		const { camera, focusObject } = this
		const cameraDir = new Vector3()
		camera.getWorldDirection(cameraDir)
		const d = new Vector3()
			.subVectors(camera.position, focusObject.position)
			.projectOnVector(cameraDir)
			.length()
		const { near: n, far: f } = camera

		const depth = (f + n - (2 * n * f) / d) / (f - n)

		const start = screen2world(new Vector2(startX, startY), camera, depth)
		const end = screen2world(new Vector2(endX, endY), camera, depth)

		const panningDir = new Vector3().subVectors(start, end)

		camera.position.add(panningDir.multiplyScalar(this.panSpeed))
	}

	private onMove = (ev: MouseEvent) => {
		if (!this.enabled) return

		if (this.enablePan && this.canPan) {
			this.onPanning(
				ev.offsetX,
				ev.offsetY,
				ev.offsetX + ev.movementX,
				ev.offsetY + ev.movementY
			)
		} else if (this.enableRotate && this.canRotate) {
			this.onRotate(
				ev.offsetX,
				ev.offsetY,
				ev.offsetX + ev.movementX,
				ev.offsetY + ev.movementY
			)
		}
	}

	private onMouseDown = (ev: MouseEvent) => {
		if (ev.button === 0) this.canRotate = true
		else if (ev.button === 2) this.canPan = true
	}

	private onMouseUp = (ev: MouseEvent) => {
		this.canPan = false
		this.canRotate = false
	}

	private preventDefaultMenu = (ev: MouseEvent) => ev.preventDefault()

	update() {
		window.addEventListener('wheel', this.onZoom)
		window.addEventListener('mousedown', this.onMouseDown)
		window.addEventListener('mousemove', this.onMove)
		window.addEventListener('mouseup', this.onMouseUp)
		window.addEventListener('contextmenu', this.preventDefaultMenu)
	}

	dispose() {
		window.removeEventListener('wheel', this.onZoom)
		window.removeEventListener('mousedown', this.onMouseDown)
		window.removeEventListener('mousemove', this.onMove)
		window.removeEventListener('mouseup', this.onMouseUp)
		window.removeEventListener('contextmenu', this.preventDefaultMenu)
	}
}

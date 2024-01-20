import * as THREE from 'three'
import { FocusControl } from './FocusControl'

interface ThreeContext {
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	mesh: THREE.Object3D
}
const threeContext: Partial<ThreeContext> = {}

function init() {
	const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 200)
	camera.position.set(20, 20, 20)
	camera.lookAt(new THREE.Vector3(0, 0, 0))

	const scene = new THREE.Scene()

	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(),
		new THREE.MeshBasicMaterial({ color: 0xff0000 })
	)
	// mesh.position.set(-1,-1,-1)
	scene.add(mesh)

	const pointsGeo = new THREE.BufferGeometry()
	const vertices = new Float32Array(3000)

	for (let x = 0; x < 10; ++x) {
		for (let y = 0; y < 10; ++y) {
			for (let z = 0; z < 10; ++z) {
				const i = x * 100 + y * 10 + z
				vertices[i * 3] = x
				vertices[i * 3 + 1] = y
				vertices[i * 3 + 2] = z
			}
		}
	}
	pointsGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
	const pointsMat = new THREE.PointsMaterial({
		color: 0xffff00,
		size: 2,
		sizeAttenuation: false,
	})
	const points = new THREE.Points(pointsGeo, pointsMat)
	scene.add(points)

	const renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	// renderer.setClearColor(0xffffff);
	document.querySelector('#app')!.appendChild(renderer.domElement)

	const control = new FocusControl(camera, mesh)
	control.update()

	const axis = new THREE.AxesHelper(10)
	scene.add(axis)

	Object.assign(threeContext, { camera, scene, renderer, mesh })

	window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
	const { camera, renderer } = threeContext as ThreeContext
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
	requestAnimationFrame(animate)

	const { renderer, scene, camera } = threeContext as ThreeContext

	renderer.render(scene, camera)
}

init()
// initEvents();
animate()

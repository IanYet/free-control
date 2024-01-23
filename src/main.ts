import * as THREE from 'three'
import { FocusControl } from './FocusControl'

interface ThreeContext {
    camera: THREE.PerspectiveCamera
    camera0: THREE.PerspectiveCamera
    currentCamera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    mesh: THREE.Object3D
}
const threeContext: Partial<ThreeContext> = {}

function init() {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 50)
    camera.position.set(20, 20, 20)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    const camera0 = camera.clone()
    const cameraHelper = new THREE.CameraHelper(camera0)
    scene.add(camera0, cameraHelper)

    camera.far = 1000
    camera.position.set(50, 50, 50)
    camera.updateProjectionMatrix()

    const currentCamera = camera

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    mesh.position.set(5, 5, 5)
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

    const control = new FocusControl(camera0, mesh)
    control.update()

    const axis = new THREE.AxesHelper(10)
    scene.add(axis)

    Object.assign(threeContext, { camera, camera0, currentCamera, scene, renderer, mesh })

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('keyup', onToggleCamera)
}

function onWindowResize() {
    const { camera, renderer } = threeContext as ThreeContext
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

function onToggleCamera(ev: KeyboardEvent) {
    if (ev.key !== ' ') return

    threeContext.currentCamera === threeContext.camera0
        ? (threeContext.currentCamera = threeContext.camera)
        : (threeContext.currentCamera = threeContext.camera0)
}
function animate() {
    requestAnimationFrame(animate)

    const { renderer, scene, currentCamera } = threeContext as ThreeContext

    renderer.render(scene, currentCamera)
}

init()
// initEvents();
animate()

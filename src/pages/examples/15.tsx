import { FunctionComponent, useEffect } from 'react'
import * as dat from 'dat.gui'
import Head from 'next/head'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Example: FunctionComponent = () => {
  useEffect(() => {
    // Config
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement
    const sizes = { width: window.innerWidth, height: window.innerHeight }
    const aspectRatio = sizes.width / sizes.height
    const cursor = { x: 0, y: 0 }

    // Listeners
    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / sizes.width - 0.5
      cursor.y = -(e.clientY / sizes.height - 0.5)
    })
    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Scene
    const scene = new THREE.Scene()

    const textureLoader = new THREE.TextureLoader()
    const bakedShadow = textureLoader.load('/textures/shadows/simpleShadow.jpg')

    // Lights
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight('teal', 1)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 10
    directionalLight.shadow.radius = 2
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.position.set(3, 4, 2)
    scene.add(directionalLight)

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
    scene.add(directionalLightHelper)
    // const dirLightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(dirLightCamHelper)

    // const spotLight = new THREE.SpotLight('red', 1, 10, Math.PI * 0.3)
    // spotLight.castShadow = true
    // spotLight.position.set(0, 2, 2)
    // spotLight.shadow.camera.near = 1
    // spotLight.shadow.camera.far = 4
    // spotLight.shadow.camera.fov = 30
    // scene.add(spotLight, spotLight.target)
    // const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    // scene.add(spotLightCameraHelper)

    // const pointLight = new THREE.PointLight('white', 0.5)
    // scene.add(pointLight)
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
    // scene.add(pointLightHelper)

    // Material
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.4

    // Objects
    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material)
    plane.rotation.x = -Math.PI * 0.5
    plane.position.y = -0.65
    plane.receiveShadow = true

    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material)
    // sphere.position.x = -1.5
    sphere.castShadow = true

    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({ color: 'black', alphaMap: bakedShadow, transparent: true }),
    )
    sphereShadow.rotation.x = -Math.PI * 0.5
    sphereShadow.position.y = plane.position.y + 0.01
    scene.add(sphereShadow)

    scene.add(sphere, plane)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    camera.position.z = 4
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    // controls.autoRotate = true
    controls.enableDamping = true

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(sizes.width, sizes.height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Debug
    // const gui = new dat.GUI()
    // gui.add(material, 'roughness').min(0).max(1).step(0.01)
    // gui.add(material, 'metalness').min(0).max(1).step(0.01)
    // gui.add(controls, 'autoRotate')

    // Animation
    const clock = new THREE.Clock()
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      directionalLight.position.x = -Math.cos(elapsedTime) * 3
      // directionalLight.position.y = Math.cos(elapsedTime)
      directionalLight.position.z = -Math.cos(elapsedTime) * 3
      directionalLight.lookAt(new Vector3())
      sphere.position.x = Math.cos(elapsedTime) * 1.5
      sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
      sphere.position.z = Math.sin(elapsedTime) * 1.5
      sphereShadow.position.x = sphere.position.x
      sphereShadow.position.z = sphere.position.z
      sphereShadow.material.opacity = 1 - Math.abs(sphere.position.y)
      controls.update()
      renderer.render(scene, camera)
      req = window.requestAnimationFrame(tick)
    }
    tick()
    return () => {
      window.cancelAnimationFrame(req)
    }
  }, [])

  return (
    <div>
      <Head>
        <title>3JS Playground</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main id="main">
        <canvas className="webgl"></canvas>
      </main>
    </div>
  )
}

export default Example

import { FunctionComponent, useEffect } from 'react'
import * as dat from 'dat.gui'
import Head from 'next/head'
import * as THREE from 'three'
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

    // Lights
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight('teal', 0.5)
    directionalLight.position.set(3, 0.25, 0)
    scene.add(directionalLight)

    const hemisphereLight = new THREE.HemisphereLight('red', 'blue', 0.3)
    scene.add(hemisphereLight)

    const pointLight = new THREE.PointLight('yellow', 0.5, 2, 1)
    pointLight.position.set(1, 0.1, 1)
    scene.add(pointLight)

    const rectLight = new THREE.RectAreaLight('green', 1, 3, 4)
    rectLight.position.set(-1.0, 0, 1.5)
    rectLight.lookAt(new THREE.Vector3())
    scene.add(rectLight)

    const spotLight = new THREE.SpotLight('white', 0.5, 10, Math.PI * 0.05, 0.5, 1)
    spotLight.position.set(0, 2, 3)
    spotLight.target.position.x = -0.5
    scene.add(spotLight, spotLight.target)

    // Light helpers
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
    scene.add(directionalLightHelper)

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
    scene.add(pointLightHelper)

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
    scene.add(hemiLightHelper)

    const spotlightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
    scene.add(spotlightHelper)

    // Material
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.4

    // Objects
    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material)
    sphere.position.x = -1.5

    const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.75, 0.75, 0.75), material)

    const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64), material)
    torus.position.x = 1.5

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material)
    plane.rotation.x = -Math.PI * 0.5
    plane.position.y = -0.65

    scene.add(sphere, cube, torus, plane)

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Debug
    // const gui = new dat.GUI()
    // gui.add(material, 'roughness').min(0).max(1).step(0.01)
    // gui.add(material, 'metalness').min(0).max(1).step(0.01)
    // gui.add(controls, 'autoRotate')

    // Animation
    // const clock = new THREE.Clock()
    let req = 0
    const tick = () => {
      // const elapsedTime = clock.getElapsedTime()
      controls.update()
      spotlightHelper.update()
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

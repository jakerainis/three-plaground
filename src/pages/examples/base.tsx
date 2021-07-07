import { FunctionComponent, useEffect } from 'react'
import * as CANNON from 'cannon-es'
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
    const cursor = new THREE.Vector2()

    // Listeners
    window.addEventListener('mousemove', (e) => {
      cursor.x = (e.clientX / sizes.width) * 2 - 1
      cursor.y = -(e.clientY / sizes.height) * 2 + 1
    })

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      camera.aspect = aspectRatio
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Scene
    const scene = new THREE.Scene()

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
      }),
    )
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = -7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = -7
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(2, 2, 2)
    scene.add(camera)

    /**
     * Controls
     */
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    // controls.autoRotate = true
    controls.autoRotateSpeed = 0.1

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setClearColor('#262637')
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    /**
     * Debug
     */
    // const debug = { }
    // const gui = new dat.GUI()
    // gui.add(debug, 'createBox')
    // gui.add(debug, 'createSphere')
    // gui.add(debug, 'reset')

    // Animation
    const clock = new THREE.Clock()
    // let oldElapsedTime = 0
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      // const deltaTime = elapsedTime - oldElapsedTime
      // oldElapsedTime = elapsedTime
      // world.step(1 / 60, deltaTime, 3)

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

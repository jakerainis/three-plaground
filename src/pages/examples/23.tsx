import { FunctionComponent, useEffect } from 'react'
import * as dat from 'dat.gui'
import Head from 'next/head'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three-orbitcontrols-ts'

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

    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.envMapIntensity = debug.envMapIntensity
          child.material.needsUpdate = true
        }
      })
    }

    /**
     * Models
     */
    // const cubeTextureLoader = new THREE.CubeTextureLoader()
    // const envMap = cubeTextureLoader.load([
    //   '/textures/environmentMaps/1/px.jpg',
    //   '/textures/environmentMaps/1/nx.jpg',
    //   '/textures/environmentMaps/1/py.jpg',
    //   '/textures/environmentMaps/1/ny.jpg',
    //   '/textures/environmentMaps/1/pz.jpg',
    //   '/textures/environmentMaps/1/nz.jpg',
    // ])
    // envMap.encoding = THREE.sRGBEncoding
    // scene.background = envMap
    // scene.environment = envMap

    // // const dracoLoader = new DRACOLoader()
    // // dracoLoader.setDecoderPath('/draco/')
    // const gltfLoader = new GLTFLoader()
    // // gltfLoader.setDRACOLoader(dracoLoader)
    // // gltfLoader.load('/burger.gltf', (gltf) => {
    // gltfLoader.load('/models/FLightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    //   gltf.scene.scale.set(5, 5, 5)
    //   scene.add(gltf.scene)
    //   updateAllMaterials()
    // })

    /**
     * Sphere
     */
    // const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({}))
    // sphere.castShadow = true
    // sphere.position.y = 1
    // scene.add(sphere)

    /**
     * Floor
     */
    // const floor = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(10, 10),
    //   new THREE.MeshStandardMaterial({
    //     color: '#444444',
    //     metalness: 0,
    //     roughness: 0.5,
    //   }),
    // )
    // floor.receiveShadow = true
    // floor.rotation.x = -Math.PI * 0.5
    // scene.add(floor)

    /**
     * Lights
     */
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    // scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
    directionalLight.castShadow = true
    directionalLight.position.set(-2, 3, 1)
    directionalLight.shadow.camera.far = 5
    directionalLight.shadow.mapSize.set(1024, 1024)
    scene.add(directionalLight)

    // const lightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(lightHelper)

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(3, 5, 3)
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
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
    // renderer.setClearColor('#262637')
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.physicallyCorrectLights = true
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2

    /**
     * Debug
     */
    const debug = {
      envMapIntensity: 5,
    }
    const gui = new dat.GUI()
    // gui.add(debug, 'envMapIntensity').min(0).max(20).step(0.001).onFinishChange(updateAllMaterials)
    gui
      .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Cineon: THREE.CineonToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Aces: THREE.ACESFilmicToneMapping,
      })
      .onFinishChange(() => {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
      })
    // gui.add(debug, 'reset')

    // Animation
    const clock = new THREE.Clock()
    let oldElapsedTime = 0
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - oldElapsedTime
      oldElapsedTime = elapsedTime
      // world.step(1 / 60, deltaTime, 3)

      // mixer && mixer.update(deltaTime)

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

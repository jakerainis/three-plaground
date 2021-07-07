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
    const group = new THREE.Group()

    // Lights
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    const pointLight = new THREE.PointLight('white', 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(ambientLight, pointLight)

    // Material & Textures
    const loadingManager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const fontLoader = new THREE.FontLoader(loadingManager)
    const matcap = textureLoader.load('/textures/matcaps/8.png')
    fontLoader.load('/fonts/canterbury.json', (font) => {
      const textGeometry = new THREE.TextBufferGeometry('CASTL', {
        font,
        size: -0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 2,
      })
      textGeometry.center()
      const material = new THREE.MeshMatcapMaterial({ matcap })
      const textMaterial = material
      const text = new THREE.Mesh(textGeometry, textMaterial)
      text.rotation.z = Math.PI
      scene.add(text)

      const geo = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

      for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(geo, material)
        donut.position.x = (Math.random() - 0.5) * 5
        donut.position.y = (Math.random() - 0.5) * 5
        donut.position.z = (Math.random() - 0.5) * 5
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        scene.add(donut)
      }
    })
    scene.add(group)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    camera.position.z = 2
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

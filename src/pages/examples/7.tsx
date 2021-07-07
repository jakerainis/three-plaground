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

    // Textures
    const loadingManager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const colorTexture = textureLoader.load('/textures/door/color.jpg')
    // Transformation
    colorTexture.rotation = Math.PI * 0.25
    colorTexture.center.x = 0.5
    colorTexture.center.y = 0.5
    colorTexture.generateMipmaps = false
    colorTexture.minFilter = THREE.NearestFilter
    colorTexture.magFilter = THREE.NearestFilter
    // colorTexture.repeat.x = 1
    // colorTexture.repeat.y = 1
    // colorTexture.wrapS = THREE.RepeatWrapping
    // colorTexture.wrapT = THREE.RepeatWrapping
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping
    // colorTexture.wrapT = THREE.MirroredRepeatWrapping
    // colorTexture.offset.x = 0.5
    // colorTexture.offset.y = 0.5

    // const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    // const heightTexture = textureLoader.load('/textures/door/height.jpg')
    // const normalTexture = textureLoader.load('/textures/door/normal.jpg')
    // const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
    // const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
    // const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
    // loadingManager.onStart = () => console.log(1);
    // loadingManager.onLoad = () => console.log(1);
    // loadingManager.onProgress = (url, loaded, total) => console.log(url, loaded, total)
    // loadingManager.onError = () => console.log(1);

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

    const box = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2)

    const material = new THREE.MeshBasicMaterial({ map: colorTexture, wireframe: false })
    const mesh = new THREE.Mesh(box, material)
    group.add(mesh)
    scene.add(group)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    camera.position.z = 3
    camera.lookAt(mesh.position)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.autoRotate = true
    controls.enableDamping = true

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Debug
    // const gui = new dat.GUI()
    // gui
    //   .add( { method: () => { console.log(1) }, }, 'method', )
    //   .name('Method')
    // gui
    //   .addColor({ color: 0xff0000 }, 'color')
    //   .onChange((e) => {
    //     material.color.set(e)
    //   })
    //   .name('Cube Color')
    // gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Mesh X')
    // gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('Mesh Y')
    // gui.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('Mesh Z')
    // gui.add(material, 'wireframe').name('Mesh Wireframe')
    // gui.add(mesh, 'visible').name('Mesh Visibility')

    // Animation
    let req = 0
    const tick = () => {
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

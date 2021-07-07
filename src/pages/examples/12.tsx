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
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

    // const material = new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/door/color.jpg') })
    // const material = new THREE.MeshNormalMaterial()
    // const material = new THREE.MeshLambertMaterial() // Has banding
    // const material = new THREE.MeshPhongMaterial({shininess: 200, specular: 'blue'}) // No banding

    // Apply matcaps
    // const matCapTexture = textureLoader.load('/textures/matcaps/8.png')
    // const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture })

    // Cartoony (Disable midmapping for more cell shaded grades)
    // const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
    // gradientTexture.generateMipmaps = false // Set this when using NearestFilter
    // gradientTexture.minFilter = THREE.NearestFilter
    // gradientTexture.magFilter = THREE.NearestFilter
    // const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture })

    const material = new THREE.MeshStandardMaterial()
    material.opacity = 1
    material.metalness = 0.7
    material.roughness = 0.2
    material.side = THREE.DoubleSide
    material.transparent = true

    // Maps
    // material.alphaMap = textureLoader.load('/textures/door/alpha.jpg')
    material.aoMap = textureLoader.load('/textures/door/ambientOcclusion.jpg')
    material.displacementMap = textureLoader.load('/textures/door/height.jpg')
    material.displacementScale = 0.05
    material.envMap = cubeTextureLoader.load([
      '/textures/environmentMaps/0/px.jpg',
      '/textures/environmentMaps/0/nx.jpg',
      '/textures/environmentMaps/0/py.jpg',
      '/textures/environmentMaps/0/ny.jpg',
      '/textures/environmentMaps/0/pz.jpg',
      '/textures/environmentMaps/0/nz.jpg',
    ])
    material.map = textureLoader.load('/textures/door/color.jpg')
    material.metalnessMap = textureLoader.load('/textures/door/roughness.jpg')
    material.roughnessMap = textureLoader.load('/textures/door/metalness.jpg')
    material.normalMap = textureLoader.load('/textures/door/normal.jpg')

    // Shapes
    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), material)
    sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
    sphere.position.x = -1.5
    const plane = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1, 1), material)
    plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
    const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.5, -0.2, 64, 128), material)
    torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
    torus.position.x = 1.5
    group.add(sphere, plane, torus)
    scene.add(group)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    camera.position.z = 3
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
    // gui.add(material, 'roughness').min(0).max(1).step(0.01)
    // gui.add(material, 'metalness').min(0).max(1).step(0.01)
    // gui.add(controls, 'autoRotate')

    // Animation
    const clock = new THREE.Clock()
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      sphere.rotation.y = elapsedTime
      plane.rotation.y = elapsedTime
      torus.rotation.y = elapsedTime
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

import { FunctionComponent, useEffect } from 'react'
import * as dat from 'dat.gui'
import Head from 'next/head'
import * as THREE from 'three'
import { Material } from 'three'
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
      camera.aspect = aspectRatio
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Scene
    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader()

    // Meshes
    const params = {
      amplify: 3,
      branches: 10,
      colorInner: '#ff6030',
      colorOuter: '#1b3984',
      count: 200_000,
      radius: 1,
      randomness: 0.2,
      size: 0.01,
      spin: 2,
    }

    let geo: any = null
    let mat: any = null
    let points: any = null
    const generateGalaxy = () => {
      if (points) {
        geo.dispose()
        mat.dispose()
        scene.remove(points)
      }
      geo = new THREE.BufferGeometry()
      mat = new THREE.PointsMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        size: params.size,
        sizeAttenuation: true,
        vertexColors: true,
      })

      const positions = new Float32Array(params.count * 3)
      const colors = new Float32Array(params.count * 3)
      const colorInside = new THREE.Color(params.colorInner)
      const colorOuter = new THREE.Color(params.colorOuter)

      for (let i = 0; i < params.count; i++) {
        const i3 = i * 3
        const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2
        const radius = Math.random() * params.radius * 2
        const spinAngle = radius * params.spin
        const mixedColor = colorInside.clone()

        mixedColor.lerp(colorOuter, radius / params.radius)

        const randomX = Math.pow(Math.random(), params.amplify) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), params.amplify) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), params.amplify) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      points = new THREE.Points(geo, mat)
      scene.add(points)
    }
    generateGalaxy()

    const gui = new dat.GUI()
    gui.add(params, 'amplify').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
    gui.add(params, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
    gui.addColor(params, 'colorInner').onFinishChange(generateGalaxy)
    gui.addColor(params, 'colorOuter').onFinishChange(generateGalaxy)
    gui.add(params, 'count').min(100).max(1_000_000).step(100).onFinishChange(generateGalaxy)
    gui.add(params, 'radius').min(1).max(20).step(0.1).onFinishChange(generateGalaxy)
    gui.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
    gui.add(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
    gui.add(params, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    camera.position.z = 3
    camera.position.y = 3
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    // renderer.setClearColor('#262637')
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Animation
    const clock = new THREE.Clock()
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
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

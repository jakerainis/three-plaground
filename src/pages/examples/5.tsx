import { FunctionComponent, useEffect } from 'react'
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
    window.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) {
        canvas.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })
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

    // Mesh
    const geometry = new THREE.BufferGeometry()
    const count = 150
    const positions = new Float32Array(count * 3 * 3)
    for (let i = 0; i < count * 3 * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mesh = new THREE.Mesh(
      // new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2),
      geometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    )
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

    // Animation
    const tick = () => {
      // controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()
  })
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

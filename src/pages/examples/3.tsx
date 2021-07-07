import { FunctionComponent, useEffect } from 'react'
// import gsap from 'gsap'
import Head from 'next/head'
import * as THREE from 'three'

const Example: FunctionComponent = () => {
  useEffect(() => {
    // Sizes
    const sizes = {
      width: 800,
      height: 600,
    }

    // Cursor
    const cursor = { x: 0, y: 0 }
    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / sizes.width - 0.5
      cursor.y = -(e.clientY / sizes.height - 0.5)
    })
    console.log(cursor)

    // Scene
    const scene = new THREE.Scene()

    // Group of Cubes
    const group = new THREE.Group()
    const mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 50, 50), new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }))
    group.add(mesh)
    // group.position.set(0, 0, 0)
    scene.add(group)

    // Axes Helper
    const axesHelper = new THREE.AxesHelper()
    scene.add(axesHelper)

    // Camera
    const aspectRatio = sizes.width / sizes.height
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
    // camera.position.x = 2
    // camera.position.y = 2
    camera.position.z = 2
    camera.lookAt(mesh.position)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement })
    renderer.setSize(sizes.width, sizes.height)

    // Animation
    // const clock = new THREE.Clock()
    const tick = () => {
      // const elapsedTime = clock.getElapsedTime()

      // camera.position.x = cursor.x * 10
      camera.position.x = Math.sin(cursor.x * Math.PI * 2) * Math.PI
      camera.position.z = Math.cos(cursor.x * Math.PI * 2) * Math.PI
      camera.position.y = cursor.y * 5
      camera.lookAt(mesh.position)
      // mesh.rotation.y = (elapsedTime * Math.PI) / 2

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

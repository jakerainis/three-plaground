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

    // Scene
    const scene = new THREE.Scene()

    // Group of Cubes
    const group = new THREE.Group()

    const cube1 = new THREE.Mesh(new THREE.SphereGeometry(1, 5, 5), new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }))
    group.add(cube1)

    const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'green' }))
    cube2.position.x = 1.25
    group.add(cube2)

    const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'blue' }))
    cube3.position.x = -1.25
    group.add(cube3)

    group.position.set(1, 0, -1)
    scene.add(group)

    // Axes Helper
    const axesHelper = new THREE.AxesHelper()
    scene.add(axesHelper)

    // Camera
    const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height)
    camera.position.z = 3
    // camera.lookAt(cubeMesh.position)
    // camera.position.y = 1
    // camera.position.x = 1

    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement })
    renderer.setSize(sizes.width, sizes.height)

    // Animation
    // gsap.to(group.position, { duration: 1, delay: 1, x: 2 })
    const clock = new THREE.Clock()
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      group.position.x = Math.sin(elapsedTime)
      group.position.y = Math.cos(elapsedTime)

      cube1.rotation.x = elapsedTime * Math.PI
      cube1.rotation.y = elapsedTime * Math.PI
      cube2.rotation.y = Math.sin(-elapsedTime)
      cube3.rotation.y = Math.sin(elapsedTime)

      camera.lookAt(group.position)
      camera.position.z = Math.sin(elapsedTime) + 1
      camera.rotation.x = Math.sin(elapsedTime)

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

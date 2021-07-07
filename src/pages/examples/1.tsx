import { FunctionComponent, useEffect } from 'react'
import Head from 'next/head'
import * as THREE from 'three'

const Example: FunctionComponent = () => {
  useEffect(() => {
    // Canvas
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

    // Sizes
    const sizes = {
      width: 800,
      height: 600,
    }

    // Scene
    const scene = new THREE.Scene()

    // Object
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' })
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

    // Position
    // cubeMesh.position.x = 0.7
    // cubeMesh.position.y = -0.6
    // cubeMesh.position.z = -1
    cubeMesh.position.set(0.7, -0.6, 1)

    //Scale
    // cubeMesh.scale.x = 2
    // cubeMesh.scale.y = -0.5
    // cubeMesh.scale.z = -0.5
    cubeMesh.scale.set(2, 0.5, 0.5)

    // Rotation
    cubeMesh.rotation.reorder('YXZ')
    cubeMesh.rotation.x = Math.PI * 0.25
    cubeMesh.rotation.y = Math.PI * 0.25
    // cubeMesh.rotation.z = Math.PI * 0.25

    scene.add(cubeMesh)

    // Axes Helper
    const axesHelper = new THREE.AxesHelper()
    scene.add(axesHelper)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 3
    camera.lookAt(cubeMesh.position)
    // camera.position.y = 1
    // camera.position.x = 1

    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)
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

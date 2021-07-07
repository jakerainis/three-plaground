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
    const textureLoader = new THREE.TextureLoader()

    // Meshes
    const params = {}

    const geo = new THREE.SphereBufferGeometry(0.5, 20, 20)
    const sphere1 = new THREE.Mesh(geo, new THREE.MeshBasicMaterial())
    const sphere2 = new THREE.Mesh(geo, new THREE.MeshBasicMaterial())
    const sphere3 = new THREE.Mesh(geo, new THREE.MeshBasicMaterial())
    sphere1.position.x = -1.5
    sphere3.position.x = 1.5
    scene.add(sphere1, sphere2, sphere3)

    // Raycaster
    const raycaster = new THREE.Raycaster()
    const rayHelper = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.02, 0.02, 10, 10, 10), new THREE.MeshBasicMaterial())
    rayHelper.rotation.z = Math.PI * 0.5
    scene.add(rayHelper)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
    camera.position.z = 4
    camera.position.y = 3
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    // controls.autoRotate = true
    controls.autoRotateSpeed = 0.1

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setClearColor('#262637')
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Animation
    const clock = new THREE.Clock()
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
      sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
      sphere3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

      // Change on hover
      // raycaster.setFromCamera(cursor, camera)

      // Change on vector
      const rayOrigin = new THREE.Vector3(-3, 0, 0)
      const rayDirection = new THREE.Vector3(1, 0, 0)
      raycaster.set(rayOrigin, rayDirection)

      const objects = [sphere1, sphere2, sphere3]

      const intersects = raycaster.intersectObjects(objects)
      objects.forEach((obj) => obj.material.color.set('white'))
      intersects.forEach(({ object }) => object.material.color.set('red')) /* tslint:disable-line */

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

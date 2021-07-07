import { FunctionComponent, useEffect } from 'react'
import * as CANNON from 'cannon-es'
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
    window.addEventListener('mousedown', (e) => {
      debug.createBox()
      debug.createSphere()
      // hitSound.play()
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
    const hitSound = new Audio('/sounds/hit.mp3')
    const playHitSounds = (collision: any) => {
      const impact = collision.contact.getImpactVelocityAlongNormal()
      if (impact > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
      }
    }
    const textureLoader = new THREE.TextureLoader()
    // const danzig = textureLoader.load('/danzig.png')
    // danzig.wrapS = THREE.RepeatWrapping
    // danzig.wrapT = THREE.RepeatWrapping
    // danzig.repeat.set(1, 1)

    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const environmentMapTexture = cubeTextureLoader.load([
      '/textures/environmentMaps2/0/px.png',
      '/textures/environmentMaps2/0/nx.png',
      '/textures/environmentMaps2/0/py.png',
      '/textures/environmentMaps2/0/ny.png',
      '/textures/environmentMaps2/0/pz.png',
      '/textures/environmentMaps2/0/nz.png',
    ])

    /**
     * Physics
     */
    //World
    const world = new CANNON.World()
    world.gravity.set(0, -9.82, 0)
    world.broadphase = new CANNON.SAPBroadphase(world)
    world.allowSleep = true

    //Materials
    const concrete = new CANNON.Material('concrete')
    const plastic = new CANNON.Material('plastic')

    const concretePlasticContact = new CANNON.ContactMaterial(concrete, plastic, {
      friction: 0.2,
      restitution: 0.8,
    })
    world.addContactMaterial(concretePlasticContact)
    // world.defaultContactMaterial(concretePlasticContact) // Apply to all

    /**
     * Floor Body
     */
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
      mass: 0,
      shape: floorShape,
      material: concrete,
    })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
    world.addBody(floorBody)

    /**
     * Floor Mesh
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: '#777777', metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture }),
    )
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI * 0.5
    scene.add(floor)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = -7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = -7
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(-3, 3, 3)
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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Utils
    const objectsToUpdate: any[] = []
    const geoBox = new THREE.BoxBufferGeometry(1, 1, 1)
    const geoSphere = new THREE.SphereBufferGeometry(1, 20, 20)
    const mat = new THREE.MeshStandardMaterial({
      envMap: environmentMapTexture,
      metalness: 0.3,
      roughness: 0.4,
      // map: danzig,
    })

    const createBox = (w: number, h: number, d: number, position: any) => {
      const mesh = new THREE.Mesh(geoBox, mat)
      mesh.castShadow = true
      mesh.position.copy(position)
      mesh.scale.set(w, h, d)
      scene.add(mesh)

      const shape = new CANNON.Box(new CANNON.Vec3(w * 0.5, h * 0.5, d * 0.5))
      const body = new CANNON.Body({
        mass: 1,
        material: plastic,
        shape: shape,
      })
      body.position.copy(position)
      body.addEventListener('collide', (e: any) => {
        playHitSounds(e)
      })
      world.addBody(body)

      objectsToUpdate.push({ mesh, body })
      // world.remove(body)
      // scene.remove(mesh)
    }
    const createSphere = (radius: number, position: any) => {
      const mesh = new THREE.Mesh(geoSphere, mat)

      mesh.castShadow = true
      mesh.position.copy(position)
      mesh.scale.set(radius, radius, radius)
      scene.add(mesh)

      const shape = new CANNON.Sphere(radius)
      const body = new CANNON.Body({
        mass: 1,
        material: plastic,
        shape: shape,
      })
      body.position.copy(position)
      body.addEventListener('collide', (e: any) => {
        playHitSounds(e)
      })
      world.addBody(body)

      objectsToUpdate.push({ mesh, body })
      // world.remove(body)
      // scene.remove(mesh)
    }

    const debug = {
      createSphere: () => {
        createSphere(Math.random() * 0.5, {
          x: (Math.random() - 0.5) * 3,
          // y: Math.random() * 10,
          y: 5,
          z: (Math.random() - 0.5) * 3,
        })
      },
      createBox: () => {
        createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
          x: (Math.random() - 0.5) * 3,
          y: 5,
          z: (Math.random() - 0.5) * 3,
        })
      },
      reset: () => {
        objectsToUpdate.forEach((obj) => {
          obj.body.removeEventListener('collide', playHitSounds)
          world.remove(obj.body)
          scene.remove(obj.mesh)
        })
      },
    }
    // const gui = new dat.GUI()
    // gui.add(debug, 'createBox')
    // gui.add(debug, 'createSphere')
    // gui.add(debug, 'reset')

    // Animation
    const clock = new THREE.Clock()
    let oldElapsedTime = 0
    let req = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - oldElapsedTime
      oldElapsedTime = elapsedTime
      world.step(1 / 60, deltaTime, 3)
      // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
      // sphere.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)

      objectsToUpdate.forEach((obj) => {
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
      })

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

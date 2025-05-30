"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ThreeSceneProps {
  className?: string
  data?: number[]
}

export function ThreeScene({ className, data = [] }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const bars: THREE.Mesh[] = []
    const barCount = Math.max(data.length, 10)

    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(0.2, 1, 0.2)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / barCount, 0.7, 0.6),
      })
      const bar = new THREE.Mesh(geometry, material)
      bar.position.x = (i - barCount / 2) * 0.3
      bar.position.y = 0
      scene.add(bar)
      bars.push(bar)
    }

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      bars.forEach((bar, index) => {
        const targetHeight = data[index] ? (data[index] / 100) * 2 : Math.sin(Date.now() * 0.001 + index) * 0.5 + 1
        bar.scale.y += (targetHeight - bar.scale.y) * 0.1
        bar.rotation.y += 0.01
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [data])

  return <div ref={containerRef} className={className} />
}

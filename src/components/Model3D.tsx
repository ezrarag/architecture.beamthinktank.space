'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

interface BuildingModelProps {
  type: 'skyscraper' | 'community' | 'office' | 'residential'
}

function BuildingModel({ type }: BuildingModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const renderBuilding = () => {
    switch (type) {
      case 'skyscraper':
        return (
          <group ref={groupRef}>
            {/* Main tower */}
            <Box args={[2, 8, 2]} position={[0, 4, 0]}>
              <meshStandardMaterial color="#4a90e2" />
            </Box>
            {/* Top section */}
            <Box args={[1.5, 1, 1.5]} position={[0, 8.5, 0]}>
              <meshStandardMaterial color="#2c3e50" />
            </Box>
            {/* Base */}
            <Box args={[3, 0.5, 3]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color="#34495e" />
            </Box>
          </group>
        )
      
      case 'community':
        return (
          <group ref={groupRef}>
            {/* Main building */}
            <Box args={[4, 2, 3]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#e74c3c" />
            </Box>
            {/* Tower */}
            <Cylinder args={[0.5, 0.5, 3]} position={[1.5, 2.5, 0]}>
              <meshStandardMaterial color="#f39c12" />
            </Cylinder>
            {/* Dome */}
            <Sphere args={[1]} position={[0, 3, 0]}>
              <meshStandardMaterial color="#9b59b6" />
            </Sphere>
          </group>
        )
      
      case 'office':
        return (
          <group ref={groupRef}>
            {/* Modern office building */}
            <Box args={[3, 4, 2]} position={[0, 2, 0]}>
              <meshStandardMaterial color="#3498db" />
            </Box>
            {/* Glass facade */}
            <Box args={[2.8, 3.8, 0.1]} position={[0, 2, 1.05]}>
              <meshStandardMaterial color="#ecf0f1" transparent opacity={0.3} />
            </Box>
            {/* Entrance */}
            <Box args={[1, 0.5, 0.5]} position={[0, 0.25, 1.25]}>
              <meshStandardMaterial color="#2c3e50" />
            </Box>
          </group>
        )
      
      case 'residential':
        return (
          <group ref={groupRef}>
            {/* House base */}
            <Box args={[3, 2, 2]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#e67e22" />
            </Box>
            {/* Roof */}
            <Box args={[3.5, 1, 2.5]} position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color="#8b4513" />
            </Box>
            {/* Chimney */}
            <Box args={[0.3, 1, 0.3]} position={[1, 3, 0]}>
              <meshStandardMaterial color="#654321" />
            </Box>
          </group>
        )
      
      default:
        return null
    }
  }

  return (
    <group>
      {renderBuilding()}
      {/* Ground plane */}
      <Box args={[10, 0.1, 10]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#95a5a6" />
      </Box>
    </group>
  )
}

interface Model3DProps {
  type: BuildingModelProps['type']
  className?: string
}

export default function Model3D({ type, className = '' }: Model3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <BuildingModel type={type} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

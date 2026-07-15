import React, { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { usePortfolio } from '../context/PortfolioContext';
import type { PortfolioZone } from '../context/PortfolioContext';

// Define camera coordinates and target lookAt vectors for each zone
const zoneCoordinates: Record<PortfolioZone, { pos: [number, number, number]; target: [number, number, number] }> = {
  home: { pos: [0, 4, 8], target: [0, 0.5, 0] },
  projects: { pos: [-8, 3, 5], target: [-8, 0, 0] },
  skills: { pos: [8, 3, 5], target: [8, 0, 0] },
  internship: { pos: [-8, 2.5, -5], target: [-8, 0, -8] },
  education: { pos: [-4, 2.5, -5], target: [-4, 0, -8] },
  communities: { pos: [4, 2.5, -5], target: [4, 0, -8] },
  achievements: { pos: [8, 2.5, -5], target: [8, 0, -8] },
  uiux: { pos: [0, 3.5, -10], target: [0, 0, -14] },
  contact: { pos: [0, 5, 13], target: [0, 1, 8] },
};

// Camera controller component inside R3F context
const CameraController: React.FC = () => {
  const { currentZone } = usePortfolio();
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const coords = zoneCoordinates[currentZone];
    if (!coords) return;

    // Animate camera position
    gsap.to(camera.position, {
      x: coords.pos[0],
      y: coords.pos[1],
      z: coords.pos[2],
      duration: 2.2,
      ease: 'power3.inOut',
    });

    // Animate orbit controls target (what camera is looking at)
    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: coords.target[0],
        y: coords.target[1],
        z: coords.target[2],
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          controlsRef.current.update();
        },
      });
    }
  }, [currentZone, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2.1} // Prevent looking completely underneath the grid
      minDistance={3}
      maxDistance={25}
    />
  );
};

// Mouse-responsive lighting setup
const MouseResponsiveLight: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;
    // Map mouse position (-1 to 1) to 3D space
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    
    // Smoothly interpolate light position
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y + 2, 0.1);
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={1.5}
      distance={15}
      color="#00f0ff"
      position={[0, 4, 2]}
    />
  );
};

// Environment floating particles
const FloatingParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 400;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 30; // X
      pos[i + 1] = (Math.random() - 0.5) * 15 + 2; // Y (height slightly above floor)
      pos[i + 2] = (Math.random() - 0.5) * 30; // Z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Gently rotate particle field and bounce them slightly
    pointsRef.current.rotation.y = time * 0.02;
    
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const yIndex = i * 3 + 1;
      pos[yIndex] += Math.sin(time + i) * 0.003; // Subtle float up and down
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00f0ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

interface CanvasContainerProps {
  children: React.ReactNode;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 z-10 w-full h-full canvas-3d pointer-events-auto">
      <Canvas
        camera={{ position: [0, 8, 15], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050505"]} />
        
        {/* Fog effect to fade assets into background */}
        <fog attach="fog" args={["#050505", 10, 30]} />

        {/* Lighting Setup */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
        />
        {/* Soft violet fill light */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.6}
          color="#a855f7"
        />

        <MouseResponsiveLight />
        
        <FloatingParticles />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

        {/* 3D Scene Assets (Passed as children) */}
        {children}

        {/* Camera Control & Interaction */}
        <CameraController />

        {/* Post processing for glow / premium look */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            height={300} 
            intensity={1.2} 
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
export default CanvasContainer;

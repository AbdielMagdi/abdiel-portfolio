import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

export const EducationCampus: React.FC = () => {
  const { setCurrentZone } = usePortfolio();
  const capRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (capRef.current) {
      capRef.current.position.y = Math.sin(time * 2.2) * 0.08 + 1.2;
      capRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group position={[-4, 0, -8]}>
      {/* Campus Base grid */}
      <gridHelper args={[6, 8, '#0077ff', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-3, -0.2, -3], [3, -0.2, -3], [3, -0.2, 3], [-3, -0.2, 3], [-3, -0.2, -3]
        ]}
        color="#0077ff"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Floating Procedural Graduation Cap */}
      <group
        ref={capRef}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentZone('education');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        data-cursor-text="SSN COLLEGE"
      >
        {/* Cap Top Board (tilted diamond) */}
        <mesh position={[0, 0.35, 0]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.9, 0.02, 0.9]} />
          <meshStandardMaterial color="#101010" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Outer glowing border for Cap Board */}
        <Line
          points={[
            [-0.45, 0.36, -0.45], [0.45, 0.36, -0.45], [0.45, 0.36, 0.45], [-0.45, 0.36, 0.45], [-0.45, 0.36, -0.45]
          ]}
          color={hovered ? "#0077ff" : "#00f0ff"}
          lineWidth={2}
        />

        {/* Cap Skull cap body */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.26, 0.28, 0.28, 16]} />
          <meshStandardMaterial color="#181818" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Cap Tassel Line */}
        <Line
          points={[
            [0, 0.37, 0], [0.35, 0.33, 0.35], [0.36, 0.1, 0.36]
          ]}
          color="#a855f7"
          lineWidth={1.5}
        />
        {/* Cap Tassel Band */}
        <mesh position={[0.36, 0.08, 0.36]}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>

        {/* Halo light source */}
        <pointLight color="#0077ff" intensity={hovered ? 2.5 : 1} distance={4} />
      </group>

      {/* Timeline Spire / Pillar */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#151515" opacity={0.5} transparent />
      </mesh>

      {/* Floating text description */}
      <Float speed={2} floatIntensity={0.3}>
        <group position={[0, 2.2, 0]}>
          <Text
            fontSize={0.24}
            font="/Orbitron.woff"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            EDUCATION
          </Text>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.16}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
          >
            SSN CSE
          </Text>
        </group>
      </Float>

      {/* Dynamic Floating Rings on Timeline */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>
      
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.65, 32]} />
        <meshBasicMaterial color="#a855f7" opacity={0.4} transparent />
      </mesh>
    </group>
  );
};
export default EducationCampus;

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

export const HomeBase: React.FC = () => {
  const { collectGem, collectedGems } = usePortfolio();
  const laptopRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const cupRef = useRef<THREE.Mesh>(null);
  const [hoveredGem, setHoveredGem] = useState(false);
  const [gemClicked, setGemClicked] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire holographic laptop slowly
    if (laptopRef.current) {
      laptopRef.current.rotation.y = time * 0.4;
    }

    // Pulse screen glow slightly
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshBasicMaterial;
      material.color.setHSL(0.5, 1, 0.4 + Math.sin(time * 3) * 0.1);
    }

    // Float the coffee cup
    if (cupRef.current) {
      cupRef.current.position.y = Math.sin(time * 2) * 0.05 + 0.25;
      cupRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Desk Base Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#101010" opacity={0.2} transparent />
      </mesh>
      
      {/* Sleek Desk Outline */}
      <Line
        points={[
          [-3, -0.2, -3], [3, -0.2, -3], [3, -0.2, 3], [-3, -0.2, 3], [-3, -0.2, -3]
        ]}
        color="#00f0ff"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Cyber Grid pattern inside the desk boundaries */}
      <gridHelper args={[6, 12, '#00f0ff', '#1a1a1a']} position={[0, -0.19, 0]} />

      {/* Floating Holographic Laptop group */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={laptopRef} position={[0, 0.6, 0]}>
          {/* Base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.05, 0.8]} />
            <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.2} />
          </mesh>
          <Line
            points={[
              [-0.6, 0.03, -0.4], [0.6, 0.03, -0.4], [0.6, 0.03, 0.4], [-0.6, 0.03, 0.4], [-0.6, 0.03, -0.4]
            ]}
            color="#00f0ff"
            lineWidth={2}
          />

          {/* Keyboard Keypad glow (dotted texture proxy) */}
          <mesh position={[0, 0.03, 0.1]}>
            <boxGeometry args={[1.0, 0.005, 0.4]} />
            <meshBasicMaterial color="#a855f7" opacity={0.5} transparent />
          </mesh>

          {/* Screen hinge & bezel */}
          <group position={[0, 0.02, -0.38]} rotation={[0.4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.8, 0.04]} />
              <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Glowing Screen Content */}
            <mesh ref={screenRef} position={[0, 0.02, 0.025]}>
              <planeGeometry args={[1.1, 0.7]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>

            {/* Futuristic text on screen */}
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.06}
              font="/Orbitron.woff"
              color="#050505"
              anchorX="center"
              anchorY="middle"
            >
              {"const samuel = {\n  code: 'always',\n  design: 'premium'\n};"}
            </Text>
          </group>
        </group>
      </Float>

      {/* Floating Coffee Mug */}
      <group position={[-1.6, 0.25, 1.0]}>
        {/* Liquid and cup body */}
        <mesh ref={cupRef} castShadow>
          <cylinderGeometry args={[0.2, 0.18, 0.4, 16]} />
          <meshStandardMaterial color="#111" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.2, 0.25, 1.0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} />
        </mesh>
        {/* Steam particles rising */}
        <Float speed={4} floatIntensity={0.5}>
          <mesh position={[-1.6, 0.6, 1.0]}>
            <boxGeometry args={[0.01, 0.1, 0.01]} />
            <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
        </Float>
      </group>

      {/* Floating Syntactic Code Blocks */}
      <Float speed={1.5} floatIntensity={0.6}>
        <group position={[1.8, 1.2, -1.0]} rotation={[0, -0.4, 0]}>
          {/* Neon syntax highlighted lines floating */}
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.03, 0.8, 4, 8]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          <mesh position={[0.2, 0.15, 0.1]}>
            <capsuleGeometry args={[0.03, 0.4, 4, 8]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
          <mesh position={[0.1, 0.0, -0.1]}>
            <capsuleGeometry args={[0.03, 0.6, 4, 8]} />
            <meshBasicMaterial color="#00ff99" />
          </mesh>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.12}
            color="#ffffff"
            font="/Orbitron.woff"
          >
            SYSTEM_ACTIVE
          </Text>
        </group>
      </Float>

      {/* Floating 3D Geometric Ornaments */}
      <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[-2, 1.8, -1.5]} rotation={[1, 1, 1]}>
          <octahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#a855f7" roughness={0.1} metalness={0.9} wireframe />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.3}>
        <mesh position={[2, 0.8, 1.5]} rotation={[0.5, 0.5, 0.5]}>
          <dodecahedronGeometry args={[0.2]} />
          <meshPhysicalMaterial
            color="#00f0ff"
            roughness={0.1}
            transmission={0.6}
            thickness={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* EASTER EGG: Hidden Hologram Gem #1 */}
      {!collectedGems.includes(1) && !gemClicked && (
        <Float speed={5} floatIntensity={1} rotationIntensity={1.5}>
          <mesh
            position={[-2.2, 1.5, 0.8]}
            onPointerOver={() => setHoveredGem(true)}
            onPointerOut={() => setHoveredGem(false)}
            onClick={() => {
              setGemClicked(true);
              collectGem(1);
            }}
            data-cursor-text="COLLECT GEM"
          >
            <octahedronGeometry args={[0.15]} />
            <meshBasicMaterial
              color={hoveredGem ? "#a855f7" : "#00f0ff"}
              wireframe
            />
            {/* Pulsing ring around gem */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.25, 0.28, 16]} />
              <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent />
            </mesh>
          </mesh>
        </Float>
      )}
    </group>
  );
};
export default HomeBase;

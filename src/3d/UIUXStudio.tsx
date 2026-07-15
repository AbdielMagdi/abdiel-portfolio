import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

interface FigmaScreen {
  id: string;
  title: string;
  category: string;
  color: string;
  angle: number; // Position angle in semi-circle
}

const figmaScreens: FigmaScreen[] = [
  { id: 'website-design', title: 'WEBSITE', category: 'Landing Page', color: '#00f0ff', angle: -0.6 },
  { id: 'hrms-dashboard', title: 'HRMS', category: 'Dashboard', color: '#a855f7', angle: -0.2 },
  { id: 'abinew', title: 'ABINEW', category: 'Mobile App', color: '#00ff99', angle: 0.2 },
  { id: 'plants-tracker', title: 'PLANTS', category: 'Healthcare', color: '#ff8800', angle: 0.6 },
];

interface ScreenMeshProps {
  screen: FigmaScreen;
  onClick: () => void;
}

const HolographicScreen: React.FC<ScreenMeshProps> = ({ screen, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const radius = 2.5;
  const x = Math.sin(screen.angle) * radius;
  const z = Math.cos(screen.angle) * radius - radius;
  const rotY = -screen.angle;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Gentle float
    groupRef.current.position.y = 0.8 + Math.sin(time * 1.5 + screen.angle * 3) * 0.04;
    
    // Subtle tilt toward mouse on hover
    if (hovered && frameRef.current) {
      const tiltX = state.pointer.y * 0.08;
      const tiltY = state.pointer.x * 0.08;
      frameRef.current.rotation.x = THREE.MathUtils.lerp(frameRef.current.rotation.x, tiltX, 0.1);
      frameRef.current.rotation.y = THREE.MathUtils.lerp(frameRef.current.rotation.y, rotY + tiltY, 0.1);
    } else if (frameRef.current) {
      frameRef.current.rotation.x = THREE.MathUtils.lerp(frameRef.current.rotation.x, 0, 0.05);
      frameRef.current.rotation.y = THREE.MathUtils.lerp(frameRef.current.rotation.y, rotY, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[x, 0.8, z]}>
      <group ref={frameRef} rotation={[0, rotY, 0]}>
        {/* Screen panel - frosted glass effect */}
        <mesh
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[1.2, 0.75]} />
          <meshPhysicalMaterial
            color={screen.color}
            roughness={0.05}
            metalness={0.1}
            transmission={0.6}
            thickness={0.1}
            transparent
            opacity={hovered ? 0.35 : 0.15}
            emissive={screen.color}
            emissiveIntensity={hovered ? 0.4 : 0.08}
          />
        </mesh>

        {/* Glowing border frame */}
        <Line
          points={[
            [-0.6, -0.375, 0.01], [0.6, -0.375, 0.01], [0.6, 0.375, 0.01],
            [-0.6, 0.375, 0.01], [-0.6, -0.375, 0.01]
          ]}
          color={screen.color}
          lineWidth={hovered ? 3 : 1.5}
          opacity={hovered ? 0.9 : 0.4}
          transparent
        />

        {/* Grid pattern on screen */}
        {[...Array(4)].map((_, i) => (
          <Line
            key={`h-${i}`}
            points={[[-0.55, -0.28 + i * 0.18, 0.005], [0.55, -0.28 + i * 0.18, 0.005]]}
            color={screen.color}
            lineWidth={0.5}
            opacity={0.1}
            transparent
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <Line
            key={`v-${i}`}
            points={[[-0.44 + i * 0.22, -0.32, 0.005], [-0.44 + i * 0.22, 0.32, 0.005]]}
            color={screen.color}
            lineWidth={0.5}
            opacity={0.1}
            transparent
          />
        ))}

        {/* Title on screen */}
        <Text
          position={[0, 0.05, 0.02]}
          fontSize={0.1}
          color="#ffffff"
          font="/Orbitron.woff"
          anchorX="center"
          anchorY="middle"
        >
          {screen.title}
        </Text>
        
        {/* Category subtitle */}
        <Text
          position={[0, -0.1, 0.02]}
          fontSize={0.05}
          color={screen.color}
          anchorX="center"
          anchorY="middle"
        >
          {screen.category}
        </Text>

        {/* Glow light behind screen */}
        <pointLight
          color={screen.color}
          intensity={hovered ? 3 : 0.8}
          distance={2}
          position={[0, 0, -0.3]}
        />
      </group>
    </group>
  );
};

export const UIUXStudio: React.FC = () => {
  const { setCurrentZone, setSelectedFigmaProject } = usePortfolio();
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      coreRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -14]}>
      {/* Base Grid */}
      <gridHelper args={[8, 10, '#a855f7', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-4, -0.2, -4], [4, -0.2, -4], [4, -0.2, 4], [-4, -0.2, 4], [-4, -0.2, -4]
        ]}
        color="#a855f7"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Central design core - rotating wireframe */}
      <mesh ref={coreRef} position={[0, 0.6, 0]}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#a855f7" wireframe roughness={0.1} metalness={0.9} />
        <pointLight color="#a855f7" intensity={2} distance={4} />
      </mesh>

      {/* Orbit ring around core */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.6, 0]}>
        <ringGeometry args={[0.6, 0.62, 64]} />
        <meshBasicMaterial color="#a855f7" opacity={0.2} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]} position={[0, 0.6, 0]}>
        <ringGeometry args={[0.55, 0.57, 64]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.15} transparent />
      </mesh>

      {/* 4 Floating Holographic Screens */}
      {figmaScreens.map((screen) => (
        <HolographicScreen
          key={screen.id}
          screen={screen}
          onClick={() => {
            setSelectedFigmaProject(screen.id);
            setCurrentZone('uiux');
          }}
        />
      ))}

      {/* Connection lines from core to each screen */}
      {figmaScreens.map((screen) => {
        const radius = 2.5;
        const x = Math.sin(screen.angle) * radius;
        const z = Math.cos(screen.angle) * radius - radius;
        return (
          <Line
            key={`conn-${screen.id}`}
            points={[[0, 0.6, 0], [x, 0.8, z]]}
            color={screen.color}
            lineWidth={1}
            opacity={0.15}
            transparent
          />
        );
      })}

      {/* Title plate */}
      <Float speed={2} floatIntensity={0.2}>
        <group position={[0, 2.5, 0]}>
          <Text
            fontSize={0.25}
            font="/Orbitron.woff"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            UI/UX STUDIO
          </Text>
          <Text
            position={[0, -0.35, 0]}
            fontSize={0.12}
            color="#a855f7"
            anchorX="center"
            anchorY="middle"
          >
            INTERACTIVE DESIGN LAB
          </Text>
        </group>
      </Float>
    </group>
  );
};
export default UIUXStudio;

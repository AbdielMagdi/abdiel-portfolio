import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

interface PlanetProps {
  name: string;
  color: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  phase: number;
  onClick: () => void;
}

const SkillPlanet: React.FC<PlanetProps> = ({ name, color, radius, orbitRadius, orbitSpeed, phase, onClick }) => {
  const planetRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const currentAngle = useRef(phase);

  useFrame((state) => {
    if (!planetRef.current) return;
    const time = state.clock.getElapsedTime();

    // Adjust orbit speed based on hover (speeds up spin when hovered)
    const activeSpeed = hovered ? orbitSpeed * 1.8 : orbitSpeed;
    currentAngle.current += activeSpeed * 0.015;

    // Calculate orbit position in circular loop
    const x = Math.cos(currentAngle.current) * orbitRadius;
    const z = Math.sin(currentAngle.current) * orbitRadius;
    const y = Math.sin(time + phase) * 0.15; // Slow vertical bobbing

    planetRef.current.position.set(x, y, z);
    
    // Rotate the planet sphere on its own axis
    const sphereMesh = planetRef.current.getObjectByName('sphere') as THREE.Mesh;
    if (sphereMesh) {
      sphereMesh.rotation.y = time * 0.5;
    }
  });

  return (
    <group ref={planetRef}>
      {/* Target sphere for hover & click */}
      <mesh
        name="sphere"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        data-cursor-text="VIEW SKILLS"
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={hovered ? 0.7 : 0.25}
          transmission={0.4}
          thickness={0.8}
        />
      </mesh>

      {/* Saturn-like ring */}
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[radius * 1.3, radius * 1.7, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} opacity={0.3} transparent />
      </mesh>

      {/* Floating text label */}
      <Text
        position={[0, radius + 0.35, 0]}
        fontSize={0.2}
        font="/Orbitron.woff"
        color={hovered ? '#ffffff' : '#bbbbbb'}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

export const SkillsIsland: React.FC = () => {
  const { setCurrentZone, collectGem, collectedGems } = usePortfolio();
  const centralCoreRef = useRef<THREE.Mesh>(null);
  const [hoveredGem, setHoveredGem] = useState(false);
  const [gemClicked, setGemClicked] = useState(false);

  useFrame((state) => {
    if (centralCoreRef.current) {
      centralCoreRef.current.rotation.y = state.clock.getElapsedTime() * 0.6;
      centralCoreRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={[8, 0, 0]}>
      {/* Island grid base */}
      <gridHelper args={[8, 8, '#00ff99', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-4, -0.2, -4], [4, -0.2, -4], [4, -0.2, 4], [-4, -0.2, 4], [-4, -0.2, -4]
        ]}
        color="#00ff99"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Central Star / Core (Representing Abdiel's Core Mind) */}
      <mesh ref={centralCoreRef} position={[0, 0.5, 0]}>
        <dodecahedronGeometry args={[0.55]} />
        <meshStandardMaterial color="#00f0ff" roughness={0.1} metalness={0.9} wireframe />
        <pointLight color="#00f0ff" intensity={2} distance={6} />
      </mesh>
      
      {/* Pulsing ring around central core */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <ringGeometry args={[0.8, 0.9, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.3} transparent />
      </mesh>

      {/* Orbit paths visualizations */}
      {[1.8, 2.7, 3.5].map((rad, idx) => (
        <mesh key={idx} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
          <ringGeometry args={[rad - 0.01, rad + 0.01, 64]} />
          <meshBasicMaterial color="#333333" opacity={0.2} transparent />
        </mesh>
      ))}

      {/* Planet 1: Languages (Inner orbit, speed: 0.8, Cyan) */}
      <SkillPlanet
        name="LANGS"
        color="#00f0ff"
        radius={0.35}
        orbitRadius={1.8}
        orbitSpeed={0.8}
        phase={0}
        onClick={() => setCurrentZone('skills')}
      />

      {/* Planet 2: Frontend (Middle orbit, speed: 0.6, Blue) */}
      <SkillPlanet
        name="FRONTEND"
        color="#0077ff"
        radius={0.42}
        orbitRadius={2.7}
        orbitSpeed={0.5}
        phase={2}
        onClick={() => setCurrentZone('skills')}
      />

      {/* Planet 3: Backend (Middle orbit, speed: 0.5, Purple) */}
      <SkillPlanet
        name="BACKEND"
        color="#a855f7"
        radius={0.45}
        orbitRadius={2.7}
        orbitSpeed={0.45}
        phase={4.5}
        onClick={() => setCurrentZone('skills')}
      />

      {/* Planet 4: AI & ML (Outer orbit, speed: 0.4, Magenta) */}
      <SkillPlanet
        name="AI / ML"
        color="#ff00a0"
        radius={0.38}
        orbitRadius={3.5}
        orbitSpeed={0.3}
        phase={1}
        onClick={() => setCurrentZone('skills')}
      />

      {/* Planet 5: Tools & Design (Outer orbit, speed: 0.35, Orange) */}
      <SkillPlanet
        name="TOOLS"
        color="#ff8800"
        radius={0.32}
        orbitRadius={3.5}
        orbitSpeed={0.33}
        phase={3.5}
        onClick={() => setCurrentZone('skills')}
      />

      {/* EASTER EGG: Hidden Hologram Gem #3 (Required for secret joke mode) */}
      {!collectedGems.includes(3) && !gemClicked && (
        <Float speed={5} floatIntensity={1} rotationIntensity={1.5}>
          <mesh
            position={[-3.2, 1.8, -2.5]}
            onPointerOver={() => setHoveredGem(true)}
            onPointerOut={() => setHoveredGem(false)}
            onClick={() => {
              setGemClicked(true);
              collectGem(3);
            }}
            data-cursor-text="COLLECT GEM"
          >
            <octahedronGeometry args={[0.15]} />
            <meshBasicMaterial
              color={hoveredGem ? "#00f0ff" : "#ff00a0"}
              wireframe
            />
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.25, 0.28, 16]} />
              <meshBasicMaterial color="#ff00a0" opacity={0.4} transparent />
            </mesh>
          </mesh>
        </Float>
      )}
    </group>
  );
};
export default SkillsIsland;

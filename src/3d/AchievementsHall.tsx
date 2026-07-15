import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

interface TrophyProps {
  id: string;
  name: string;
  shortName: string;
  color: string;
  position: [number, number, number];
  geometry: React.ReactNode;
  onClick: () => void;
}

const PedestalTrophy: React.FC<TrophyProps> = ({ name, shortName, color, position, geometry, onClick }) => {
  const trophyRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!trophyRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Float and rotate trophy
    trophyRef.current.position.y = position[1] + 0.65 + Math.sin(time * 2.2 + position[0]) * 0.05;
    trophyRef.current.rotation.y = time * 0.5 + position[0];
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Cylinder Pedestal */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.5, 16]} />
        <meshStandardMaterial color="#101010" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Top glowing plate */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.22, 16]} />
        <meshBasicMaterial color={color} opacity={0.4} transparent />
      </mesh>

      {/* Floating Trophy Group */}
      <group
        ref={trophyRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        data-cursor-text={shortName}
      >
        {geometry}
        <pointLight color={color} intensity={hovered ? 2.5 : 0.6} distance={2} />
      </group>

      {/* Label under pedestal */}
      <Text
        position={[0, 0.05, 0.4]}
        fontSize={0.09}
        color={hovered ? color : '#888888'}
        font="/Orbitron.woff"
        anchorX="center"
        anchorY="middle"
      >
        {name.toUpperCase()}
      </Text>
    </group>
  );
};

export const AchievementsHall: React.FC = () => {
  const { setCurrentZone, setSelectedAchievement } = usePortfolio();

  // 8 categories coordinates arranged in a museum corridor grid
  // Col 1: x = -1.8, Col 2: x = -0.6, Col 3: x = 0.6, Col 4: x = 1.8
  // Row 1: z = -1.2, Row 2: z = 1.2
  const trophies = [
    {
      id: 'internships',
      name: 'Internships',
      shortName: 'Internships',
      color: '#ff8800',
      pos: [-1.8, 0, -1.0],
      geom: (
        <mesh>
          <capsuleGeometry args={[0.1, 0.2, 4, 8]} />
          <meshStandardMaterial color="#ff8800" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'leadership',
      name: 'Leadership',
      shortName: 'Leadership',
      color: '#00f0ff',
      pos: [-0.6, 0, -1.0],
      geom: (
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#00f0ff" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'designs',
      name: 'Designs',
      shortName: 'Contributions',
      color: '#ff00aa',
      pos: [0.6, 0, -1.0],
      geom: (
        <mesh>
          <coneGeometry args={[0.13, 0.3, 4]} />
          <meshStandardMaterial color="#ff00aa" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'hackathons',
      name: 'Hackathons',
      shortName: 'Wins',
      color: '#00ff99',
      pos: [1.8, 0, -1.0],
      geom: (
        <mesh>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#00ff99" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'workshops',
      name: 'Workshops',
      shortName: 'Seminars',
      color: '#a855f7',
      pos: [-1.8, 0, 1.2],
      geom: (
        <mesh>
          <torusGeometry args={[0.12, 0.04, 8, 24]} />
          <meshStandardMaterial color="#a855f7" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'certs',
      name: 'Certifications',
      shortName: 'Credentials',
      color: '#ffdd00',
      pos: [-0.6, 0, 1.2],
      geom: (
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#ffdd00" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'impact',
      name: 'Impact',
      shortName: 'Community',
      color: '#0077ff',
      pos: [0.6, 0, 1.2],
      geom: (
        <mesh>
          <tetrahedronGeometry args={[0.16]} />
          <meshStandardMaterial color="#0077ff" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    },
    {
      id: 'projects',
      name: 'Tech Projects',
      shortName: 'Builds',
      color: '#ff3300',
      pos: [1.8, 0, 1.2],
      geom: (
        <mesh>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial color="#ff3300" metalness={0.9} roughness={0.1} />
        </mesh>
      )
    }
  ];

  return (
    <group position={[8, 0, -8]}>
      {/* Museum Base Grid */}
      <gridHelper args={[6, 8, '#a855f7', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-3, -0.2, -3], [3, -0.2, -3], [3, -0.2, 3], [-3, -0.2, 3], [-3, -0.2, -3]
        ]}
        color="#a855f7"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Render the 8 Pedestal Trophies */}
      {trophies.map((t) => (
        <PedestalTrophy
          key={t.id}
          id={t.id}
          name={t.name}
          shortName={t.shortName}
          color={t.color}
          position={t.pos as [number, number, number]}
          geometry={t.geom}
          onClick={() => {
            setSelectedAchievement(t.id);
            setCurrentZone('achievements');
          }}
        />
      ))}

      {/* Header labels */}
      <Float speed={2} floatIntensity={0.25}>
        <group position={[0, 2.2, 0]}>
          <Text
            fontSize={0.22}
            font="/Orbitron.woff"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            HALL OF FAME
          </Text>
          <Text
            position={[0, -0.32, 0]}
            fontSize={0.13}
            color="#a855f7"
            anchorX="center"
            anchorY="middle"
          >
            ACHIEVEMENTS & TROPHIES
          </Text>
        </group>
      </Float>
    </group>
  );
};
export default AchievementsHall;

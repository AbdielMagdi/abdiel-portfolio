import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

interface OrgNode {
  id: string;
  name: string;
  shortName: string;
  role: string;
  color: string;
  posAngle: number; // Angle on circle
}

const orgsData: OrgNode[] = [
  { id: 'csi', name: 'SSN CSI', shortName: 'CSI', role: 'Design Team', color: '#00f0ff', posAngle: 0 },
  { id: 'aisc', name: 'SSN AiSC', shortName: 'AiSC', role: 'Design Team', color: '#a855f7', posAngle: 0.78 },
  { id: 'ace-design', name: 'SSN ACE Design', shortName: 'ACE', role: 'Design Team', color: '#00ff99', posAngle: 1.57 },
  { id: 'ace-coord', name: 'SSN ACE Event', shortName: 'ACE Coord', role: 'Event Coordinator', color: '#ff8800', posAngle: 2.35 },
  { id: 'ieee-design', name: 'SSN IEEE CS Design', shortName: 'IEEE CS', role: 'Design Team', color: '#ff0055', posAngle: 3.14 },
  { id: 'ieee-mkt', name: 'SSN IEEE CS Mkt', shortName: 'IEEE Mkt', role: 'Digital Marketing', color: '#0077ff', posAngle: 3.92 },
  { id: 'gdsc', name: 'SSN GDSC', shortName: 'GDSC', role: 'Design Core', color: '#ffffff', posAngle: 4.71 },
  { id: 'spotium', name: 'Spotium Design', shortName: 'Spotium', role: 'Marketing & Design Head', color: '#ffff00', posAngle: 5.49 }
];

interface NodeProps {
  node: OrgNode;
  centerPos: [number, number, number];
  onClick: () => void;
}

const NodeMesh: React.FC<NodeProps> = ({ node, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const radius = 1.8;

  // Calculate coordinates relative to center
  const x = Math.cos(node.posAngle) * radius;
  const z = Math.sin(node.posAngle) * radius;
  const y = 0.3; // Height above grid

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Bounce node slightly on hover
    const targetScale = hovered ? 1.3 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    
    meshRef.current.position.y = y + (hovered ? Math.sin(time * 8) * 0.05 : Math.sin(time + node.posAngle) * 0.03);
  });

  return (
    <group position={[x, 0, z]}>
      {/* Network Node Sphere */}
      <mesh
        ref={meshRef}
        position={[0, y, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        data-cursor-text={node.shortName}
      >
        <dodecahedronGeometry args={[0.18]} />
        <meshPhysicalMaterial
          color={node.color}
          roughness={0.1}
          metalness={0.8}
          emissive={node.color}
          emissiveIntensity={hovered ? 0.9 : 0.2}
          transparent
          opacity={0.9}
        />
        <pointLight color={node.color} intensity={hovered ? 2 : 0.5} distance={1.5} />
      </mesh>

      {/* Floating shortname tag above node */}
      <Float speed={2} floatIntensity={0.1}>
        <Text
          position={[0, y + 0.35, 0]}
          fontSize={0.12}
          color="#ffffff"
          font="/Orbitron.woff"
          anchorX="center"
          anchorY="middle"
        >
          {node.shortName}
        </Text>
      </Float>
    </group>
  );
};

export const Communities: React.FC = () => {
  const { setCurrentZone, setSelectedCommunityOrg } = usePortfolio();
  const campusCoreRef = useRef<THREE.Mesh>(null);
  const radius = 1.8;

  useFrame((state) => {
    if (campusCoreRef.current) {
      campusCoreRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  // Create connections between adjacent nodes in the circle
  const connections = orgsData.map((org, idx) => {
    const nextOrg = orgsData[(idx + 1) % orgsData.length];
    const x1 = Math.cos(org.posAngle) * radius;
    const z1 = Math.sin(org.posAngle) * radius;
    const x2 = Math.cos(nextOrg.posAngle) * radius;
    const z2 = Math.sin(nextOrg.posAngle) * radius;
    return { points: [[x1, 0.3, z1], [x2, 0.3, z2]], color: '#a855f7' };
  });

  // Connections back to the central core
  const coreConnections = orgsData.map((org) => {
    const x = Math.cos(org.posAngle) * radius;
    const z = Math.sin(org.posAngle) * radius;
    return { points: [[0, 0.3, 0], [x, 0.3, z]], color: '#00f0ff' };
  });

  return (
    <group position={[4, 0, -8]}>
      {/* Base Grid */}
      <gridHelper args={[6, 8, '#ff0055', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-3, -0.2, -3], [3, -0.2, -3], [3, -0.2, 3], [-3, -0.2, 3], [-3, -0.2, -3]
        ]}
        color="#ff0055"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Central Campus Chapter Core Node */}
      <mesh ref={campusCoreRef} position={[0, 0.3, 0]}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#ff0055" roughness={0.1} metalness={0.9} wireframe />
        <pointLight color="#ff0055" intensity={1.5} distance={3} />
      </mesh>

      {/* Symmetrical Network highway lines linking nodes */}
      {connections.map((c, idx) => (
        <Line
          key={`con-${idx}`}
          points={c.points as [number, number, number][]}
          color="#ff0055"
          lineWidth={1.5}
          opacity={0.25}
          transparent
        />
      ))}
      
      {coreConnections.map((cc, idx) => (
        <Line
          key={`corecon-${idx}`}
          points={cc.points as [number, number, number][]}
          color="#00f0ff"
          lineWidth={1.2}
          opacity={0.15}
          transparent
        />
      ))}

      {/* Orbit paths visualizations */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color="#ff0055" opacity={0.1} transparent />
      </mesh>

      {/* Individual Node structures */}
      {orgsData.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          centerPos={[4, 0, -8]}
          onClick={() => {
            setSelectedCommunityOrg(node.id);
            setCurrentZone('communities');
          }}
        />
      ))}

      {/* Title plate floating above district */}
      <Float speed={2} floatIntensity={0.25}>
        <group position={[0, 2.2, 0]}>
          <Text
            fontSize={0.22}
            font="/Orbitron.woff"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            COMMUNITIES
          </Text>
          <Text
            position={[0, -0.32, 0]}
            fontSize={0.13}
            color="#ff0055"
            anchorX="center"
            anchorY="middle"
          >
            BUILDING THROUGH DESIGN
          </Text>
        </group>
      </Float>
    </group>
  );
};
export default Communities;

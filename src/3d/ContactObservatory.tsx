import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

export const ContactObservatory: React.FC = () => {
  const { setCurrentZone } = usePortfolio();
  const dishRef = useRef<THREE.Group>(null);
  const signalRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the satellite dish back and forth slowly
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(time * 0.4) * 0.3;
    }

    // Pulse and scale the signal rings out
    if (signalRingRef.current) {
      const scaleVal = 1 + (time * 1.5) % 3.0; // Grows from 1 to 4
      signalRingRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      
      const material = signalRingRef.current.material as THREE.MeshBasicMaterial;
      // Fade out as it scales up
      material.opacity = Math.max(0, 0.7 - ((scaleVal - 1) / 3));
    }
  });

  return (
    <group position={[0, 0, 10]}>
      {/* Observatory Base Grid */}
      <gridHelper args={[6, 8, '#00f0ff', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-3, -0.2, -3], [3, -0.2, -3], [3, -0.2, 3], [-3, -0.2, 3], [-3, -0.2, -3]
        ]}
        color="#00f0ff"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Satellite Dome Pedestal */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.5, 16]} />
        <meshStandardMaterial color="#101010" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Interactive Satellite Dish group */}
      <group
        ref={dishRef}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentZone('contact');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        data-cursor-text="CONNECT NOW"
      >
        {/* Arm Mount */}
        <mesh position={[0, 0.6, -0.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
          <meshStandardMaterial color="#151515" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Dish Bowl */}
        <group position={[0, 0.85, 0.1]} rotation={[-0.4, 0, 0]}>
          {/* Main Cone/Dish */}
          <mesh>
            <coneGeometry args={[0.9, 0.4, 16, 1, true]} />
            <meshStandardMaterial color="#202020" roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* Glowing central transmitter */}
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={hovered ? "#00ff99" : "#00f0ff"} />
            <pointLight color="#00f0ff" intensity={hovered ? 3.0 : 1.2} distance={5} />
          </mesh>
          <Line
            points={[
              [0, 0.22, 0], [0.35, 0.0, 0],
              [0, 0.22, 0], [-0.35, 0.0, 0],
              [0, 0.22, 0], [0, 0.0, 0.35],
              [0, 0.22, 0], [0, 0.0, -0.35],
            ]}
            color="#00f0ff"
            lineWidth={1.5}
          />

          {/* Glowing Outer rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[0.88, 0.9, 32]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>

          {/* Emitted Pulsing Concentric Signal Rings */}
          <mesh ref={signalRingRef} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.12, 16]} />
            <meshBasicMaterial color="#00ff99" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Floating text headers */}
      <Float speed={2} floatIntensity={0.2}>
        <group position={[0, 2.2, 0]}>
          <Text
            fontSize={0.24}
            font="/Orbitron.woff"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            OBSERVATORY
          </Text>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.15}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
          >
            LET'S CONNECT
          </Text>
        </group>
      </Float>
    </group>
  );
};
export default ContactObservatory;

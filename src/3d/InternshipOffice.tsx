import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

export const InternshipOffice: React.FC = () => {
  const { setCurrentZone } = usePortfolio();
  const droneRef = useRef<THREE.Group>(null);
  
  // YesPanchi Trading room refs
  const tradingScreenRef = useRef<THREE.Group>(null);
  const candleRefs = useRef<THREE.Mesh[]>([]);

  const [hoveredCodoid, setHoveredCodoid] = useState(false);
  const [hoveredYesPanchi, setHoveredYesPanchi] = useState(false);

  // Initialize candlestick references array
  const addToCandles = (el: THREE.Mesh | null) => {
    if (el && !candleRefs.current.includes(el)) {
      candleRefs.current.push(el);
    }
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 1. Rotate drone propellers and float it (Codoid)
    if (droneRef.current) {
      droneRef.current.position.y = Math.sin(time * 3) * 0.08 + 1.1;
      
      const prop1 = droneRef.current.getObjectByName('prop1');
      const prop2 = droneRef.current.getObjectByName('prop2');
      const prop3 = droneRef.current.getObjectByName('prop3');
      const prop4 = droneRef.current.getObjectByName('prop4');
      
      const speed = hoveredCodoid ? 30 : 15;
      if (prop1) prop1.rotation.y += speed;
      if (prop2) prop2.rotation.y -= speed;
      if (prop3) prop3.rotation.y += speed;
      if (prop4) prop4.rotation.y -= speed;
    }

    // 2. Animate trading screens float & candlesticks scale (YesPanchi)
    if (tradingScreenRef.current) {
      tradingScreenRef.current.position.y = Math.sin(time * 2.5) * 0.06 + 1.1;
      tradingScreenRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    }

    // Dynamic candlestick pulsing heights
    candleRefs.current.forEach((candle, idx) => {
      if (candle) {
        const offset = idx * 0.8;
        const scaleVal = Math.sin(time * 4 + offset) * 0.4 + 1.0;
        candle.scale.y = scaleVal;
      }
    });
  });

  return (
    <group position={[-8, 0, -8]}>
      {/* ======================================================== */}
      {/* LEFT SIDE: CODOID INNOVATIONS OFFICE (UI/UX)             */}
      {/* ======================================================== */}
      <group position={[-2.2, 0, 0]}>
        {/* Grid office base */}
        <gridHelper args={[4.5, 6, '#ff8800', '#1a1a1a']} position={[0, -0.19, 0]} />
        <Line
          points={[
            [-2.25, -0.2, -3], [2.25, -0.2, -3], [2.25, -0.2, 3], [-2.25, -0.2, 3], [-2.25, -0.2, -3]
          ]}
          color="#ff8800"
          lineWidth={1.5}
          opacity={0.3}
          transparent
        />

        {/* Corporate Server Stack Cabinet */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.9, 0.8, 0.7]} />
          <meshStandardMaterial color="#101010" roughness={0.3} metalness={0.9} />
        </mesh>
        
        {/* Server panels glowing lines */}
        {[0.6, 0.4, 0.2].map((y, idx) => (
          <group key={idx} position={[0, y - 0.2, 0.36]}>
            <mesh>
              <planeGeometry args={[0.7, 0.08]} />
              <meshBasicMaterial color="#1f1f1f" />
            </mesh>
            {/* LED blinkers */}
            <mesh position={[-0.25, 0, 0.01]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color={idx % 2 === 0 ? "#00ff99" : "#ff0055"} />
            </mesh>
            <mesh position={[-0.15, 0, 0.01]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>
        ))}

        {/* Floating Drone wireframe representing "Drone Project" */}
        <group
          ref={droneRef}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentZone('internship');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredCodoid(true);
          }}
          onPointerOut={() => setHoveredCodoid(false)}
          data-cursor-text="VIEW CODOID INTERN"
        >
          {/* Drone Center Core */}
          <mesh>
            <boxGeometry args={[0.3, 0.06, 0.3]} />
            <meshStandardMaterial color="#1c1c1c" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Glowing Drone Core Light */}
          <pointLight color="#ff8800" intensity={hoveredCodoid ? 3 : 1} distance={3} />

          {/* Drone Arms */}
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.8, 0.03, 0.06]} />
            <meshStandardMaterial color="#00f0ff" />
          </mesh>
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[0.8, 0.03, 0.06]} />
            <meshStandardMaterial color="#00f0ff" />
          </mesh>

          {/* Propellers */}
          {/* Propeller 1 */}
          <group name="prop1" position={[0.28, 0.04, 0.28]}>
            <mesh>
              <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
              <meshBasicMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.25, 0.004, 0.02]} />
              <meshBasicMaterial color="#ff8800" />
            </mesh>
          </group>
          {/* Propeller 2 */}
          <group name="prop2" position={[-0.28, 0.04, 0.28]}>
            <mesh>
              <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
              <meshBasicMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.25, 0.004, 0.02]} />
              <meshBasicMaterial color="#ff8800" />
            </mesh>
          </group>
          {/* Propeller 3 */}
          <group name="prop3" position={[-0.28, 0.04, -0.28]}>
            <mesh>
              <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
              <meshBasicMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.25, 0.004, 0.02]} />
              <meshBasicMaterial color="#ff8800" />
            </mesh>
          </group>
          {/* Propeller 4 */}
          <group name="prop4" position={[0.28, 0.04, -0.28]}>
            <mesh>
              <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
              <meshBasicMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[0.25, 0.004, 0.02]} />
              <meshBasicMaterial color="#ff8800" />
            </mesh>
          </group>
        </group>

        {/* Floating text headers */}
        <Float speed={2} floatIntensity={0.25}>
          <group position={[0, 2.1, 0]}>
            <Text
              fontSize={0.16}
              font="/Orbitron.woff"
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              UI/UX INTERN
            </Text>
            <Text
              position={[0, -0.25, 0]}
              fontSize={0.12}
              color="#ff8800"
              anchorX="center"
              anchorY="middle"
            >
              CODOID INNOVATIONS
            </Text>
          </group>
        </Float>
      </group>

      {/* ======================================================== */}
      {/* RIGHT SIDE: YESPANCHI OFFICE (FULL STACK DEVELOPER)      */}
      {/* ======================================================== */}
      <group position={[2.2, 0, 0]}>
        {/* Grid office base */}
        <gridHelper args={[4.5, 6, '#00ff99', '#1a1a1a']} position={[0, -0.19, 0]} />
        <Line
          points={[
            [-2.25, -0.2, -3], [2.25, -0.2, -3], [2.25, -0.2, 3], [-2.25, -0.2, 3], [-2.25, -0.2, -3]
          ]}
          color="#00ff99"
          lineWidth={1.5}
          opacity={0.3}
          transparent
        />

        {/* Modern desk console panel */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.2, 0.6, 0.6]} />
          <meshStandardMaterial color="#111115" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Floating monitors & charts setup (trading room theme) */}
        <group
          ref={tradingScreenRef}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentZone('internship');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredYesPanchi(true);
          }}
          onPointerOut={() => setHoveredYesPanchi(false)}
          data-cursor-text="VIEW YESPANCHI INTERN"
        >
          {/* Glowing console desk accent */}
          <pointLight color="#00ff99" intensity={hoveredYesPanchi ? 3 : 1} distance={3} />

          {/* Main Floating Trading Monitor (Center) */}
          <group position={[0, 0.2, 0.1]}>
            <mesh>
              <planeGeometry args={[1.0, 0.55]} />
              <meshPhysicalMaterial
                color="#050a08"
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Line
              points={[
                [-0.5, -0.275, 0.001], [0.5, -0.275, 0.001], [0.5, 0.275, 0.001], [-0.5, 0.275, 0.001], [-0.5, -0.275, 0.001]
              ]}
              color="#00ff99"
              lineWidth={1.5}
            />
            {/* Watchlist & Charts labels */}
            <Text
              position={[0, 0.2, 0.002]}
              fontSize={0.045}
              font="/Orbitron.woff"
              color="#00ff99"
            >
              KITE WORKSPACE
            </Text>
            <Text
              position={[-0.32, 0.05, 0.002]}
              fontSize={0.03}
              font="/Orbitron.woff"
              color="#ffffff"
              anchorX="left"
            >
              NIFTY  +1.44%
            </Text>
            <Text
              position={[-0.32, -0.05, 0.002]}
              fontSize={0.03}
              font="/Orbitron.woff"
              color="#ff0055"
              anchorX="left"
            >
              RELIANCE  -0.85%
            </Text>
            <Text
              position={[-0.32, -0.15, 0.002]}
              fontSize={0.03}
              font="/Orbitron.woff"
              color="#00ff99"
              anchorX="left"
            >
              ZEB  +5.82%
            </Text>

            {/* Candlestick charts inside the screen */}
            <group position={[0.15, -0.05, 0.01]}>
              {[0, 0.06, 0.12, 0.18, 0.24].map((x, idx) => {
                const isGreen = idx % 2 === 0;
                return (
                  <mesh
                    key={idx}
                    ref={addToCandles}
                    position={[x, 0, 0]}
                  >
                    <boxGeometry args={[0.03, 0.08, 0.01]} />
                    <meshBasicMaterial color={isGreen ? "#00ff99" : "#ff0055"} />
                  </mesh>
                );
              })}
            </group>
          </group>

          {/* Left Tilted Monitor (Dashboard info) */}
          <group position={[-0.7, 0.25, 0.25]} rotation={[0, Math.PI / 6, 0]}>
            <mesh>
              <planeGeometry args={[0.6, 0.4]} />
              <meshBasicMaterial color="#020503" side={THREE.DoubleSide} />
            </mesh>
            <Line
              points={[
                [-0.3, -0.2, 0.001], [0.3, -0.2, 0.001], [0.3, 0.2, 0.001], [-0.3, 0.2, 0.001], [-0.3, -0.2, 0.001]
              ]}
              color="#00f0ff"
              lineWidth={1}
            />
            <Text
              position={[0, 0.13, 0.002]}
              fontSize={0.035}
              font="/Orbitron.woff"
              color="#00f0ff"
            >
              DASHBOARD
            </Text>
            <Text
              position={[0, 0, 0.002]}
              fontSize={0.022}
              color="#ffffff"
              maxWidth={0.5}
            >
              Scalable components redesigned for responsive viewports.
            </Text>
          </group>

          {/* Right Tilted Monitor (Code snippet terminal) */}
          <group position={[0.7, 0.25, 0.25]} rotation={[0, -Math.PI / 6, 0]}>
            <mesh>
              <planeGeometry args={[0.6, 0.4]} />
              <meshBasicMaterial color="#020305" side={THREE.DoubleSide} />
            </mesh>
            <Line
              points={[
                [-0.3, -0.2, 0.001], [0.3, -0.2, 0.001], [0.3, 0.2, 0.001], [-0.3, 0.2, 0.001], [-0.3, -0.2, 0.001]
              ]}
              color="#a855f7"
              lineWidth={1}
            />
            <Text
              position={[0, 0.13, 0.002]}
              fontSize={0.035}
              font="/Orbitron.woff"
              color="#a855f7"
            >
              REACT CODE
            </Text>
            <Text
              position={[-0.25, 0.02, 0.002]}
              fontSize={0.016}
              font="/Orbitron.woff"
              color="#00ff99"
              anchorX="left"
            >
              {"const Trade = () => {"}
            </Text>
            <Text
              position={[-0.25, -0.03, 0.002]}
              fontSize={0.016}
              font="/Orbitron.woff"
              color="#00ff99"
              anchorX="left"
            >
              {"  return <KiteDash />;"}
            </Text>
            <Text
              position={[-0.25, -0.08, 0.002]}
              fontSize={0.016}
              font="/Orbitron.woff"
              color="#00ff99"
              anchorX="left"
            >
              {"}; export default Trade;"}
            </Text>
          </group>
        </group>

        {/* Floating text headers */}
        <Float speed={2} floatIntensity={0.25}>
          <group position={[0, 2.1, 0]}>
            <Text
              fontSize={0.16}
              font="/Orbitron.woff"
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              FULL STACK INTERN
            </Text>
            <Text
              position={[0, -0.25, 0]}
              fontSize={0.12}
              color="#00ff99"
              anchorX="center"
              anchorY="middle"
            >
              YESPANCHI
            </Text>
          </group>
        </Float>
      </group>
    </group>
  );
};
export default InternshipOffice;

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

interface TechItem {
  name: string;
  usage: string;
}

interface BuildingProps {
  position: [number, number, number];
  height: number;
  width: number;
  depth: number;
  color: string;
  glowColor: string;
  category: string;
  githubUrl: string;
  figmaUrl: string;
  techStack: TechItem[];
  onClick: () => void;
}

const Building: React.FC<BuildingProps> = ({ 
  position, height, width, depth, color, glowColor, category, 
  githubUrl, figmaUrl, techStack, onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth hover scaling and height adjustment
    const targetScaleY = hovered ? 1.08 : 1.0;
    const targetScaleXZ = hovered ? 1.05 : 1.0;
    
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, 0.1);
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScaleXZ, 0.1);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScaleXZ, 0.1);

    // Gently float up and down when hovered
    if (hovered) {
      meshRef.current.position.y = position[1] + Math.sin(time * 6) * 0.05 + (height * targetScaleY - height) / 2;
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
    }
  });

  // Calculate building frame coordinates for wireframe overlay
  const hw = width / 2;
  const hd = depth / 2;
  const h = height;

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Semi-transparent Glass Skyscraper Body */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        data-cursor-text="OPEN PROJECTS"
      >
        <boxGeometry args={[width, height, depth]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
          thickness={1.5}
          transparent
          opacity={0.4}
        />
        
        {/* Glow inner light core */}
        <pointLight color={glowColor} intensity={hovered ? 3.0 : 0.8} distance={3} />
      </mesh>

      {/* Cyber edge wireframes */}
      <Line
        points={[
          [-hw, 0, -hd], [-hw, h, -hd], [hw, h, -hd], [hw, 0, -hd], [-hw, 0, -hd],
          [-hw, 0, hd], [-hw, h, hd], [hw, h, hd], [hw, 0, hd], [-hw, 0, hd],
        ]}
        color={glowColor}
        lineWidth={hovered ? 2.5 : 1}
      />
      <Line
        points={[
          [-hw, h, -hd], [-hw, h, hd],
          [hw, h, -hd], [hw, h, hd],
        ]}
        color={glowColor}
        lineWidth={hovered ? 2.5 : 1}
      />

      {/* Interactive Technology Wall (Front Face of the Skyscraper) */}
      <Html
        transform
        position={[0, height / 2, depth / 2 + 0.02]}
        rotation={[0, 0, 0]}
        distanceFactor={2.2}
        pointerEvents="auto"
      >
        <div 
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/85 border select-none backdrop-blur-md transition-all duration-300"
          style={{ width: '160px', borderColor: `${glowColor}33`, boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 15px ${glowColor}11` }}
        >
          <div className="text-[7px] font-bold font-orbitron tracking-widest text-white/40 mb-1.5 uppercase">
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="relative group px-1.5 py-0.5 rounded border bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-[7px] font-orbitron cursor-help"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                {tech.name}
                {/* Hover Tooltip */}
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-1.5 rounded bg-black/95 border text-white text-[7px] tracking-normal font-sans leading-snug w-28 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl"
                  style={{ borderColor: glowColor }}
                >
                  <div className="font-orbitron font-bold text-[7px] mb-0.5" style={{ color: glowColor }}>
                    {tech.name}
                  </div>
                  {tech.usage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Html>

      {/* Floating View GitHub & View Figma Buttons above the Building */}
      <Html
        position={[0, height + 0.9, 0]}
        center
        distanceFactor={3}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col gap-1 items-center select-none" style={{ minWidth: '100px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(githubUrl, '_blank');
            }}
            className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded bg-[#09090b]/90 border border-white/15 hover:border-cyan-400 hover:bg-[#18181b] text-white text-[8px] font-orbitron font-bold tracking-wider transition-all shadow-lg cursor-pointer hover:scale-105"
          >
            <span>💻 View GitHub</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(figmaUrl, '_blank');
            }}
            className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded bg-[#09090b]/90 border border-white/15 hover:border-cyan-400 hover:bg-[#18181b] text-white text-[8px] font-orbitron font-bold tracking-wider transition-all shadow-lg cursor-pointer hover:scale-105"
          >
            <span>🎨 View Figma</span>
          </button>
        </div>
      </Html>

      {/* Futuristic Floating Billboard Text above skyscraper */}
      <Float speed={2} floatIntensity={0.2}>
        <Text
          position={[0, height + 1.4, 0]}
          fontSize={0.22}
          font="/Orbitron.woff"
          color={glowColor}
          anchorX="center"
          anchorY="middle"
        >
          {category}
        </Text>
      </Float>
    </group>
  );
};

export const ProjectDistrict: React.FC = () => {
  const { setCurrentZone, collectGem, collectedGems } = usePortfolio();
  const [hoveredGem, setHoveredGem] = useState(false);
  const [gemClicked, setGemClicked] = useState(false);

  return (
    <group position={[-8, 0, 0]}>
      {/* Grid District Base */}
      <gridHelper args={[8, 8, '#a855f7', '#1a1a1a']} position={[0, -0.19, 0]} />
      <Line
        points={[
          [-4, -0.2, -4], [4, -0.2, -4], [4, -0.2, 4], [-4, -0.2, 4], [-4, -0.2, -4]
        ]}
        color="#a855f7"
        lineWidth={1.5}
        opacity={0.3}
        transparent
      />

      {/* Building 1: Web Dev (Left, Cyan Glow) */}
      <Building
        position={[-2.2, 0, -1.8]}
        height={2.2}
        width={1.2}
        depth={1.2}
        color="#081e2b"
        glowColor="#00f0ff"
        category="WEB"
        githubUrl="https://github.com/abinayaramothil/shopsphere"
        figmaUrl="https://www.figma.com/design/cpwZMiFyTGzZOuuo7aPktG/Website-Design?node-id=0-1&t=mYJWjOaJy7tIO33G-1"
        techStack={[
          { name: 'React', usage: 'Frontend UI component design' },
          { name: 'Node.js', usage: 'Backend REST API runner' },
          { name: 'Express', usage: 'API Routing & middlewares' },
          { name: 'MySQL', usage: 'Database for user/product tables' },
          { name: 'Redis', usage: 'In-memory cart status caching' },
          { name: 'JWT', usage: 'Stateless session authentication' }
        ]}
        onClick={() => setCurrentZone('projects')}
      />

      {/* Building 2: AI & ML (Center-Right, Purple Glow) */}
      <Building
        position={[2.0, 0, -1.0]}
        height={3.0}
        width={1.4}
        depth={1.4}
        color="#1f0933"
        glowColor="#a855f7"
        category="AI / ML"
        githubUrl="https://github.com/abinayaramothil/shopsphere"
        figmaUrl="https://www.figma.com/design/0ys8niM9Bggbp9ofu70Ylr/HRMS-Webpage?node-id=0-1&t=z3eafL1QNnRrcLqX-1"
        techStack={[
          { name: 'React', usage: 'AI recommendation dashboards' },
          { name: 'Python', usage: 'Data analysis and modeling' },
          { name: 'LangChain', usage: 'Orchestrating text search layers' },
          { name: 'OpenAI API', usage: 'Vector embeddings generation' },
          { name: 'ChromaDB', usage: 'High-speed search vector storage' }
        ]}
        onClick={() => setCurrentZone('projects')}
      />

      {/* Building 3: UI/UX & Designs (Front-Left, Neon Blue Glow) */}
      <Building
        position={[-1.2, 0, 2.0]}
        height={1.6}
        width={1.1}
        depth={1.1}
        color="#051e1e"
        glowColor="#0077ff"
        category="UI/UX"
        githubUrl="https://github.com/abdiel-samuel"
        figmaUrl="https://www.figma.com/design/w0s9jyjOm6eLtT0eAjTjPU/Untitled?node-id=0-1&t=4l6XqKVf4mB3nkrk-1"
        techStack={[
          { name: 'Figma', usage: 'System wireframes & hi-fi mockups' },
          { name: 'Prototyping', usage: 'Dynamic click-through flows' },
          { name: 'Wireframing', usage: 'Information structure mapping' },
          { name: 'Design Systems', usage: 'Typography & button libraries' }
        ]}
        onClick={() => setCurrentZone('projects')}
      />

      {/* Building 4: Desktop Apps (Front-Right, Green Glow) */}
      <Building
        position={[1.8, 0, 2.2]}
        height={1.8}
        width={1.0}
        depth={1.0}
        color="#072419"
        glowColor="#00ff99"
        category="DESKTOP"
        githubUrl="https://github.com/abinayaramothil/BloodBank"
        figmaUrl="https://www.figma.com/design/1aUHivePnL1ekFMBJQByet/Plants-Health-Tracker?node-id=0-1&t=jfI2ZoX4WqTAtmDv-1"
        techStack={[
          { name: 'React', usage: 'Patient/donor coordination panels' },
          { name: 'Spring Boot', usage: 'Secure Java enterprise backend' },
          { name: 'Spring Security', usage: 'Role-based access controllers' },
          { name: 'MongoDB', usage: 'Flexible logs & request data store' },
          { name: 'JWT', usage: 'API endpoints validation tokens' },
          { name: 'Docker', usage: 'Local container environment setup' },
          { name: 'Render', usage: 'Production portal cloud service' },
          { name: 'JavaMail', usage: 'Automated urgent dispatch alerts' }
        ]}
        onClick={() => setCurrentZone('projects')}
      />

      {/* Floating Category Portal / Centerpiece */}
      <Float speed={4} floatIntensity={0.5}>
        <mesh position={[0, 1.2, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#a855f7" roughness={0.2} metalness={0.8} />
          <pointLight color="#a855f7" intensity={2} distance={4} />
        </mesh>
      </Float>

      {/* EASTER EGG: Hidden Hologram Gem #2 */}
      {!collectedGems.includes(2) && !gemClicked && (
        <Float speed={5} floatIntensity={1} rotationIntensity={1.5}>
          <mesh
            position={[3.0, 1.6, 2.5]}
            onPointerOver={() => setHoveredGem(true)}
            onPointerOut={() => setHoveredGem(false)}
            onClick={() => {
              setGemClicked(true);
              collectGem(2);
            }}
            data-cursor-text="COLLECT GEM"
          >
            <octahedronGeometry args={[0.15]} />
            <meshBasicMaterial
              color={hoveredGem ? "#00ff99" : "#a855f7"}
              wireframe
            />
            {/* Pulsing ring around gem */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.25, 0.28, 16]} />
              <meshBasicMaterial color="#a855f7" opacity={0.4} transparent />
            </mesh>
          </mesh>
        </Float>
      )}
    </group>
  );
};
export default ProjectDistrict;

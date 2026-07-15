import React from 'react';
import { Line } from '@react-three/drei';
import { HomeBase } from './HomeBase';
import { ProjectDistrict } from './ProjectDistrict';
import { SkillsIsland } from './SkillsIsland';
import { EducationCampus } from './EducationCampus';
import { InternshipOffice } from './InternshipOffice';
import { Communities } from './Communities';
import { AchievementsHall } from './AchievementsHall';
import { ContactObservatory } from './ContactObservatory';
import { UIUXStudio } from './UIUXStudio';

export const World: React.FC = () => {
  // Center grid pathway lines connecting the floating sectors in symmetrical grid
  const pathLines = [
    // Pathway to Projects (Left)
    { points: [[0, -0.2, 0], [-8, -0.2, 0]], color: '#a855f7' },
    // Pathway to Skills (Right)
    { points: [[0, -0.2, 0], [8, -0.2, 0]], color: '#00ff99' },
    // Pathway to Internship (Back-Left)
    { points: [[0, -0.2, 0], [-8, -0.2, -8]], color: '#ff8800' },
    // Pathway to Education (Back-Center-Left)
    { points: [[0, -0.2, 0], [-4, -0.2, -8]], color: '#0077ff' },
    // Pathway to Communities (Back-Center-Right)
    { points: [[0, -0.2, 0], [4, -0.2, -8]], color: '#ff0055' },
    // Pathway to Achievements (Back-Right)
    { points: [[0, -0.2, 0], [8, -0.2, -8]], color: '#a855f7' },
    // Pathway to UI/UX Studio (Deep Back Center)
    { points: [[0, -0.2, -8], [0, -0.2, -14]], color: '#a855f7' },
    // Cross-link: Education to UI/UX Studio
    { points: [[-4, -0.2, -8], [0, -0.2, -14]], color: '#0077ff' },
    // Cross-link: Communities to UI/UX Studio
    { points: [[4, -0.2, -8], [0, -0.2, -14]], color: '#ff0055' },
    // Pathway to Contact Observatory (Front)
    { points: [[0, -0.2, 0], [0, -0.2, 8]], color: '#00f0ff' }
  ];

  return (
    <group>
      {/* Visual neon highway paths connecting the islands */}
      {pathLines.map((line, idx) => (
        <Line
          key={idx}
          points={line.points as [number, number, number][]}
          color={line.color}
          lineWidth={2.5}
          opacity={0.4}
          transparent
        />
      ))}

      {/* Grid center hub accent ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.19, 0]}>
        <ringGeometry args={[1.5, 1.55, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.5} transparent />
      </mesh>

      {/* Render the individual sectors */}
      <HomeBase />
      <ProjectDistrict />
      <SkillsIsland />
      <EducationCampus />
      <InternshipOffice />
      <Communities />
      <AchievementsHall />
      <ContactObservatory />
      <UIUXStudio />
    </group>
  );
};
export default World;

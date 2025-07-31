import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const OfficeEnvironment = () => {
  const floorRef = useRef();
  const wallsRef = useRef();

  useFrame((state) => {
    // Subtle breathing animation for the environment
    if (floorRef.current) {
      floorRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group>
      {/* Floor */}
      <Plane
        ref={floorRef}
        args={[40, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.8, 0]}
        receiveShadow
      >
        <meshLambertMaterial
          color="#f1f5f9"
          map={createFloorTexture()}
        />
      </Plane>

      {/* Walls */}
      <group ref={wallsRef}>
        {/* Back Wall */}
        <Plane
          args={[40, 15]}
          position={[0, 6.5, -10]}
          receiveShadow
        >
          <meshLambertMaterial color="#e2e8f0" />
        </Plane>

        {/* Left Wall */}
        <Plane
          args={[20, 15]}
          position={[-20, 6.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <meshLambertMaterial color="#f8fafc" />
        </Plane>

        {/* Right Wall */}
        <Plane
          args={[20, 15]}
          position={[20, 6.5, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <meshLambertMaterial color="#f8fafc" />
        </Plane>
      </group>

      {/* Ceiling */}
      <Plane
        args={[40, 40]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 14, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      {/* Reception Counter */}
      <ReceptionCounter />

      {/* Columns */}
      <Columns />

      {/* Lighting Fixtures */}
      <LightingFixtures />

      {/* Office Furniture */}
      <OfficeFurniture />
    </group>
  );
};

const ReceptionCounter = () => {
  return (
    <group position={[0, 0, -6]}>
      {/* Main Counter */}
      <RoundedBox
        args={[8, 1.2, 2]}
        position={[0, 0.6, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#8b5a3c" roughness={0.3} metalness={0.1} />
      </RoundedBox>

      {/* Counter Base */}
      <Box
        args={[8.2, 0.8, 2.2]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#6b4423" />
      </Box>

      {/* Oriental Insurance Logo on Counter */}
      <Box
        args={[1.5, 0.8, 0.1]}
        position={[0, 1.3, 1]}
        castShadow
      >
        <meshStandardMaterial color="#1e3a8a" />
      </Box>
    </group>
  );
};

const Columns = () => {
  const columnPositions = [
    [-15, 7, -5],
    [15, 7, -5],
    [-15, 7, 5],
    [15, 7, 5]
  ];

  return (
    <group>
      {columnPositions.map((position, index) => (
        <Box
          key={index}
          args={[1, 14, 1]}
          position={position}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
      ))}
    </group>
  );
};

const LightingFixtures = () => {
  const lightPositions = [
    [0, 12, -3],
    [-8, 12, 0],
    [8, 12, 0],
    [0, 12, 3]
  ];

  return (
    <group>
      {lightPositions.map((position, index) => (
        <RoundedBox
          key={index}
          args={[2, 0.3, 2]}
          position={position}
          castShadow
        >
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffcc"
            emissiveIntensity={0.2}
          />
        </RoundedBox>
      ))}
    </group>
  );
};

const OfficeFurniture = () => {
  return (
    <group>
      {/* Seating Area */}
      <group position={[-10, 0, 2]}>
        {/* Chairs */}
        {[0, 2, 4].map((x, index) => (
          <RoundedBox
            key={index}
            args={[1.5, 1, 1.5]}
            position={[x, 0.5, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#1e40af" />
          </RoundedBox>
        ))}
      </group>

      {/* Coffee Table */}
      <RoundedBox
        args={[3, 0.4, 1.5]}
        position={[-9, 0.2, 4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#8b5a3c" />
      </RoundedBox>

      {/* Plant */}
      <group position={[12, 0, 2]}>
        {/* Pot */}
        <Box
          args={[1, 1, 1]}
          position={[0, 0.5, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#4a5568" />
        </Box>
        {/* Plant leaves */}
        <Box
          args={[2, 3, 2]}
          position={[0, 2.5, 0]}
          castShadow
        >
          <meshStandardMaterial color="#22c55e" />
        </Box>
      </group>
    </group>
  );
};

// Helper function to create floor texture
const createFloorTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  // Create a subtle tile pattern
  context.fillStyle = '#f1f5f9';
  context.fillRect(0, 0, 256, 256);
  
  context.strokeStyle = '#e2e8f0';
  context.lineWidth = 2;
  
  // Draw grid lines
  for (let i = 0; i <= 256; i += 32) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, 256);
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(256, i);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  
  return texture;
};

export default OfficeEnvironment;

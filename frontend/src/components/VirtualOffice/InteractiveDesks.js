import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const InteractiveDesks = ({ onDeskClick, selectedDesk }) => {
  const desks = [
    {
      id: 'policy',
      name: 'Policy Desk',
      position: [-6, 0, 2],
      color: '#ef4444',
      icon: '📋',
      description: 'Manage your insurance policies'
    },
    {
      id: 'claim',
      name: 'Claim Desk',
      position: [0, 0, 2],
      color: '#3b82f6',
      icon: '📝',
      description: 'Register and track claims'
    },
    {
      id: 'grievance',
      name: 'Grievance Desk',
      position: [6, 0, 2],
      color: '#8b5cf6',
      icon: '🎧',
      description: 'Support and grievance handling'
    }
  ];

  return (
    <group>
      {desks.map((desk) => (
        <Desk
          key={desk.id}
          desk={desk}
          onDeskClick={onDeskClick}
          isSelected={selectedDesk === desk.id}
        />
      ))}
    </group>
  );
};

const Desk = ({ desk, onDeskClick, isSelected }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating effect when selected or hovered
      if (isSelected || hovered) {
        meshRef.current.position.y = desk.position[1] + 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          desk.position[1] + 0.5,
          0.1
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          0,
          0.1
        );
      }

      // Glow effect
      if (isSelected) {
        meshRef.current.material.emissiveIntensity = 0.3;
      } else if (hovered) {
        meshRef.current.material.emissiveIntensity = 0.1;
      } else {
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  const handleClick = () => {
    onDeskClick(desk.id);
  };

  const handlePointerEnter = () => {
    setHovered(true);
    setShowInfo(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setShowInfo(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={desk.position}>
      {/* Desk Base */}
      <RoundedBox
        args={[2, 0.1, 1.5]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#8b5a3c" />
      </RoundedBox>

      {/* Desk Top */}
      <RoundedBox
        ref={meshRef}
        args={[2.2, 1, 1.7]}
        position={[0, 0.5, 0]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={desk.color}
          emissive={desk.color}
          emissiveIntensity={0}
          roughness={0.2}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Desk Label */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="#1e3a8a"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {desk.name}
      </Text>

      {/* Desk Icon */}
      <Text
        position={[0, 1.2, 0.9]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {desk.icon}
      </Text>

      {/* Hover Info */}
      {showInfo && (
        <Html position={[0, 2.5, 0]} center>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              minWidth: '150px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1e3a8a',
              marginBottom: '4px'
            }}>
              {desk.name}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#64748b'
            }}>
              {desk.description}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: '#9ca3af',
              marginTop: '4px'
            }}>
              Click to access
            </div>
          </motion.div>
        </Html>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <SelectionIndicator position={[0, 0.5, 0]} color={desk.color} />
      )}

      {/* Interactive Glow */}
      {(hovered || isSelected) && (
        <InteractiveGlow position={[0, 0.5, 0]} color={desk.color} />
      )}
    </group>
  );
};

const SelectionIndicator = ({ position, color }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.05, 8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

const InteractiveGlow = ({ position, color }) => {
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={glowRef} position={position}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.1}
      />
    </mesh>
  );
};

export default InteractiveDesks;

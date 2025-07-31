import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, RoundedBox, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const VirtualAssistant = ({ position, onInteraction }) => {
  const meshRef = useRef();
  const [isAnimating, setIsAnimating] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Gentle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = () => {
    setShowWelcome(false);
    onInteraction();
    setIsAnimating(false);
    
    // Resume animation after interaction
    setTimeout(() => {
      setIsAnimating(true);
    }, 3000);
  };

  return (
    <group position={position}>
      {/* Assistant Body */}
      <group ref={meshRef} onClick={handleClick}>
        {/* Head */}
        <Sphere args={[0.8]} position={[0, 2.5, 0]} castShadow>
          <meshStandardMaterial
            color="#fbbf24"
            roughness={0.2}
            metalness={0.1}
            emissive="#fbbf24"
            emissiveIntensity={0.1}
          />
        </Sphere>

        {/* Body */}
        <RoundedBox args={[1.2, 2, 0.8]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial
            color="#1e3a8a"
            roughness={0.3}
            metalness={0.2}
          />
        </RoundedBox>

        {/* Arms */}
        <RoundedBox args={[0.3, 1.5, 0.3]} position={[-0.8, 1.2, 0]} castShadow>
          <meshStandardMaterial color="#1e3a8a" />
        </RoundedBox>
        <RoundedBox args={[0.3, 1.5, 0.3]} position={[0.8, 1.2, 0]} castShadow>
          <meshStandardMaterial color="#1e3a8a" />
        </RoundedBox>

        {/* Eyes */}
        <Sphere args={[0.15]} position={[-0.25, 2.6, 0.7]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.15]} position={[0.25, 2.6, 0.7]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>

        {/* Eye pupils */}
        <Sphere args={[0.08]} position={[-0.25, 2.6, 0.8]} castShadow>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.08]} position={[0.25, 2.6, 0.8]} castShadow>
          <meshStandardMaterial color="#000000" />
        </Sphere>

        {/* Smile */}
        <Box args={[0.5, 0.05, 0.05]} position={[0, 2.2, 0.75]} castShadow>
          <meshStandardMaterial color="#000000" />
        </Box>
      </group>

      {/* Welcome Message */}
      {showWelcome && (
        <Html position={[0, 4, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '15px 20px',
              borderRadius: '15px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              minWidth: '200px',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e3a8a',
              marginBottom: '5px'
            }}>
              👋 Hello! How can I assist you today?
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#64748b'
            }}>
              Click on me to start a conversation
            </div>
          </motion.div>
        </Html>
      )}

      {/* Name Tag */}
      <Text
        position={[0, 0.2, 1]}
        fontSize={0.3}
        color="#1e3a8a"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Virtual Assistant
      </Text>

      {/* Holographic Effect */}
      <HolographicEffect position={[0, 1.5, 0]} />
    </group>
  );
};

const HolographicEffect = ({ position }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 2;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.05, 8, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
};

const FloatingParticle = ({ index }) => {
  const particleRef = useRef();

  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime + index;
      particleRef.current.position.x = Math.cos(time * 2) * 2;
      particleRef.current.position.z = Math.sin(time * 2) * 2;
      particleRef.current.position.y = Math.sin(time * 3) * 0.5;
    }
  });

  return (
    <Sphere ref={particleRef} args={[0.05]}>
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
};

export default VirtualAssistant;

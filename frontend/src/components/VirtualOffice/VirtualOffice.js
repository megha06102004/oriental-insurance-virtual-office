import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Text,
  Html,
  useProgress
} from '@react-three/drei';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Components
import OfficeEnvironment from './OfficeEnvironment';
import VirtualAssistant from './VirtualAssistant';
import InteractiveDesks from './InteractiveDesks';
import OfficeUI from './OfficeUI';

const VirtualOfficeContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(248, 250, 252, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-direction: column;
`;

const LoadingText = styled.h3`
  color: #1e3a8a;
  margin-top: 20px;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(30, 58, 138, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  border-radius: 2px;
`;

const Loader = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <LoadingOverlay
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(30, 58, 138, 0.1)',
            borderTop: '3px solid #1e3a8a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <LoadingText>Loading Virtual Office...</LoadingText>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </ProgressBar>
          <p style={{ marginTop: '10px', color: '#64748b' }}>
            {Math.round(progress)}% Complete
          </p>
        </div>
      </LoadingOverlay>
    </Html>
  );
};

const VirtualOffice = ({ currentView, setCurrentView }) => {
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [showAssistant, setShowAssistant] = useState(true);
  const cameraRef = useRef();

  const handleDeskClick = (deskType) => {
    setSelectedDesk(deskType);
    setCurrentView(deskType);
  };

  const handleAssistantInteraction = () => {
    setShowAssistant(true);
  };

  return (
    <VirtualOfficeContainer>
      <CanvasContainer>
        <Canvas
          shadows
          camera={{
            position: [10, 8, 10],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            shadowMap: true,
            alpha: true
          }}
        >
          <Suspense fallback={<Loader />}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} />

            {/* Environment */}
            <Environment preset="city" />
            <ContactShadows
              position={[0, -0.8, 0]}
              opacity={0.4}
              scale={40}
              blur={1}
              far={9}
            />

            {/* Office Environment */}
            <OfficeEnvironment />

            {/* Interactive Desks */}
            <InteractiveDesks 
              onDeskClick={handleDeskClick}
              selectedDesk={selectedDesk}
            />

            {/* Virtual Assistant */}
            {showAssistant && (
              <VirtualAssistant 
                position={[0, 0, -2]}
                onInteraction={handleAssistantInteraction}
              />
            )}

            {/* Oriental Insurance Logo */}
            <Text
              position={[0, 6, -8]}
              fontSize={1.2}
              color="#1e3a8a"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              THE ORIENTAL INSURANCE
            </Text>
            <Text
              position={[0, 5, -8]}
              fontSize={0.8}
              color="#1e3a8a"
              anchorX="center"
              anchorY="middle"
            >
              COMPANY LTD.
            </Text>

            {/* Controls */}
            <OrbitControls
              ref={cameraRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={30}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate={false}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </CanvasContainer>

      {/* UI Overlay */}
      <OfficeUI 
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDesk={selectedDesk}
        setSelectedDesk={setSelectedDesk}
        onAssistantClick={handleAssistantInteraction}
      />
    </VirtualOfficeContainer>
  );
};

export default VirtualOffice;

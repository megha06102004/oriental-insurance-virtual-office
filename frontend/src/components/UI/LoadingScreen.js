import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Typography, Box, LinearProgress } from '@mui/material';

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: white;
  max-width: 500px;
  padding: 40px;
`;

const OrientalLogo = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 48px;
`;

const LoadingText = styled(Typography)`
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  margin-bottom: 10px !important;
  background: linear-gradient(45deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SubText = styled(Typography)`
  font-size: 1.1rem !important;
  opacity: 0.9;
  margin-bottom: 40px !important;
`;

const ProgressContainer = styled(Box)`
  width: 100%;
  margin-top: 30px;
`;

const FeatureList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
`;

const FeatureItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 20px;
  text-align: center;
  min-width: 120px;
`;

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: '🏢', text: '3D Virtual Office' },
    { icon: '🤖', text: 'AI Assistant' },
    { icon: '📋', text: 'Policy Management' },
    { icon: '🔔', text: 'Claim Processing' },
    { icon: '💬', text: 'Live Support' },
    { icon: '✨', text: 'Smooth Animations' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const featureTimer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 800);

    return () => clearInterval(featureTimer);
  }, []);

  return (
    <LoadingContainer
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      <LoadingContent>
        <OrientalLogo
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          🏢
        </OrientalLogo>

        <LoadingText variant="h2">
          Oriental Insurance
        </LoadingText>
        
        <SubText variant="h6">
          Virtual Office Experience
        </SubText>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
            Loading your immersive 3D office environment...
          </Typography>
        </motion.div>

        <ProgressContainer>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #ffffff, #e0e7ff)',
              },
            }}
          />
        </ProgressContainer>

        <FeatureList>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{
                opacity: currentFeature === index ? 1 : 0.6,
                scale: currentFeature === index ? 1.05 : 0.95,
              }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                {feature.icon}
              </div>
              <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                {feature.text}
              </Typography>
            </FeatureItem>
          ))}
        </FeatureList>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.7, 
              mt: 3,
              display: 'block',
              fontSize: '0.9rem'
            }}
          >
            Powered by React.js, Three.js & AI Technology
          </Typography>
        </motion.div>
      </LoadingContent>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </LoadingContainer>
  );
};

const FloatingParticle = ({ index }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '4px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeInOut",
      }}
    />
  );
};

export default LoadingScreen;

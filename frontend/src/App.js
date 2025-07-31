import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Components
import VirtualOffice from './components/VirtualOffice/VirtualOffice';
import Navbar from './components/Navigation/Navbar';
import LoadingScreen from './components/UI/LoadingScreen';
import ChatBot from './components/ChatBot/ChatBot';
import PolicyDesk from './components/Desks/PolicyDesk';
import ClaimDesk from './components/Desks/ClaimDesk';
import GrievanceDesk from './components/Desks/GrievanceDesk';
import SupportCenter from './components/Support/SupportCenter';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Oriental Insurance blue
      light: '#3b82f6',
      dark: '#1e40af',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('office');

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar currentView={currentView} setCurrentView={setCurrentView} />
          
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <VirtualOffice 
                    currentView={currentView} 
                    setCurrentView={setCurrentView} 
                  />
                } 
              />
              <Route path="/policies" element={<PolicyDesk />} />
              <Route path="/claims" element={<ClaimDesk />} />
              <Route path="/grievance" element={<GrievanceDesk />} />
              <Route path="/support" element={<SupportCenter />} />
            </Routes>
          </Suspense>

          {/* Floating ChatBot */}
          <ChatBot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

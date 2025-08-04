const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policies');
const claimRoutes = require('./routes/claims');
const grievanceRoutes = require('./routes/grievances');
const chatbotRoutes = require('./routes/chatbot');
const userRoutes = require('./routes/users');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Oriental Insurance Virtual Office API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes); // Removed auth middleware for public policy registration
app.use('/api/claims', auth, claimRoutes);
app.use('/api/grievances', auth, grievanceRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/users', auth, userRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle chat messages
  socket.on('chat-message', (data) => {
    // Process chatbot response
    const response = processChatbotMessage(data.message);
    socket.emit('chat-response', response);
  });

  // Handle office interactions
  socket.on('office-interaction', (data) => {
    socket.broadcast.emit('user-interaction', {
      userId: socket.id,
      action: data.action,
      location: data.location
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simple chatbot message processor
function processChatbotMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('policy')) {
    return {
      message: "I can help you with policy-related queries. You can view your existing policies, get policy information, renew policies, or purchase new ones.",
      quickActions: ["View My Policies", "Policy Information", "Renew Policy", "Buy New Policy"]
    };
  } else if (lowerMessage.includes('claim')) {
    return {
      message: "I can assist you with claim registration and tracking. Whether you need to file a new claim or check the status of an existing one, I'm here to help.",
      quickActions: ["Register New Claim", "Track Existing Claim", "Claim Documents", "Claim Process Guide"]
    };
  } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
    return {
      message: "Our support team is here to help you with any questions or concerns. You can get assistance with grievances, technical issues, or general inquiries.",
      quickActions: ["File Grievance", "Technical Support", "General Inquiry", "Contact Support Team"]
    };
  } else {
    return {
      message: "Thank you for contacting Oriental Insurance. How can I assist you today?",
      quickActions: ["View Policies", "Register Claim", "Get Support", "Contact Information"]
    };
  }
}

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Oriental Insurance Virtual Office API running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;

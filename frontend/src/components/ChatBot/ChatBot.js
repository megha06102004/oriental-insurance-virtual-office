import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import {
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Policy as PolicyIcon,
  Assignment as ClaimIcon,
  Support as SupportIcon
} from '@mui/icons-material';

// Import chatbot responses
import chatbotData from '../../data/chatbot-responses.json';

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
`;

const ChatWindow = styled(Paper)`
  width: 380px;
  height: 500px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled(Box)`
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatMessages = styled(Box)`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

const ChatInput = styled(Box)`
  padding: 16px;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MessageBubble = styled(motion.div)`
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  ${props => props.isUser && `
    flex-direction: row-reverse;
  `}
`;

const MessageContent = styled(Box)`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: white;
    border-bottom-right-radius: 6px;
  ` : `
    background: rgba(255, 255, 255, 0.9);
    color: #1e3a8a;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 6px;
  `}
`;

const QuickActions = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(chatbotData.welcome.message, chatbotData.welcome.quickActions);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (message, quickActions = []) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      isUser: false,
      timestamp: new Date(),
      quickActions
    }]);
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = (message = inputValue) => {
    if (!message.trim()) return;

    addUserMessage(message);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      processUserMessage(message);
    }, 1000 + Math.random() * 1000);
  };

  const processUserMessage = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = chatbotData.fallback;

    // Check for policy-related queries
    if (lowerMessage.includes('policy') || lowerMessage.includes('insurance')) {
      response = chatbotData.responses.policy;
    }
    // Check for claim-related queries
    else if (lowerMessage.includes('claim') || lowerMessage.includes('compensation')) {
      response = chatbotData.responses.claim;
    }
    // Check for support/grievance queries
    else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('grievance')) {
      response = chatbotData.responses.support;
    }
    // Check for greetings
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = chatbotData.responses.greeting;
    }
    // Check for thanks
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      response = chatbotData.responses.thanks;
    }

    addBotMessage(response.message, response.quickActions || []);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <ChatWindow elevation={10}>
              <ChatHeader>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                    <BotIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Oriental Assistant
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {isTyping ? 'Typing...' : 'Online'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </ChatHeader>

              <ChatMessages>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    isUser={message.isUser}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: message.isUser
                          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                          : 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                      }}
                    >
                      {message.isUser ? <PersonIcon /> : <BotIcon />}
                    </Avatar>
                    <Box>
                      <MessageContent isUser={message.isUser}>
                        <Typography variant="body2">
                          {message.text}
                        </Typography>
                      </MessageContent>
                      {message.quickActions && message.quickActions.length > 0 && (
                        <QuickActions>
                          {message.quickActions.map((action, index) => (
                            <Chip
                              key={index}
                              label={action}
                              size="small"
                              variant="outlined"
                              onClick={() => handleQuickAction(action)}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                  background: 'rgba(30, 58, 138, 0.1)',
                                }
                              }}
                            />
                          ))}
                        </QuickActions>
                      )}
                    </Box>
                  </MessageBubble>
                ))}
                
                {isTyping && (
                  <MessageBubble>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                      }}
                    >
                      <BotIcon />
                    </Avatar>
                    <MessageContent>
                      <TypingIndicator />
                    </MessageContent>
                  </MessageBubble>
                )}
                
                <div ref={messagesEndRef} />
              </ChatMessages>

              <ChatInput>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                    }
                  }}
                />
                <IconButton
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                    },
                    '&:disabled': {
                      background: '#e5e7eb',
                      color: '#9ca3af',
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </ChatInput>
            </ChatWindow>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Fab
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            background: isOpen
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            color: 'white',
            width: 64,
            height: 64,
            '&:hover': {
              background: isOpen
                ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                : 'linear-gradient(135deg, #1e40af, #2563eb)',
            }
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </motion.div>
    </ChatContainer>
  );
};

const TypingIndicator = () => (
  <Box display="flex" gap={0.5} alignItems="center">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#1e3a8a',
        }}
      />
    ))}
    <Typography variant="caption" sx={{ ml: 1, color: '#64748b' }}>
      Assistant is typing
    </Typography>
  </Box>
);

export default ChatBot;

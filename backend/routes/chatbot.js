const express = require('express');
const router = express.Router();

// Import chatbot data
const chatbotData = require('../data/chatbot-responses.json');

// Process chatbot message
router.post('/message', (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = processChatbotMessage(message.toLowerCase(), context);
    
    res.json({
      success: true,
      data: {
        message: response.message,
        quickActions: response.quickActions || [],
        timestamp: new Date().toISOString(),
        context: response.context || 'general'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing chatbot message',
      error: error.message
    });
  }
});

// Get chatbot suggestions
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = [
      'View my policies',
      'Register a new claim',
      'Check claim status',
      'Contact support',
      'Renew my policy',
      'Download policy document',
      'Find nearest branch',
      'Premium payment options'
    ];

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
});

// Get FAQ
router.get('/faq', (req, res) => {
  try {
    const faq = [
      {
        question: 'How do I register a claim?',
        answer: 'You can register a claim by visiting the Claims desk in our virtual office or calling our 24/7 helpline at 1800-118-485.',
        category: 'claims'
      },
      {
        question: 'What documents are required for motor claims?',
        answer: 'For motor claims, you need: Claim form, Policy copy, Driving license, RC copy, FIR (if applicable), and repair estimates.',
        category: 'claims'
      },
      {
        question: 'How can I renew my policy?',
        answer: 'You can renew your policy online through our website, mobile app, or by visiting any branch. You can also use our virtual office.',
        category: 'policies'
      },
      {
        question: 'What is the claim settlement process?',
        answer: 'After claim registration, we verify documents, conduct survey if needed, assess the damage, approve the claim, and process payment.',
        category: 'claims'
      },
      {
        question: 'How do I check my policy status?',
        answer: 'You can check your policy status in the Policy desk of our virtual office or by logging into your online account.',
        category: 'policies'
      }
    ];

    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQ',
      error: error.message
    });
  }
});

// Get chatbot capabilities
router.get('/capabilities', (req, res) => {
  try {
    const capabilities = {
      features: [
        'Policy information and management',
        'Claim registration and tracking',
        'Support and grievance handling',
        'Document assistance',
        'Contact information',
        'Branch locator',
        'Premium calculations',
        'FAQ and help'
      ],
      languages: ['English', 'Hindi'],
      availability: '24/7',
      responseTypes: ['text', 'quick-actions', 'documents', 'contact-info']
    };

    res.json({
      success: true,
      data: capabilities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching capabilities',
      error: error.message
    });
  }
});

// Function to process chatbot messages
function processChatbotMessage(message, context) {
  // Policy-related queries
  if (message.includes('policy') || message.includes('insurance')) {
    return chatbotData.responses.policy;
  }
  
  // Claim-related queries
  if (message.includes('claim') || message.includes('compensation') || message.includes('settlement')) {
    return chatbotData.responses.claim;
  }
  
  // Support/grievance queries
  if (message.includes('support') || message.includes('help') || message.includes('grievance') || message.includes('complaint')) {
    return chatbotData.responses.support;
  }
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
    return chatbotData.responses.greeting;
  }
  
  // Thanks
  if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
    return chatbotData.responses.thanks;
  }
  
  // Premium related
  if (message.includes('premium') || message.includes('payment') || message.includes('pay')) {
    return {
      message: "I can help you with premium payments. You can pay your premium online, through our mobile app, or visit any branch. Would you like me to guide you through the online payment process?",
      quickActions: ["Online Payment", "Payment Options", "Premium Calculator", "Payment History"]
    };
  }
  
  // Document related
  if (message.includes('document') || message.includes('download') || message.includes('certificate')) {
    return {
      message: "You can download various documents from your account. I can help you access policy documents, claim forms, certificates, and more.",
      quickActions: ["Policy Document", "Claim Forms", "Certificate", "ID Cards"]
    };
  }
  
  // Branch/contact related
  if (message.includes('branch') || message.includes('office') || message.includes('contact') || message.includes('address')) {
    return {
      message: "You can find our branch locations and contact information easily. Our head office is in New Delhi, and we have branches across India.",
      quickActions: ["Branch Locator", "Contact Numbers", "Head Office", "Email Support"]
    };
  }
  
  // Renewal related
  if (message.includes('renew') || message.includes('renewal') || message.includes('expire') || message.includes('expiry')) {
    return {
      message: "I can help you with policy renewals. You can renew your policy online, through our app, or visit any branch. Would you like me to check your policy renewal date?",
      quickActions: ["Renew Policy", "Check Expiry", "Renewal Benefits", "Online Renewal"]
    };
  }
  
  // Default fallback
  return chatbotData.fallback;
}

module.exports = router;

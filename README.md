# 🏢 Oriental Insurance Virtual Office

A modern, interactive web application that provides a comprehensive virtual office experience for Oriental Insurance Company Ltd. This full-stack application combines cutting-edge web technologies with intuitive design to deliver insurance services in an engaging digital environment.

## � Project Overview

The Oriental Insurance Virtual Office is an innovative web platform that transforms traditional insurance services into an immersive, user-friendly digital experience. The application features a realistic 3D office environment where users can access various insurance services through interactive elements.

## ✨ Key Features

### 🏗️ **Virtual Office Environment**
- **3D Office Space**: Realistic office with ceiling, floor, walls, and ambient lighting
- **Interactive Door**: Main entry point with smooth hover effects and animations
- **Professional Aesthetics**: Corporate branding with Oriental Insurance styling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔐 **Authentication System**
- **User Registration**: Secure account creation with validation
- **Login System**: JWT-based authentication
- **Social Login**: Integration with Google and Facebook
- **Session Management**: Persistent user sessions
- **Security**: Input validation and XSS protection

### 📋 **Insurance Services**

#### **Policy Management**
- View and manage active policies
- New policy registration
- Premium payment processing
- Coverage details and documentation
- Policy renewal notifications
- Document download capabilities

#### **Claims Processing**
- Submit new insurance claims
- Real-time claim status tracking
- Document and photo upload
- Damage assessment workflows
- Settlement processing
- Automated status updates

#### **Customer Support**
- Live chat integration
- Grievance submission system
- Comprehensive FAQ database
- Expert consultation scheduling
- Multi-language support
- Callback request system

### 🤖 **Virtual Assistant**
- **Interactive FAQ System**: 20+ pre-loaded questions and answers
- **Real-time Responses**: Instant policy-related guidance
- **Contextual Help**: Situation-specific assistance
- **Smart Chat Interface**: User-friendly conversation flow

## Tech Stack

- **Frontend**: React.js with Three.js for 3D rendering
- **Backend**: Node.js with Express
- **Database**: MySQL/PostgreSQL
- **AI Chatbot**: Custom JSON-based responses
- **Animation**: Framer Motion & CSS3

## Setup Instructions

1. Install dependencies for all modules:

```bash
npm run install-all
```

2. Start the development environment:

```bash
npm run dev
```

3. Open browser and navigate to `http://localhost:3000`

## Project Structure

```
oriental-virtual-office/
├── frontend/          # React.js application
├── backend/           # Node.js API server
├── database/          # SQL scripts and migrations
└── assets/           # 3D models, textures, images
```

## Features

- **Virtual Reception**: 3D animated receptionist
- **Interactive Desks**: Policy, Claim, and Grievance counters
- **Real-time Chat**: AI-powered customer support
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Engaging user experience

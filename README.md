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

#### **Enhanced Health Claims Processing**

**🔍 Customer Verification System**
- Policy number-based customer lookup
- Automatic customer detail fetching
- Medical history and policy validation
- Eligibility verification before claim submission

**📋 Comprehensive Claim Submission**
- Detailed health claim forms with medical information
- Treatment details, diagnosis, and procedure recording
- Hospital and doctor information capture
- Estimated amount calculation and validation

**👨‍⚕️ Automated Surveyor Assignment**
- Intelligent surveyor allocation based on specialization
- Real-time availability checking
- Experience and rating-based assignment
- Automatic workload balancing

**🏥 Hospital Survey Process**
- On-site medical verification by qualified surveyors
- Comprehensive medical document review
- Treatment validation and cost assessment
- Professional medical opinion and recommendations

**📊 Survey Report Management**
- Detailed survey findings and medical validation
- Recommendation system (approve/partial/reject)
- Estimated settlement amount calculation
- Medical board review integration

**⚡ Real-time Claim Processing**
- Automated status updates and timeline tracking
- Medical review and approval workflows
- Settlement processing and payment initiation
- Complete audit trail and documentation

**🔄 Complete Workflow Integration**
1. Customer verification via policy number
2. Detailed health claim submission
3. Automatic surveyor assignment
4. Hospital survey and assessment
5. Survey report submission
6. Medical review and approval decision
7. Settlement processing and payment

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

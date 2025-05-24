# Doctoro - Medical Appointment Booking System

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Implemented Features](#implemented-features)
4. [System Architecture](#system-architecture)
5. [Database Design](#database-design)
6. [Security Implementation](#security-implementation)
7. [Setup Guide](#setup-guide)

## Project Overview

Doctoro is a modern medical appointment booking system that streamlines the process of scheduling medical appointments. The system provides a three-way interface connecting patients, doctors, and administrators, with focus on reliability and ease of use.

### Core Functionalities
- Secure user authentication and role management
- Real-time appointment booking and management
- Doctor profile and availability management
- Email notifications for appointments
- Administrative oversight and control

## Tech Stack

### Frontend
- **React.js (18.x)**
  - Single-page application architecture
  - Component-based UI development
  - Context API for state management
  - React Router for navigation

- **Ant Design (5.x)**
  - Pre-built UI components
  - Responsive design system
  - Form handling
  - Data display components

### Backend
- **Node.js & Express.js**
  - RESTful API architecture
  - Middleware-based request handling
  - Error handling
  - Route management

- **MongoDB**
  - Document-based data storage
  - Mongoose ODM
  - Schema validation
  - Indexing for performance

### Additional Technologies
- **Redis**
  - Distributed locking for appointments
  - Rate limiting implementation

- **JWT**
  - Token-based authentication
  - Authorization management

- **Nodemailer**
  - Appointment confirmation emails
  - Test email support via Ethereal

## Implemented Features

### User System
1. **Authentication**
   - User registration and login
   - JWT-based session management
   - Password encryption with bcrypt
   - Role-based access (Patient/Doctor/Admin)

2. **Profile Management**
   - Basic user information
   - Doctor profile creation
   - Admin dashboard access

### Appointment System
1. **Booking Flow**
   - Date and time selection
   - Real-time availability checking
   - Conflict prevention with Redis locks
   - Email notifications
   - Appointment status tracking

2. **Doctor Features**
   - Appointment approval/rejection
   - Schedule management
   - View upcoming appointments
   - Patient appointment history

3. **Patient Features**
   - Browse available doctors
   - Book appointments
   - View appointment status
   - Appointment history

### Admin Features
1. **Doctor Management**
   - Approve/reject doctor applications
   - View all registered doctors
   - Monitor appointment system

2. **Notification System**
   - System notifications
   - Email notifications
   - Notification history

## System Architecture

### Frontend Structure
```
client/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── styles/         # CSS styles
│   ├── redux/          # State management
│   └── App.js          # Root component
```

### Backend Structure
```
├── controllers/        # Request handlers
├── models/            # Database schemas
├── routes/            # API routes
├── services/          # Business logic
├── middleware/        # Custom middleware
└── config/           # Configurations
```

## Database Design

### User Collection
```javascript
{
  name: String,
  email: String,
  password: String,
  isDoctor: Boolean,
  isAdmin: Boolean,
  notification: Array,
  seennotification: Array
}
```

### Doctor Collection
```javascript
{
  userId: String,
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  website: String,
  address: String,
  specialization: String,
  experience: String,
  feesPerCunsaltation: Number,
  timings: Object,
  status: String
}
```

### Appointment Collection
```javascript
{
  userId: String,
  doctorId: String,
  doctorInfo: String,
  userInfo: String,
  date: Date,
  status: String,
  time: String,
  chatId: String
}
```

## Security Implementation

1. **Authentication Security**
   - Secure password hashing (bcrypt)
   - JWT token management
   - Protected API routes

2. **Data Security**
   - Input validation
   - Rate limiting
   - Redis-based locking

3. **API Protection**
   - Authentication middleware
   - Role verification
   - Error handling

## Setup Guide

### Prerequisites
- Node.js (v14+)
- MongoDB
- Redis
- npm or yarn

### Environment Variables
```env
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url

# Optional Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
```

### Development Setup
1. Clone the repository
2. Install dependencies
   ```bash
   # Install frontend dependencies
   cd client && npm install

   # Install backend dependencies
   cd ../server && npm install
   ```

3. Start development servers
   ```bash
   # Start frontend
   cd client && npm start

   # Start backend
   cd server && npm run dev
   ```

### Email Testing
The system uses Ethereal Email for testing when SMTP credentials are not configured:
1. Email credentials are automatically generated
2. Check console for Ethereal login details
3. View test emails at ethereal.email

## Current Limitations
1. Chat system is limited to ID generation
2. Basic email templates
3. Limited doctor schedule customization
4. Basic notification system

## Planned Improvements
1. Enhanced doctor scheduling system
2. Advanced search and filtering
3. Improved email templates
4. Better error handling and validation
5. Enhanced user interface
6. More comprehensive admin dashboard 
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const admin = require('firebase-admin');
const path = require('path');
const { scheduleReminders, scheduleEducationalContent } = require('./scheduler');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Validate environment variables
const requiredEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN', 
  'TWILIO_PHONE_NUMBER',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
} catch (error) {
  console.error('Firebase initialization failed:', error);
  process.exit(1);
}

const db = admin.firestore();

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Input validation middleware
const validatePhone = (phone) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register user
app.post('/register', async (req, res) => {
  try {
    const { name, phone, dueDate } = req.body;
    
    // Validation
    if (!name || !phone || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, dueDate' });
    }
    
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use international format (e.g., +1234567890)' });
    }
    
    if (!validateDate(dueDate)) {
      return res.status(400).json({ error: 'Invalid due date format' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users')
      .where('phone', '==', phone)
      .get();
    
    if (!existingUser.empty) {
      return res.status(409).json({ error: 'User with this phone number already exists' });
    }
    
    // Create user
    const userData = {
      name: name.trim(),
      phone,
      dueDate,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    };
    
    const docRef = await db.collection('users').add(userData);
    
    res.status(201).json({ 
      message: 'User registered successfully!',
      userId: docRef.id,
      user: userData
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('isActive', '==', true).get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send reminder (call this endpoint manually or with a scheduler)
app.post('/send-reminders', async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('isActive', '==', true).get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (users.length === 0) {
      return res.json({ message: 'No active users found' });
    }
    
    const results = [];
    
    for (const user of users) {
      try {
        const message = `Hello ${user.name}! 👋\n\nRemember your next antenatal visit! 📅\nDue date: ${user.dueDate}\n\n💡 Health tips:\n• Eat healthy meals rich in iron and folic acid\n• Stay hydrated and get enough rest\n• Report any unusual symptoms to your health worker\n\nStay safe and healthy! ❤️`;
        
        const twilioMessage = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone,
        });
        
        // Log the message
        await db.collection('messages').add({
          userId: user.id,
          messageId: twilioMessage.sid,
          content: message,
          status: twilioMessage.status,
          sentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        results.push({ userId: user.id, status: 'sent', messageId: twilioMessage.sid });
        
      } catch (error) {
        console.error(`Failed to send message to ${user.phone}:`, error);
        results.push({ userId: user.id, status: 'failed', error: error.message });
      }
    }
    
    res.json({ 
      message: `Reminders processed for ${users.length} users`,
      results 
    });
    
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Educational content endpoint
app.get('/education', (req, res) => {
  res.json({
    tips: [
      {
        category: "Nutrition",
        tips: [
          "Eat a balanced diet rich in iron and folic acid",
          "Include plenty of fruits and vegetables",
          "Stay hydrated by drinking 8-10 glasses of water daily",
          "Avoid raw or undercooked foods"
        ]
      },
      {
        category: "Health Care",
        tips: [
          "Attend all antenatal visits regularly",
          "Report any unusual symptoms to your health worker",
          "Keep your environment clean to prevent infections",
          "Get adequate rest and sleep"
        ]
      },
      {
        category: "Exercise",
        tips: [
          "Engage in light physical activity as recommended",
          "Practice prenatal yoga or walking",
          "Avoid heavy lifting and strenuous activities",
          "Listen to your body and rest when needed"
        ]
      }
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      firebase: 'connected',
      twilio: 'configured'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Maternal Health SMS Server running on port ${PORT}`);
  console.log(`🌐 Web Interface: http://localhost:${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Education: http://localhost:${PORT}/education`);
  
  // Start scheduled tasks
  scheduleReminders();
  scheduleEducationalContent();
});
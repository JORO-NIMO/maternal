# Maternal and Child Health SMS App

A comprehensive SMS-based maternal health reminder system built with Node.js, Express, Twilio, and Firebase.

## 🚀 Features

- **User Registration**: Register pregnant women with name, phone, and due date
- **Automated SMS Reminders**: Send health reminders via Twilio
- **Educational Content**: Access maternal health tips and guidelines
- **User Management**: View and manage registered users
- **Message Logging**: Track all sent messages and their status
- **Health Monitoring**: System health check endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- Twilio Account (for SMS functionality)
- Firebase Project (for data storage)
- npm or yarn package manager

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd maternal
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to Project Settings > Service Accounts
4. Generate a new private key (JSON file)
5. Use the values from the JSON file in your `.env`

### 4. Twilio Setup

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number for sending SMS
4. Add these credentials to your `.env` file

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📱 API Endpoints

### User Management

#### Register User
```http
POST /register
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "dueDate": "2024-09-01"
}
```

#### Get All Users
```http
GET /users
```

### SMS Functionality

#### Send Reminders
```http
POST /send-reminders
```

### Educational Content

#### Get Health Tips
```http
GET /education
```

### System Health

#### Health Check
```http
GET /health
```

## 🔒 Security Notes

⚠️ **IMPORTANT**: Never commit your `.env` file or expose API keys publicly!

- Keep your Twilio and Firebase credentials secure
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your Twilio usage to avoid unexpected charges

## 📊 Database Schema

### Users Collection
```javascript
{
  name: string,
  phone: string,
  dueDate: string,
  createdAt: timestamp,
  isActive: boolean
}
```

### Messages Collection
```javascript
{
  userId: string,
  messageId: string,
  content: string,
  status: string,
  sentAt: timestamp
}
```

## 🚀 Deployment

### Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Vercel
1. Import your repository
2. Set environment variables
3. Deploy

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Future Enhancements

- [ ] Web dashboard for user management
- [ ] Automated scheduling with cron jobs
- [ ] Multi-language support
- [ ] Integration with health systems
- [ ] Analytics and reporting
- [ ] Mobile app companion
- [ ] Emergency contact system
- [ ] Appointment scheduling
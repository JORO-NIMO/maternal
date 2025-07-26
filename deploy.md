# Deployment Guide

## 🚀 Deployment Options

### 1. Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Git repository set up

#### Steps
1. **Create Heroku App**
   ```bash
   heroku create your-maternal-health-app
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set TWILIO_ACCOUNT_SID=your_twilio_account_sid
   heroku config:set TWILIO_AUTH_TOKEN=your_twilio_auth_token
   heroku config:set TWILIO_PHONE_NUMBER=your_twilio_phone_number
   heroku config:set FIREBASE_PROJECT_ID=your_firebase_project_id
   heroku config:set FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   heroku config:set FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

4. **Open App**
   ```bash
   heroku open
   ```

### 2. Railway Deployment

#### Steps
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically

### 3. Vercel Deployment

#### Steps
1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Set environment variables
4. Deploy

### 4. DigitalOcean App Platform

#### Steps
1. Go to DigitalOcean App Platform
2. Connect your repository
3. Configure environment variables
4. Deploy

## 🔧 Environment Variables

Make sure to set these environment variables in your deployment platform:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 📋 Pre-deployment Checklist

- [ ] All environment variables are set
- [ ] Firebase project is configured
- [ ] Twilio account is set up with a phone number
- [ ] Database is properly initialized
- [ ] All dependencies are in package.json
- [ ] .env file is in .gitignore
- [ ] No sensitive data is committed to repository

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Firebase Rules**: Set up proper security rules
3. **Twilio**: Monitor usage to avoid unexpected charges
4. **HTTPS**: Ensure your deployment uses HTTPS
5. **Rate Limiting**: Consider implementing rate limiting

## 📊 Monitoring

### Health Checks
- Set up health check endpoints
- Monitor application uptime
- Track error rates

### Logs
- Monitor application logs
- Set up error tracking (Sentry, etc.)
- Track API usage

### Performance
- Monitor response times
- Track database performance
- Monitor Twilio usage

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to Heroku
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🆘 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Check deployment platform settings
   - Verify variable names match exactly

2. **Firebase Connection Issues**
   - Verify service account credentials
   - Check Firebase project settings

3. **Twilio SMS Not Sending**
   - Verify phone number format
   - Check Twilio account balance
   - Verify phone number is verified (trial accounts)

4. **Port Issues**
   - Some platforms require specific port configuration
   - Check platform documentation

### Support
- Check platform-specific documentation
- Review application logs
- Test locally before deploying 
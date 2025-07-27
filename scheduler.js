const cron = require('node-cron');
const axios = require('axios');

// Schedule daily reminders at 9 AM
const scheduleReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('🕘 Running scheduled reminders...');
    try {
      const response = await axios.post('http://localhost:3000/send-reminders');
      console.log('✅ Scheduled reminders sent:', response.data);
    } catch (error) {
      console.error('❌ Failed to send scheduled reminders:', error.message);
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('📅 Daily reminders scheduled for 9:00 AM UTC');
};

// Schedule weekly educational content
const scheduleEducationalContent = () => {
  cron.schedule('0 10 * * 1', async () => { // Every Monday at 10 AM
    console.log('📚 Sending weekly educational content...');
    try {
      const response = await axios.get('http://localhost:3000/education');
      // Here you would implement logic to send educational content via SMS
      console.log('✅ Educational content retrieved:', response.data);
    } catch (error) {
      console.error('❌ Failed to get educational content:', error.message);
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('📅 Weekly educational content scheduled for Mondays at 10:00 AM UTC');
};

module.exports = {
  scheduleReminders,
  scheduleEducationalContent
}; 
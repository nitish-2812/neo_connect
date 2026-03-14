const cron = require('node-cron');
const Case = require('../models/Case');

const startEscalationJob = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const result = await Case.updateMany(
        {
          status: { $in: ['Assigned', 'In Progress'] },
          assignedAt: { $ne: null, $lte: sevenDaysAgo },
          updatedAt: { $lte: sevenDaysAgo }
        },
        {
          $set: { 
            status: 'Escalated', 
            escalatedAt: new Date() 
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`⚠️  Escalation: ${result.modifiedCount} case(s) escalated due to 7-day inactivity`);
      }
    } catch (error) {
      console.error('❌ Escalation job error:', error.message);
    }
  });
  
  console.log('⏰ Escalation cron job scheduled (runs daily at midnight)');
};

module.exports = startEscalationJob;

const logger = require('./logger');
const emailQueue = require('./queue');
const transport = require('../controllers/nodemailer');

// Process email sending jobs
emailQueue.process('sendEmail', async (job) => {
  const mailOptions = job.data;
  const info = await transport.sendMail(mailOptions);
  return { messageId: info.messageId };
});

// Queue event listeners
emailQueue.on('completed', (job, result) => {
  logger.info('Email job completed', { jobId: job.id, result });
});

emailQueue.on('failed', (job, err) => {
  logger.error('Email job failed', { jobId: job.id, error: err.message });
});

module.exports = emailQueue;

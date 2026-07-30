const cron = require('node-cron');
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const Alert = require('../models/Alert');
const SystemSettings = require('../models/SystemSettings');
const { dispatchAlertSms, sendReminderSms } = require('../services/smsService');

async function getSettings() {
  let settings = await SystemSettings.findOne();
  if (!settings) settings = await SystemSettings.create({});
  return settings;
}

async function sendReminders() {
  const settings = await getSettings();
  const now = new Date();
  const reminderWindowStart = new Date(now.getTime() + (settings.reminderMinutesBeforeReturn - 1) * 60000);
  const reminderWindowEnd = new Date(now.getTime() + settings.reminderMinutesBeforeReturn * 60000);

  const dueForReminder = await CheckIn.find({
    status: 'active',
    reminderSent: false,
    expectedReturnBy: { $gte: reminderWindowStart, $lte: reminderWindowEnd },
  });

  for (const checkIn of dueForReminder) {
    const farmer = await User.findById(checkIn.farmer);
    if (farmer) {
      await sendReminderSms(farmer.phone);
    }
    checkIn.reminderSent = true;
    await checkIn.save();
    console.log(`⏰ Reminder sent for check-in ${checkIn._id}`);
  }
}

async function detectOverdueCheckIns() {
  const settings = await getSettings();
  const now = new Date();

  const overdue = await CheckIn.find({
    status: 'active',
    expectedReturnBy: { $lte: new Date(now.getTime() - settings.gracePeriodMinutes * 60000) },
  }).populate('farmer');

  for (const checkIn of overdue) {
    const detectionStart = Date.now();

    checkIn.status = 'alert-sent';
    await checkIn.save();

    await User.findByIdAndUpdate(checkIn.farmer._id, { status: 'overdue' });

    const alert = await Alert.create({
      farmer: checkIn.farmer._id,
      checkIn: checkIn._id,
      type: 'timeout',
      gps: checkIn.gpsAtCheckIn,
      ward: checkIn.farmer.ward,
      recipients: [],
      detectionToAlertSeconds: Math.round((Date.now() - detectionStart) / 1000),
    });

    const recipients = await dispatchAlertSms(alert, checkIn.farmer);
    alert.recipients = recipients;
    await alert.save();

    console.log(`🚨 Timeout alert created + SMS dispatched for farmer ${checkIn.farmer._id} (checkIn ${checkIn._id})`);
  }
}

function startJobs() {
  cron.schedule('* * * * *', async () => {
    try {
      await sendReminders();
      await detectOverdueCheckIns();
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  });
  console.log('✅ Cron jobs scheduled (reminders + timeout detection, every minute)');
}

module.exports = { startJobs };

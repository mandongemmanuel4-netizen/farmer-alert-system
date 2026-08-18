const axios = require('axios');
const EmergencyContact = require('../models/EmergencyContact');
const User = require('../models/User');
const SecurityPost = require('../models/SecurityPost');

const TERMII_URL = 'https://api.ng.termii.com/api/sms/send';

function buildMessage(farmer, type, gps) {
  const mapsLink = `https://maps.google.com/?q=${gps.lat},${gps.lng}`;
  const kind = type === 'panic' ? 'PANIC ALERT' : 'MISSED CHECK-OUT ALERT';
  return (
    `FSDAMS ${kind}: ${farmer.fullName} (${farmer.phone}) may be in danger. ` +
    `Last known location: ${mapsLink}. Please respond immediately.`
  );
}

function normalizeNigerianNumber(phone) {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  return '234' + digits;
}

async function sendOneSms(phone, message) {
  try {
    const res = await axios.post(TERMII_URL, {
      to: normalizeNigerianNumber(phone),
      from: process.env.TERMII_SENDER_ID || 'Termii',
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: process.env.TERMII_API_KEY,
    });
    // Termii's real success response looks like:
    // { code: "ok", message_id: "...", message: "Successfully Sent", balance: N, user: "..." }
    // A message_id being present is the most reliable success signal.
    if (res.data && (res.data.code === 'ok' || res.data.message_id)) {
      return 'sent';
    }
    console.error(`SMS to ${phone} returned unexpected response:`, res.data);
    return 'failed';
  } catch (err) {
    console.error(`SMS to ${phone} failed:`, err.response?.data || err.message);
    return 'failed';
  }
}

async function dispatchAlertSms(alertDoc, farmer) {
  const recipients = [];
  const message = buildMessage(farmer, alertDoc.type, alertDoc.gps);

  const contacts = await EmergencyContact.find({ farmer: farmer._id });
  for (const c of contacts) {
    recipients.push({ name: c.name, phone: c.phone, kind: 'emergency-contact' });
  }

  if (farmer.ward) {
    const coordinator = await User.findOne({ role: 'coordinator', ward: farmer.ward });
    if (coordinator) {
      recipients.push({ name: coordinator.fullName, phone: coordinator.phone, kind: 'coordinator' });
    }
  }

  if (farmer.ward) {
    const post = await SecurityPost.findOne({ ward: farmer.ward });
    if (post) {
      recipients.push({ name: post.name, phone: post.phone, kind: 'security-post' });
    }
  }

  for (const recipient of recipients) {
    recipient.smsStatus = await sendOneSms(recipient.phone, message);
  }

  return recipients;
}

async function sendReminderSms(farmerPhone) {
  const message = 'FSDAMS Reminder: Your expected return time is approaching. Please remember to check out safely.';
  return sendOneSms(farmerPhone, message);
}

module.exports = { dispatchAlertSms, buildMessage, sendReminderSms };
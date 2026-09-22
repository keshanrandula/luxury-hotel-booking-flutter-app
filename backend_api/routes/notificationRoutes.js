const express = require('express');
const router = express.Router();
const {
  getNotifications,
  sendPushNotification,
  triggerCheckInReminders,
  registerDeviceToken,
  getNotificationStats,
} = require('../controllers/notificationController');

router.route('/')
  .get(getNotifications);

router.route('/send')
  .post(sendPushNotification);

router.route('/check-in-reminders')
  .post(triggerCheckInReminders);

router.route('/device-token')
  .post(registerDeviceToken);

router.route('/stats')
  .get(getNotificationStats);

module.exports = router;

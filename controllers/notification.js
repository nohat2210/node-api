const Notification = require('../models/Notification');
const webpush = require('web-push');

// web push notification
const vapidKeys = {
  publicVapidKey:
    'BC-pA2nF60mcPbPU-2IboJZui_N141S_m0QfUcEP5f3m-8hBYG1krYxhrVzToB6V0yLE6NAg3F0D6qCqZeJK6pM',
  privateVapidKey: '_N1rFYPsMjAoOtxOkwGQbTcezbWL6tpQt7MLjh7cagY',
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicVapidKey,
  vapidKeys.privateVapidKey
);

const index = async (req, res, next) => {
  return res.status(200).json(res.paginatedResults);
};

const newNotification = async (req, res, next) => {
  const { title, content } = req.value.body;
  const newNotification = new Notification({ title, content });
  await newNotification.save();
  return res.status(201).json({ notification: newNotification });
};

const sendPushNotification = async (req, res, next) => {
  const { notificationID } = req.value.params;
  const notification = await Notification.findById(notificationID);
  webpush.sendNotification(notification);
  return res.status(202).json({});
};

module.exports = {
  index,
  newNotification,
  sendPushNotification,
};

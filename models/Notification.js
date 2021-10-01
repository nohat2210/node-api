const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;

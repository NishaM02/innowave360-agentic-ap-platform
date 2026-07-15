const fs = require("fs");
const path = require("path");

const notificationFile = path.join(
  __dirname,
  "../data/notifications.json"
);

// Get all notifications
const getNotifications = (req, res) => {
  try {
    const notifications = JSON.parse(
      fs.readFileSync(notificationFile, "utf8")
    );

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch notifications.",
    });
  }
};

// Add new notification
const addNotification = ({
  title,
  message,
  type,
}) => {
  const notifications = JSON.parse(
    fs.readFileSync(notificationFile, "utf8")
  );

  const newNotification = {
    id: Date.now(),
    title,
    message,
    type,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  notifications.unshift(newNotification);

  fs.writeFileSync(
    notificationFile,
    JSON.stringify(notifications, null, 2)
  );
};

// Mark notification as read
const markAsRead = (req, res) => {
  try {
    const { id } = req.params;

    const notifications = JSON.parse(
      fs.readFileSync(notificationFile, "utf8")
    );

    const notification = notifications.find(
      (item) => item.id == id
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    notification.isRead = true;

    fs.writeFileSync(
      notificationFile,
      JSON.stringify(notifications, null, 2)
    );

    res.status(200).json({
      message: "Notification marked as read.",
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = {
  getNotifications,
  addNotification,
  markAsRead,
};
import { useEffect, useState } from "react";
import api from "../services/api";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(
  (notification) => !notification.isRead
).length;

 useEffect(() => {
  if (!isOpen) return;

  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 3000);

  return () => clearInterval(interval);
}, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const markAsRead = async (id: number) => {
  try {
    await api.put(`/notifications/${id}/read`);

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  } catch (error) {
    console.error(error);
  }
};

  if (!isOpen) return null;

  return (
   <>
  {/* Overlay */}
  <div
    onClick={onClose}
    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
  />

  {/* Drawer */}
  <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-5">

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Notifications
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {notifications.length} Notifications
        </p>
      </div>

      <button
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        ✕
      </button>

    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto p-5">

      {notifications.length === 0 ? (

        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">

          <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-4">
            🔔
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            No Notifications
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            You're all caught up.
            <br />
            New notifications will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((notification) => (

            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${
                notification.isRead
                  ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  : "border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900"
              }`}
            >

              {/* Top */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3">

                  {!notification.isRead && (
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#005837]" />
                  )}

                  <div>

                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {notification.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {notification.message}
                    </p>

                  </div>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    notification.type === "success"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : notification.type === "error"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {notification.type}
                </span>

              </div>

              {/* Time */}
              <div className="mt-4 flex items-center justify-between">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>

                {!notification.isRead && (
                  <span className="text-xs font-medium text-[#005837]">
                    New
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

    {/* Footer */}
    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5">

      <button
        onClick={() => {
          notifications.forEach((n) => {
            if (!n.isRead) markAsRead(n.id);
          });
        }}
        className="w-full rounded-xl bg-[#005837] py-3 font-semibold text-white transition hover:bg-[#00452b]"
      >
        Mark All as Read
      </button>

    </div>

  </div>
</>
  );
}
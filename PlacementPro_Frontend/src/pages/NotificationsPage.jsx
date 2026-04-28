import React, { useEffect } from 'react';
import Card from '../components/Card';
import { useAuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/dataHelpers';

const NotificationsPage = () => {
  const { notifications, notificationsLoading, refreshNotifications } = useAuthContext();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return (
    <section className="max-w-5xl mx-auto p-6 sm:p-10 mt-10">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Notifications</h1>
      <div className="space-y-4">
        {notificationsLoading ? (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30">
            Loading notifications...
          </Card>
        ) : notifications.length ? (
          notifications.map((notification) => (
            <Card key={notification.id} className="bg-white/70 backdrop-blur-xl border border-white/30">
              <p className="font-medium text-gray-900">{notification.message}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">{notification.type || 'INFO'}</p>
              <p className="mt-1 text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
            </Card>
          ))
        ) : (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30">
            No notifications available.
          </Card>
        )}
      </div>
    </section>
  );
};

export default NotificationsPage;

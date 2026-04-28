import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, Moon, Sun, UserCircle, Users, X } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatRoleLabel, hasRole } from '../utils/auth';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Jobs', path: '/jobs' },
];

const MENU_BY_ROLE = {
  ROLE_ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/admin/profile' },
  ],
  ROLE_EMPLOYER: [
    { label: 'Dashboard', path: '/employer/dashboard' },
    { label: 'Notifications', path: '/notifications' },
  ],
  ROLE_PLACEMENT_OFFICER: [
    { label: 'Dashboard', path: '/placement/dashboard' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
  ],
  ROLE_STUDENT: [
    { label: 'Jobs', path: '/jobs' },
    { label: 'Applications', path: '/applications' },
    { label: 'Profile', path: '/profile' },
    { label: 'Notifications', path: '/notifications' },
  ],
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleMenu, setRoleMenu] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout, notifications, notificationsLoading, refreshNotifications } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const roleItems = useMemo(() => {
    if (!user?.role) return [];
    return MENU_BY_ROLE[user.role] || [];
  }, [user?.role]);

  const visibleNavItems = useMemo(() => {
    if (!user) return NAV_ITEMS.filter((item) => item.label !== 'Jobs');
    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_PLACEMENT_OFFICER') {
      return NAV_ITEMS.filter((item) => item.label !== 'Jobs');
    }
    return NAV_ITEMS;
  }, [user]);

  const unreadCount = useMemo(
    () => (notifications || []).filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationToggle = async () => {
    if (!user) return;
    await refreshNotifications();
    setIsNotificationsOpen((current) => !current);
  };

  const renderNotificationPanel = () => {
    if (!user || !isNotificationsOpen) return null;

    return (
      <div className="absolute right-0 top-full z-[90] mt-3 w-[22rem] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <button
            onClick={refreshNotifications}
            className="text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            Refresh
          </button>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {notificationsLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
          ) : notifications.length ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="font-medium text-gray-900 dark:text-white">{notification.message}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {notification.type || 'INFO'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
          )}
        </div>

        <button
          onClick={() => {
            setIsNotificationsOpen(false);
            navigate('/notifications');
          }}
          className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          View all
        </button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 shadow-sm backdrop-blur-xl transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-black bg-clip-text text-xl font-bold text-transparent dark:from-orange-400 dark:to-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-slate-900 text-white shadow-md shadow-orange-500/20">
                <Users className="h-5 w-5" />
              </div>
              PlacementPro
            </Link>
          </div>

          <nav className="hidden items-center gap-4 text-sm text-gray-700 md:flex">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1 transition ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-slate-900 text-white shadow-md shadow-orange-500/20'
                      : 'hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {!user ? (
              <>
                <Link className="rounded-md px-3 py-1 font-medium text-orange-600 transition hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-slate-800" to="/login">
                  Login
                </Link>
                <Link className="rounded-md bg-gradient-to-r from-orange-500 to-slate-900 px-3 py-1 text-white shadow-md shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-black" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <>
                {roleItems
                  .filter((item) => item.label !== 'Notifications')
                  .map((item) => (
                    <Link
                      key={`${user.role}-${item.label}`}
                      className="rounded-lg bg-gradient-to-r from-orange-500 to-black px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-slate-900 hover:shadow-lg hover:shadow-orange-500/20"
                      to={item.path}
                    >
                      {item.label}
                    </Link>
                  ))}

                <div className="relative">
                  <button
                    onClick={handleNotificationToggle}
                    className="relative rounded-lg bg-gradient-to-r from-orange-500 to-black px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-slate-900 hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-orange-600">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {renderNotificationPanel()}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setRoleMenu((current) => !current)}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-black px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-slate-900 hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    <UserCircle className="h-5 w-5" />
                    {user.name} ({formatRoleLabel(user.role)})
                  </button>
                  {roleMenu && (
                    <div className="absolute right-0 z-[95] mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      <button onClick={handleLogout} className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" onClick={() => setIsOpen((current) => !current)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="space-y-2 px-4 py-3">
            {visibleNavItems.map((item) => (
              <Link key={item.path} onClick={() => setIsOpen(false)} to={item.path} className="block rounded-md px-3 py-2 font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400">
                {item.label}
              </Link>
            ))}

            {!user ? (
              <>
                <Link onClick={() => setIsOpen(false)} to="/login" className="block rounded-md px-3 py-2 font-medium text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-slate-800">
                  Login
                </Link>
                <Link onClick={() => setIsOpen(false)} to="/register" className="block rounded-md bg-gradient-to-r from-orange-500 to-slate-900 px-3 py-2 font-medium text-white shadow-md shadow-orange-500/20">
                  Register
                </Link>
              </>
            ) : (
              <>
                {roleItems.map((item) => (
                  <Link
                    key={`${user.role}-mobile-${item.label}`}
                    onClick={() => setIsOpen(false)}
                    to={item.path}
                    className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

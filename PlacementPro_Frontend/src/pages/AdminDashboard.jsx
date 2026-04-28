import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, Edit2, Plus, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { formatDate } from '../utils/dataHelpers';
import { validateEmail, validateName } from '../utils/validation';
import { formatRoleLabel, normalizeRole } from '../utils/auth';

// Admin dashboard for managing users and system settings
import { usePlacementData } from '../context/PlacementDataContext';
import { useToast } from '../context/ToastContext';
import { useAuthContext } from '../context/AuthContext';
import API from '../api/axios';

const AdminDashboard = () => {
  const { user: currentUser } = useAuthContext();
  const { placementData, createUser, assignUserRole, deleteUser } = usePlacementData();
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    recentActivities: [],
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
  });
  const [errors, setErrors] = useState({});

  const fetchDashboard = async () => {
    setDashboardLoading(true);
    try {
      const response = await API.get('/admin/dashboard');
      setDashboard(response.data);
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
      showToast(err.response?.data?.message || 'Failed to load admin dashboard', 'error');
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDashboard();
    }
  }, [currentUser]);

  const statsCards = useMemo(() => ([
    { label: 'Students', value: dashboard.totalStudents, color: 'text-blue-600' },
    { label: 'Employers', value: dashboard.totalEmployers, color: 'text-green-600' },
    { label: 'Jobs', value: dashboard.totalJobs, color: 'text-orange-600' },
    { label: 'Applications', value: dashboard.totalApplications, color: 'text-purple-600' },
  ]), [dashboard]);

  const filteredUsers = (placementData.users || []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === normalizeRole(filterRole);
    return matchesSearch && matchesRole;
  });

  const validateForm = () => {
    const newErrors = {};
    if (!validateName(formData.name)) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!editingUser && (!formData.password || formData.password.length < 8)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    let result;
    if (editingUser) {
      result = await assignUserRole(editingUser.id, formData.role);
    } else {
      result = await createUser(formData);
    }

    if (result.success) {
      showToast(editingUser ? 'User role updated successfully' : 'User added successfully');
      fetchDashboard();
      setIsAddModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'ROLE_STUDENT' });
      setErrors({});
    } else {
      showToast(result.message || 'Operation failed', 'error');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (currentUser?.id === userId) {
      showToast('You cannot delete your own account', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(userId);
      if (result.success) {
        showToast('User deleted successfully');
        fetchDashboard();
      } else {
        showToast(result.message || 'Deletion failed', 'error');
      }
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsAddModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'ROLE_STUDENT' });
    setErrors({});
  };

  const getRoleColor = (role) => {
    const r = role.toUpperCase();
    const colors = {
      ROLE_ADMIN: 'bg-purple-100 text-purple-800',
      ROLE_STUDENT: 'bg-blue-100 text-blue-800',
      ROLE_EMPLOYER: 'bg-green-100 text-green-800',
      ROLE_PLACEMENT_OFFICER: 'bg-orange-100 text-orange-800',
    };
    return colors[r] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden transition-colors duration-200">
      {/* Modern Aurora UI Mesh Gradient Background */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[0%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-slate-400/20 dark:bg-slate-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-400/10 dark:bg-orange-800/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage users, jobs, and system settings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card) => (
          <Card key={card.label}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${card.color}`}>
                {dashboardLoading ? '...' : card.value}
              </p>
              <p className="text-gray-600 text-sm mt-1">{card.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-8" header={<h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>}>
        <div className="space-y-3">
          {(dashboard.recentActivities || []).map((activity, index) => (
            <div key={`${activity}-${index}`} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {activity}
            </div>
          ))}
          {!dashboardLoading && (!dashboard.recentActivities || !dashboard.recentActivities.length) && (
            <p className="text-sm text-gray-500">No recent activities available.</p>
          )}
        </div>
      </Card>

      {/* Users Table */}
      <Card header={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <Button size="sm" onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'ROLE_STUDENT' });
            setIsAddModalOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </Button>
        </div>
      }>
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="employer">Employer</option>
              <option value="placement_officer">Placement Officer</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Joined</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {formatRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Assign role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Assign User Role' : 'Add New User'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Update Role' : 'Add User'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            required
            disabled={Boolean(editingUser)}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            required
            disabled={Boolean(editingUser)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            >
              <option value="ROLE_STUDENT">Student</option>
              <option value="ROLE_EMPLOYER">Employer</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_PLACEMENT_OFFICER">Placement Officer</option>
            </select>
          </div>

          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              required
            />
          )}
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;

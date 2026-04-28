export const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return null;
  const normalized = role.trim().toUpperCase();
  return normalized.startsWith('ROLE_') ? normalized : `ROLE_${normalized}`;
};

export const extractPrimaryRole = (user) => {
  if (!user) return null;
  if (user.role) return normalizeRole(user.role);
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    const firstRole = user.roles[0];
    return normalizeRole(typeof firstRole === 'string' ? firstRole : firstRole?.name);
  }
  return null;
};

export const hasRole = (user, role) => extractPrimaryRole(user) === normalizeRole(role);

export const dashboardRouteForRole = (role) => {
  switch (normalizeRole(role)) {
    case 'ROLE_ADMIN':
      return '/admin/dashboard';
    case 'ROLE_EMPLOYER':
      return '/employer/dashboard';
    case 'ROLE_PLACEMENT_OFFICER':
      return '/placement/dashboard';
    case 'ROLE_STUDENT':
      return '/student/dashboard';
    default:
      return '/';
  }
};

export const formatRoleLabel = (role) => {
  switch (normalizeRole(role)) {
    case 'ROLE_ADMIN':
      return 'Admin';
    case 'ROLE_EMPLOYER':
      return 'Employer';
    case 'ROLE_PLACEMENT_OFFICER':
      return 'Placement Officer';
    case 'ROLE_STUDENT':
      return 'Student';
    default:
      return 'Unknown';
  }
};

export const getRoleProfile = (user) => {
  switch (extractPrimaryRole(user)) {
    case 'ROLE_STUDENT':
      return user?.studentProfile ?? null;
    case 'ROLE_EMPLOYER':
      return user?.employerProfile ?? null;
    case 'ROLE_PLACEMENT_OFFICER':
      return user?.placementProfile ?? null;
    default:
      return null;
  }
};

export const getResumeUrl = (user) => user?.studentProfile?.resumeUrl ?? '';

export const isProfileComplete = (user) => Boolean(user?.profileCompleted ?? user?.profileComplete);

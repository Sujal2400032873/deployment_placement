import React, { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { formatRoleLabel, hasRole, isProfileComplete } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { dashboardRouteForRole } from '../utils/auth';

const emptyStudentProfile = {
  rollNumber: '',
  branch: '',
  skills: '',
  cgpa: '',
  graduationYear: '',
  resumeUrl: '',
};

const emptyEmployerProfile = {
  companyName: '',
  industry: '',
  companySize: '',
  website: '',
  description: '',
  hrContact: '',
};

const emptyPlacementProfile = {
  department: '',
  designation: '',
  collegeName: '',
  contactNumber: '',
};

const normalizeProfile = (profile, defaults) => ({
  ...defaults,
  ...Object.fromEntries(
    Object.entries(profile || {}).map(([key, value]) => [key, value ?? ''])
  ),
});

const ProfilePage = () => {
  const { user, updateProfile } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    studentProfile: emptyStudentProfile,
    employerProfile: emptyEmployerProfile,
    placementProfile: emptyPlacementProfile,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || '',
      email: user.email || '',
      studentProfile: normalizeProfile(user.studentProfile, emptyStudentProfile),
      employerProfile: normalizeProfile(user.employerProfile, emptyEmployerProfile),
      placementProfile: normalizeProfile(user.placementProfile, emptyPlacementProfile),
    });
  }, [user]);

  const roleTitle = useMemo(() => formatRoleLabel(user?.role), [user?.role]);

  if (!user) {
    return <p className="max-w-3xl mx-auto p-6 mt-10">Please login to view profile.</p>;
  }

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Valid email is required';

    if (hasRole(user, 'ROLE_STUDENT')) {
      if (!form.studentProfile.rollNumber.trim()) next.rollNumber = 'Roll number is required';
      if (!form.studentProfile.branch.trim()) next.branch = 'Branch is required';
      if (!form.studentProfile.skills.trim()) next.skills = 'Skills are required';
      if (form.studentProfile.cgpa === '' || Number.isNaN(Number(form.studentProfile.cgpa)) || Number(form.studentProfile.cgpa) < 0 || Number(form.studentProfile.cgpa) > 10) next.cgpa = 'CGPA must be between 0 and 10';
      if (!form.studentProfile.graduationYear || Number.isNaN(Number(form.studentProfile.graduationYear))) next.graduationYear = 'Graduation year is required';
      if (!form.studentProfile.resumeUrl.trim()) next.resumeUrl = 'Resume URL is required';
    }

    if (hasRole(user, 'ROLE_EMPLOYER')) {
      if (!form.employerProfile.companyName.trim()) next.companyName = 'Company name is required';
      if (!form.employerProfile.industry.trim()) next.industry = 'Industry is required';
      if (!form.employerProfile.companySize.trim()) next.companySize = 'Company size is required';
      if (!form.employerProfile.website.trim()) next.website = 'Website is required';
      if (!form.employerProfile.description.trim()) next.description = 'Description is required';
      if (!form.employerProfile.hrContact.trim()) next.hrContact = 'HR contact is required';
    }

    if (hasRole(user, 'ROLE_PLACEMENT_OFFICER')) {
      if (!form.placementProfile.department.trim()) next.department = 'Department is required';
      if (!form.placementProfile.designation.trim()) next.designation = 'Designation is required';
      if (!form.placementProfile.collegeName.trim()) next.collegeName = 'College name is required';
      if (!form.placementProfile.contactNumber.trim()) next.contactNumber = 'Contact number is required';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name,
      email: form.email,
    };

    if (hasRole(user, 'ROLE_STUDENT')) {
      payload.studentProfile = {
        ...form.studentProfile,
        cgpa: Number(form.studentProfile.cgpa),
        graduationYear: Number(form.studentProfile.graduationYear),
      };
    }

    if (hasRole(user, 'ROLE_EMPLOYER')) {
      payload.employerProfile = form.employerProfile;
    }

    if (hasRole(user, 'ROLE_PLACEMENT_OFFICER')) {
      payload.placementProfile = form.placementProfile;
    }

    const result = await updateProfile(payload);

    if (result.success) {
      showToast('Profile updated successfully', 'success');
      const nextUser = result.user;
      if (isProfileComplete(nextUser)) {
        navigate(dashboardRouteForRole(nextUser.role), { replace: true });
      }
    } else {
      showToast(result.message || 'Profile update failed', 'error');
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6 sm:p-10 mt-10 bg-blue-50/40 rounded-3xl border border-blue-100">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{roleTitle} Profile</h1>
          <p className="text-gray-600">
            {isProfileComplete(user)
              ? 'Keep your profile up to date.'
              : 'Complete every required field to unlock your dashboard.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required />
        </div>

        {hasRole(user, 'ROLE_STUDENT') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Input label="Roll Number" value={form.studentProfile.rollNumber} onChange={(e) => setForm({ ...form, studentProfile: { ...form.studentProfile, rollNumber: e.target.value } })} error={errors.rollNumber} required />
            <Input label="Branch" value={form.studentProfile.branch} onChange={(e) => setForm({ ...form, studentProfile: { ...form.studentProfile, branch: e.target.value } })} error={errors.branch} required />
            <Input label="Skills" value={form.studentProfile.skills} onChange={(e) => setForm({ ...form, studentProfile: { ...form.studentProfile, skills: e.target.value } })} error={errors.skills} required />
            <Input label="CGPA" value={form.studentProfile.cgpa} onChange={(e) => setForm({ ...form, studentProfile: { ...form.studentProfile, cgpa: e.target.value } })} error={errors.cgpa} required />
            <Input label="Graduation Year" value={form.studentProfile.graduationYear} onChange={(e) => setForm({ ...form, studentProfile: { ...form.studentProfile, graduationYear: e.target.value } })} error={errors.graduationYear} required />
            <Input label="Resume URL" value={form.studentProfile.resumeUrl} onChange={(e) => setForm({ ...form, studentProfile: { ...form.studentProfile, resumeUrl: e.target.value } })} error={errors.resumeUrl} required />
          </div>
        )}

        {hasRole(user, 'ROLE_EMPLOYER') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Input label="Company Name" value={form.employerProfile.companyName} onChange={(e) => setForm({ ...form, employerProfile: { ...form.employerProfile, companyName: e.target.value } })} error={errors.companyName} required />
            <Input label="Industry" value={form.employerProfile.industry} onChange={(e) => setForm({ ...form, employerProfile: { ...form.employerProfile, industry: e.target.value } })} error={errors.industry} required />
            <Input label="Company Size" value={form.employerProfile.companySize} onChange={(e) => setForm({ ...form, employerProfile: { ...form.employerProfile, companySize: e.target.value } })} error={errors.companySize} required />
            <Input label="Website" value={form.employerProfile.website} onChange={(e) => setForm({ ...form, employerProfile: { ...form.employerProfile, website: e.target.value } })} error={errors.website} required />
            <Input label="HR Contact" value={form.employerProfile.hrContact} onChange={(e) => setForm({ ...form, employerProfile: { ...form.employerProfile, hrContact: e.target.value } })} error={errors.hrContact} required />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
              <textarea
                value={form.employerProfile.description ?? ''}
                onChange={(e) => setForm({ ...form, employerProfile: { ...form.employerProfile, description: e.target.value } })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the company and hiring context."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        )}

        {hasRole(user, 'ROLE_PLACEMENT_OFFICER') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Input label="Department" value={form.placementProfile.department} onChange={(e) => setForm({ ...form, placementProfile: { ...form.placementProfile, department: e.target.value } })} error={errors.department} required />
            <Input label="Designation" value={form.placementProfile.designation} onChange={(e) => setForm({ ...form, placementProfile: { ...form.placementProfile, designation: e.target.value } })} error={errors.designation} required />
            <Input label="College Name" value={form.placementProfile.collegeName} onChange={(e) => setForm({ ...form, placementProfile: { ...form.placementProfile, collegeName: e.target.value } })} error={errors.collegeName} required />
            <Input label="Contact Number" value={form.placementProfile.contactNumber} onChange={(e) => setForm({ ...form, placementProfile: { ...form.placementProfile, contactNumber: e.target.value } })} error={errors.contactNumber} required />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button size="fullWidth" onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </section>
  );
};

export default ProfilePage;

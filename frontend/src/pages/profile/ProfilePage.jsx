import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Shield, Briefcase, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading tracking-tight">My Profile</h1>
        <p className="text-subtle text-sm mt-1">Manage your account settings and personal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 border-4 border-surface shadow-soft">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-heading">{user?.full_name}</h2>
            <p className="text-subtle text-sm mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted-bg border border-border-subtle text-xs font-medium text-body capitalize">
              <Shield size={12} className={user?.role === 'admin' ? 'text-danger-500' : 'text-success-500'} />
              {user?.role} Role
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-heading mb-6 border-b border-border pb-4">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
                <div className="text-sm font-medium text-subtle flex items-center gap-2">
                  <User size={16} /> Full Name
                </div>
                <div className="sm:col-span-2 text-sm text-heading font-medium">{user?.full_name}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
                <div className="text-sm font-medium text-subtle flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </div>
                <div className="sm:col-span-2 text-sm text-heading font-medium">{user?.email}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
                <div className="text-sm font-medium text-subtle flex items-center gap-2">
                  <Briefcase size={16} /> Job Role
                </div>
                <div className="sm:col-span-2 text-sm text-heading font-medium capitalize">{user?.role}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-sm font-medium text-subtle flex items-center gap-2">
                  <Calendar size={16} /> Joined On
                </div>
                <div className="sm:col-span-2 text-sm text-heading font-medium">
                  {new Date(user?.date_joined || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-heading mb-4">Account Security</h3>
            <p className="text-sm text-subtle mb-6">Keep your account secure by using a strong password.</p>
            <Button variant="secondary">Change Password</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

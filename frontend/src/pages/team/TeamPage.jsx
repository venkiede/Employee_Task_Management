import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { User, Shield, ShieldAlert, Mail, Users, Plus, AlertCircle, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TeamMemberForm from '../../components/team/TeamMemberForm';
import TeamActionDropdown from '../../components/team/TeamActionDropdown';

const TeamPage = () => {
  const { user } = useSelector(state => state.auth);
  const [activeMembers, setActiveMembers] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'removed'
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activeRes, removedRes] = await Promise.all([
        api.get('team-members/'),
        api.get('team-members/removed/')
      ]);
      setActiveMembers(activeRes.data.results || activeRes.data);
      setRemovedMembers(removedRes.data.results || removedRes.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleAddMember = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('team-members/', data);
      toast.success('Team member added successfully');
      setIsAddModalOpen(false);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add team member';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setIsRemoveModalOpen(true);
  };

  const confirmRemove = async () => {
    setIsSubmitting(true);
    try {
      await api.patch(`team-members/${selectedMember.id}/remove/`);
      toast.success('Team member removed successfully');
      setIsRemoveModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to remove team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async (member) => {
    try {
      await api.patch(`team-members/${member.id}/restore/`);
      toast.success('Team member restored successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to restore team member');
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center text-danger-500">Access Denied. Admin only.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Team Management</h1>
          <p className="text-subtle text-sm mt-1">Manage users, roles, and access across the workspace.</p>
        </div>
        <Button 
          icon={<Plus size={18} />} 
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Team Member
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'active' ? 'text-primary-600' : 'text-subtle hover:text-heading'
          }`}
        >
          Active Members
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
        </button>
        <button
          onClick={() => setActiveTab('removed')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'removed' ? 'text-primary-600' : 'text-subtle hover:text-heading'
          }`}
        >
          Removed Members
          {activeTab === 'removed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-subtle text-sm">Loading team data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-body">
              <thead className="text-xs text-subtle uppercase bg-muted-bg border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">
                    {activeTab === 'active' ? 'Joined Date' : 'Removed Date'}
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(activeTab === 'active' ? activeMembers : removedMembers).map((member) => (
                  <tr key={member.id} className="hover:bg-muted-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted-bg flex items-center justify-center text-heading font-bold border border-border-subtle">
                          {member.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-heading flex items-center gap-2">
                            {member.full_name}
                            {member.id === user.id && (
                              <span className="bg-primary-500/10 text-primary-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">You</span>
                            )}
                          </div>
                          <div className="text-xs text-subtle flex items-center gap-1 mt-0.5">
                            <Mail size={12} />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {member.role === 'admin' ? (
                          <ShieldAlert size={16} className="text-danger-500" />
                        ) : (
                          <Shield size={16} className="text-success-500" />
                        )}
                        <span className="capitalize">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        !member.is_removed 
                          ? 'bg-success-500/10 text-success-600' 
                          : 'bg-danger-500/10 text-danger-600'
                      }`}>
                        {!member.is_removed ? 'Active' : 'Removed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-subtle">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(member.is_removed ? member.removed_at : member.date_joined).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <TeamActionDropdown 
                        member={member} 
                        isRemoved={member.is_removed}
                        onRemove={handleRemoveClick}
                        onRestore={handleRestore}
                      />
                    </td>
                  </tr>
                ))}
                {(activeTab === 'active' ? activeMembers : removedMembers).length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-subtle">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="opacity-20" />
                        <p>No {activeTab} members found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Team Member"
      >
        <TeamMemberForm onSubmit={handleAddMember} isLoading={isSubmitting} />
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title="Remove Team Member"
      >
        <div className="space-y-4">
          <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-start gap-3 text-danger-500">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">
              Are you sure you want to remove <strong>{selectedMember?.full_name}</strong>? 
              They will no longer be able to access the platform. This action can be reversed later.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsRemoveModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="danger" onClick={confirmRemove} isLoading={isSubmitting}>Remove Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamPage;

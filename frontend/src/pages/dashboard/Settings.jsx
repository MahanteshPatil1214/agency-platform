import React, { useState } from 'react';
import { User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getCurrentUser, updateProfile, changePassword } from '../../api/auth';

const Settings = ({ role = 'client' }) => {
    const currentUser = getCurrentUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profileData, setProfileData] = useState({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        username: currentUser?.username || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile(profileData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={role}>
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">Settings</h1>
                <p className="text-text-muted">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <Card className="w-full lg:w-64 p-0 h-fit">
                    <div className="p-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-text-muted'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'password' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-text-muted'
                                }`}
                        >
                            <Lock className="w-5 h-5" />
                            <span className="font-medium">Password</span>
                        </button>
                    </div>
                </Card>

                {/* Settings Content */}
                <div className="flex-1">
                    <Card>
                        <h2 className="text-xl font-bold mb-6">
                            {activeTab === 'profile' ? 'Profile Information' : 'Change Password'}
                        </h2>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' ? (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-xl">
                                <Input
                                    label="Full Name"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                                <Input
                                    label="Username"
                                    value={profileData.username}
                                    disabled
                                    className="opacity-50 cursor-not-allowed"
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                    <Save className="ml-2 w-4 h-4" />
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                    <Save className="ml-2 w-4 h-4" />
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;

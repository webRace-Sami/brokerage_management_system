'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  UserCheck,
  Key,
  Phone,
  Mail,
  Check,
  AlertCircle,
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UserManagementModal({
  isOpen,
  onClose,
  onSuccess,
}: UserManagementModalProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  // Add / Edit User Form State
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  const [phone, setPhone] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.error || 'Failed to load user accounts.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setIsEditing(false);
    setSelectedUserId(null);
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('EMPLOYEE');
    setPhone('');
    setError(null);
  };

  const handleStartEdit = (user: UserProfile) => {
    setIsEditing(true);
    setSelectedUserId(user.id);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.plainPassword || '');
    setRole(user.role);
    setPhone(user.phone || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormSubmitting(true);

    try {
      let res: Response;
      const payload = {
        name,
        username,
        email,
        plainPassword: password,
        role,
        phone,
      };

      if (isEditing && selectedUserId) {
        res = await fetch(`/api/users/${selectedUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { error: text || 'Server response error' };
      }

      if (!res.ok) throw new Error(data.error || `Failed to save user account (Status ${res.status}).`);

      await fetchUsers();
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving user.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (user.username === 'admin' || user.id === 'user_admin') {
      alert('Primary Admin account cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user "${user.name}" (${user.username})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {}

      if (!res.ok) throw new Error(data.error || 'Failed to delete user.');
      await fetchUsers();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message || 'Error deleting user.');
    }
  };

  const handleCopyCredentials = (user: UserProfile) => {
    const creds = `Madina Goods Transport System\nUsername: ${user.username}\nPassword: ${user.plainPassword || '******'}\nPortal: ${window.location.origin}/login`;
    navigator.clipboard.writeText(creds);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-900/40">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white font-['Outfit']">
                Manage Munshi Staff & User Logins (صارفین کی انتظامیہ)
              </h3>
              <p className="text-xs text-slate-400">
                Create login IDs, update passwords, and manage access authorities for Madina Goods staff
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Left Column: Form to Add/Edit User */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {isEditing ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">
                  {isEditing ? 'Edit User Credentials' : 'Create New User / Munshi'}
                </h4>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 flex-1">
              <div>
                <label htmlFor="user_full_name" className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (پورا نام) *
                </label>
                <input
                  id="user_full_name"
                  name="fullName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Munshi Muhammad Rizwan"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="user_username" className="block text-xs font-bold text-slate-700 mb-1">
                    Username / Login ID *
                  </label>
                  <input
                    id="user_username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. rizwan1"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="user_role" className="block text-xs font-bold text-slate-700 mb-1">
                    User Role (عہدہ) *
                  </label>
                  <select
                    id="user_role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'ADMIN' | 'EMPLOYEE')}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white font-bold"
                  >
                    <option value="EMPLOYEE">Munshi Staff (منشی)</option>
                    <option value="ADMIN">Admin Authority (ایڈمن)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="user_password" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Password (پاس ورڈ) *</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-normal">
                    Plaintext saved for Munshi reference
                  </span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="user_password"
                    name="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. MunshiPass@2026"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="user_phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / Mobile (فون نمبر)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="user_phone"
                      name="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="user_email" className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="user_email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@madinagoods.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{formSubmitting ? 'Saving User...' : isEditing ? 'Save Changes' : '+ Add User'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: User Accounts List Table */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">
                  Active User Accounts ({users.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Staff members authorized to login and record dispatches
                </p>
              </div>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                Live MongoDB Synchronized
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Loading user list...</div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No users registered yet.</div>
              ) : (
                users.map((user) => {
                  const isAdminUser = user.role === 'ADMIN';
                  const isVisible = showPasswords[user.id];

                  return (
                    <div
                      key={user.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{user.name}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              isAdminUser
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {isAdminUser ? <Shield className="w-3 h-3 text-amber-700" /> : <UserCheck className="w-3 h-3 text-emerald-700" />}
                            {isAdminUser ? 'Admin Authority' : 'Munshi Staff'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                          <span className="text-slate-700">
                            Username: <strong className="text-slate-900">{user.username}</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1 text-slate-700">
                            Password:
                            <strong className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {isVisible ? user.plainPassword || '******' : '••••••••'}
                            </strong>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title={isVisible ? 'Hide Password' : 'Show Password'}
                            >
                              {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </span>
                        </div>

                        {user.phone && (
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                          </div>
                        )}
                      </div>

                      {/* User Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => handleCopyCredentials(user)}
                          title="Copy login credentials to clipboard"
                          className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold transition-all"
                        >
                          {copiedId === user.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleStartEdit(user)}
                          title="Edit user details"
                          className="p-1.5 text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {!isAdminUser && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Delete user account"
                            className="p-1.5 text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg border border-slate-200 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            * Admins have full access to company settings, brokers, users, and dispatches. Munshi staff can record dispatches and print receipts.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

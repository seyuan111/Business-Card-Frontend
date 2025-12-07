import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, isAuthenticated, loading: authLoading, setUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    productUpdates: true,
    smsAlerts: false,
    publicProfile: true,
    theme: 'Glow',
  });

  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileCompletion = useMemo(() => {
    const filled = ['fullName', 'email', 'phone', 'title', 'bio'].filter(
      (field) => profile[field]?.trim()
    );
    return Math.round((filled.length / 5) * 100);
  }, [profile]);

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      fullName: user.name || user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      title: user.title || prev.title,
      bio: user.bio || prev.bio,
    }));
  }, [user]);

  const getPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Elite'];
    const colors = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-500', 'bg-emerald-500'];
    return {
      label: labels[score] || 'Weak',
      className: colors[score] || colors[0],
      width: `${Math.min((score / 4) * 100, 100)}%`,
    };
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThemeChange = (value) => {
    setPreferences((prev) => ({ ...prev, theme: value }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profile.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = 'Invalid email format';
    if (profile.phone && !/^\d{10}$/.test(profile.phone)) newErrors.phone = 'Enter a 10-digit phone number';
    if (profile.bio && profile.bio.length < 20) newErrors.bio = 'Add a touch more detail to your bio';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwords.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwords.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwords.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwords.newPassword !== passwords.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateProfile();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSavingProfile(true);
      const payload = {
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        title: profile.title,
        bio: profile.bio,
      };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/users/update-profile`, payload, {
        headers: authHeaders,
        withCredentials: true,
      });

      const nextUser = { ...(user || {}), ...payload };
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      setBanner({ type: 'success', text: 'Profile refreshed. Looking sharp.' });
    } catch (err) {
      console.error('Profile update failed', err);
      const message = err.response?.data?.message || 'Unable to update profile right now.';
      setBanner({ type: 'error', text: message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validatePassword();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSavingPassword(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: authHeaders,
          withCredentials: true,
        }
      );
      setBanner({ type: 'success', text: 'Password updated. Security tightened.' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change failed', err);
      const message = err.response?.data?.message || 'Unable to change password right now.';
      setBanner({ type: 'error', text: message });
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setBanner({ type: 'success', text: 'Preferences saved. We got you covered.' });
  };

  const strength = getPasswordStrength(passwords.newPassword);

  const renderAuthGate = () => (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-200/80 backdrop-blur">
      Please sign in to manage your account settings.
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b223f] to-[#0f172a] text-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute right-10 top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute bottom-10 right-28 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <NavBar />
      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">My Account</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Settings</h1>
          </div>
        </div>

        {banner && (
          <div
            className={`mt-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm backdrop-blur ${
              banner.type === 'error'
                ? 'border-rose-300/40 bg-rose-500/10 text-rose-50'
                : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-50'
            }`}
          >
            <span>{banner.text}</span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="text-xs font-semibold uppercase tracking-wide"
            >
              dismiss
            </button>
          </div>
        )}

        {(!isAuthenticated && !authLoading) && renderAuthGate()}

        {isAuthenticated && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Profile</h2>
                    <p className="text-sm text-slate-200/70">My profile.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.15em] text-emerald-100">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      Live
                    </div>
                    <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/20">
                      <div className="absolute inset-0 rotate-6 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent)]" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-100">Profile completeness</span>
                    <span className="font-semibold text-emerald-100">{profileCompletion}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-1">
                    <label htmlFor="fullName" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">
                      username
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-rose-200">{errors.fullName}</p>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                      placeholder="name@email.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-200">{errors.email}</p>}
                  </div>

                  <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className={`rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-emerald-500/50 ${
                        savingProfile ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {savingProfile ? 'Saving...' : 'Save profile'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Security</h2>
                    <p className="text-sm text-slate-200/70">Update your password and keep sessions trusted.</p>
                  </div>
                  <div className="rounded-full border border-amber-200/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-100">
                    Recommended
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-1 md:col-span-2">
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200"
                    >
                      Current password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                      placeholder="********"
                    />
                    {errors.currentPassword && <p className="mt-1 text-xs text-rose-200">{errors.currentPassword}</p>}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">
                      New password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                      placeholder="At least 8 characters"
                    />
                    {errors.newPassword && <p className="mt-1 text-xs text-rose-200">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-inner shadow-black/10 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/40"
                      placeholder="Repeat new password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-rose-200">{errors.confirmPassword}</p>}
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between text-xs text-slate-200/80">
                      <span>Password strength</span>
                      <span className="font-semibold text-white">{strength.label}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${strength.className}`} style={{ width: strength.width }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-200/70">
                      Use 8+ characters with uppercase, numbers, and symbols for the best protection.
                    </p>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className={`rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/20 transition hover:-translate-y-0.5 ${
                        savingPassword ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {savingPassword ? 'Updating...' : 'Change password'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;

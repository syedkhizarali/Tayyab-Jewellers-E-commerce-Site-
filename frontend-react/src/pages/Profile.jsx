import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiEdit2, FiCamera, FiUser, FiMail, FiPhone, FiCalendar, FiShield } from 'react-icons/fi';
import { getProfile, updateProfile, uploadProfilePhoto } from '../api/profile';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
    <span style={{ color: 'var(--gold-primary)', width: 18, flexShrink: 0 }}>{icon}</span>
    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Cinzel, serif', letterSpacing: 1, textTransform: 'uppercase', width: 120, flexShrink: 0 }}>{label}</span>
    <strong style={{ color: 'var(--cream)', fontSize: 14, fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{value || '—'}</strong>
  </div>
);

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    document.title = 'My Profile — Tayyab Jewellers';
    getProfile()
      .then((data) => { setProfile(data); reset({ phone: data?.phone, dob: data?.dob, gender: data?.gender }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reset]);

  const onSave = async (data) => {
    try {
      await updateProfile(data);
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadProfilePhoto(file);
      setProfile((p) => ({ ...p, profile_photo: result.photo_url || result.filename }));
      toast.success('Photo updated!');
    } catch { toast.error('Failed to upload photo'); }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const photoUrl = profile?.profile_photo ? `${BASE_URL}/uploads/${profile.profile_photo}` : null;

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-hero" style={{ padding: '48px 0 32px' }}>
        <div className="container">
          <span className="section-label">Account</span>
          <h1 className="page-title">My Profile</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, maxWidth: 720 }}>
        <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>

          {/* Avatar header */}
          <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'var(--black-soft)', border: '2px solid var(--border-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {photoUrl
                  ? <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <FiUser size={34} style={{ color: 'var(--gold-primary)' }} />}
              </div>
              <label style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid var(--black-card)',
              }} title="Change photo">
                <FiCamera size={13} style={{ color: 'var(--black-rich)' }} />
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: '1.5rem', marginBottom: 4 }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>{user?.email}</p>
              {user?.is_admin && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontFamily: 'Cinzel, serif', letterSpacing: 1.5, color: 'var(--gold-primary)', border: '1px solid var(--border-gold)', padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase' }}>
                  <FiShield size={10} /> Admin
                </span>
              )}
            </div>
          </div>

          {/* Info / Edit */}
          <div style={{ padding: '8px 32px 32px' }}>
            {editing ? (
              <form onSubmit={handleSubmit(onSave)} style={{ marginTop: 24 }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label"><FiPhone size={12} style={{ marginRight: 4 }} />Phone</label>
                    <input className="form-control" placeholder="+92 300 0000000" {...register('phone')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label"><FiCalendar size={12} style={{ marginRight: 4 }} />Date of Birth</label>
                    <input type="date" className="form-control" {...register('dob')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select className="form-select" {...register('gender')}>
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button type="submit" className="luxury-btn" disabled={isSubmitting} style={{ padding: '10px 28px' }}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="ghost-btn" onClick={() => setEditing(false)} style={{ padding: '10px 20px', fontSize: 12 }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ marginTop: 8 }}>
                  <InfoRow icon={<FiUser size={16} />}     label="Name"          value={user?.name} />
                  <InfoRow icon={<FiMail size={16} />}     label="Email"         value={user?.email} />
                  <InfoRow icon={<FiPhone size={16} />}    label="Phone"         value={profile?.phone || user?.phone} />
                  <InfoRow icon={<FiCalendar size={16} />} label="Date of Birth" value={profile?.dob} />
                  <InfoRow icon={<FiUser size={16} />}     label="Gender"        value={profile?.gender} />
                </div>
                <button className="ghost-btn" onClick={() => setEditing(true)} style={{ marginTop: 24, padding: '10px 24px', fontSize: 12 }}>
                  <FiEdit2 size={13} style={{ marginRight: 6 }} />Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

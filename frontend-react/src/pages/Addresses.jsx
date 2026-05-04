import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../api/addresses';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const AddressForm = ({ onSubmit, isSubmitting, onCancel, title }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 24, padding: '24px', background: 'var(--black-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)' }}>
      <div className="gold-divider" />
      <h6 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>{title}</h6>
      <div className="row g-3">
        <div className="col-md-6">
          <input className={`form-control${errors.full_name ? ' is-invalid' : ''}`} placeholder="Full Name *" {...register('full_name', { required: true })} />
        </div>
        <div className="col-md-6">
          <input className={`form-control${errors.phone ? ' is-invalid' : ''}`} placeholder="Phone *" {...register('phone', { required: true })} />
        </div>
        <div className="col-12">
          <input className={`form-control${errors.address_line1 ? ' is-invalid' : ''}`} placeholder="Address Line 1 *" {...register('address_line1', { required: true })} />
        </div>
        <div className="col-12">
          <input className="form-control" placeholder="Address Line 2 (optional)" {...register('address_line2')} />
        </div>
        <div className="col-md-4">
          <input className={`form-control${errors.city ? ' is-invalid' : ''}`} placeholder="City *" {...register('city', { required: true })} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Province" {...register('state')} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Postal Code" {...register('postal_code')} />
        </div>
        <div className="col-12">
          <input className="form-control" defaultValue="Pakistan" {...register('country')} />
        </div>
        <div className="col-12">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}>
            <input type="checkbox" {...register('is_default')} style={{ accentColor: 'var(--gold-primary)' }} />
            Set as default address
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button type="submit" className="luxury-btn" disabled={isSubmitting} style={{ padding: '10px 24px' }}>
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
        <button type="button" className="ghost-btn" onClick={onCancel} style={{ padding: '10px 16px', fontSize: 12 }}>Cancel</button>
      </div>
    </form>
  );
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () =>
    getAddresses().then((d) => setAddresses(d || [])).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { document.title = 'Addresses — Tayyab Jewellers'; load(); }, []);

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (addr) => { setEditing(addr); setShowForm(true); };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editing) {
        const updated = await updateAddress(editing.id, data);
        setAddresses((prev) => prev.map((a) => a.id === editing.id ? updated : a));
        toast.success('Address updated');
      } else {
        const created = await createAddress(data);
        setAddresses((prev) => [...prev, created]);
        toast.success('Address added');
      }
      setShowForm(false);
      setEditing(null);
    } catch { toast.error('Failed to save address'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success('Address deleted');
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-hero" style={{ padding: '48px 0 32px' }}>
        <div className="container">
          <span className="section-label">Account</span>
          <h1 className="page-title">My Addresses</h1>
          <p className="page-subtitle">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, maxWidth: 860 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button className="luxury-btn" onClick={openAdd} style={{ padding: '10px 24px', fontSize: 12 }}>
            <FiPlus size={14} style={{ marginRight: 6 }} />Add Address
          </button>
        </div>

        {showForm && (
          <AddressForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            title={editing ? 'Edit Address' : 'New Address'}
          />
        )}

        {addresses.length === 0 ? (
          <div className="empty-state">
            <FiMapPin size={52} style={{ color: 'var(--border-gold)', marginBottom: 16 }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: 8 }}>No addresses saved</p>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Add a delivery address to speed up checkout.</p>
            <button className="luxury-btn" onClick={openAdd}>Add First Address</button>
          </div>
        ) : (
          <div className="row g-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="col-md-6">
                <div style={{
                  background: 'var(--black-card)',
                  border: `1.5px solid ${addr.is_default ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius)', padding: '20px 22px', height: '100%',
                  position: 'relative', transition: 'border-color var(--transition)',
                }}>
                  {addr.is_default && (
                    <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontFamily: 'Cinzel, serif', letterSpacing: 1.5, color: 'var(--gold-primary)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 3, textTransform: 'uppercase' }}>
                      Default
                    </span>
                  )}
                  <strong style={{ color: 'var(--cream)', fontFamily: 'Jost, sans-serif', fontSize: 15 }}>{addr.full_name}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '8px 0 4px' }}>
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 4px' }}>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postal_code}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 16px' }}>{addr.country}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>{addr.phone}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="ghost-btn" onClick={() => openEdit(addr)} style={{ padding: '6px 14px', fontSize: 11 }}>
                      <FiEdit2 size={12} style={{ marginRight: 4 }} />Edit
                    </button>
                    <button onClick={() => handleDelete(addr.id)} style={{
                      padding: '6px 12px', fontSize: 11, background: 'transparent',
                      border: '1px solid rgba(220,53,69,0.3)', borderRadius: 'var(--radius)',
                      color: '#dc3545', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'all var(--transition)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.1)'; e.currentTarget.style.borderColor = '#dc3545'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(220,53,69,0.3)'; }}
                    >
                      <FiTrash2 size={12} />Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaWhatsapp } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';

const JEWELRY_TYPES = ['Ring', 'Necklace Set', 'Bridal Set', 'Bangles', 'Earrings', 'Tikka', 'Bracelet', 'Other'];
const METAL_TYPES   = ['Gold', 'Rose Gold', 'Silver'];
const KARATS        = ['24K', '22K', '21K', '18K'];
const STONES        = ['None', 'Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Pearl', 'Other'];
const TIMELINES     = ['2–3 weeks', '1 month', '2 months', 'Flexible'];

export default function CustomOrder() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [budget, setBudget] = useState(50000);
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  const onSubmit = (data) => {
    const msg = encodeURIComponent(
      `Custom Order Request:\n` +
      `Name: ${data.name}\n` +
      `Phone: ${data.phone}\n` +
      `WhatsApp: ${data.whatsapp}\n` +
      `Type: ${data.jewelry_type}\n` +
      `Metal: ${data.metal_type} ${data.karat}\n` +
      `Stone: ${data.stone}\n` +
      `Budget: PKR ${budget.toLocaleString()}\n` +
      `Timeline: ${data.timeline}\n` +
      `Description: ${data.description}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="custom-order-page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Bespoke Service</span>
          <h1 className="page-title">Custom Order</h1>
          <p className="page-subtitle">Share your design idea and we'll craft it in pure gold.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 12px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="custom-order-form">
              <span className="section-label" style={{ marginBottom: 4 }}>Step 1 of 1</span>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', marginBottom: 4 }}>Tell Us About Your Design</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Fill in the details below. We'll WhatsApp you within 24 hours with a quote and timeline.</p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                  {/* Contact */}
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input className={`form-control${errors.name ? ' is-invalid' : ''}`} placeholder="Your name"
                      {...register('name', { required: true })} />
                    {errors.name && <div className="invalid-feedback">Required</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input className={`form-control${errors.phone ? ' is-invalid' : ''}`} placeholder="+92 300 0000000"
                      {...register('phone', { required: true })} />
                    {errors.phone && <div className="invalid-feedback">Required</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">WhatsApp Number</label>
                    <input className="form-control" placeholder="+92 300 0000000 (if different)"
                      {...register('whatsapp')} />
                  </div>

                  {/* Jewellery Type */}
                  <div className="col-md-6">
                    <label className="form-label">Jewellery Type *</label>
                    <select className={`form-select${errors.jewelry_type ? ' is-invalid' : ''}`}
                      {...register('jewelry_type', { required: true })}>
                      <option value="">Select type</option>
                      {JEWELRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.jewelry_type && <div className="invalid-feedback">Required</div>}
                  </div>

                  {/* Metal */}
                  <div className="col-md-6">
                    <label className="form-label">Metal Type</label>
                    <select className="form-select" {...register('metal_type')}>
                      {METAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Karat Preference</label>
                    <select className="form-select" {...register('karat')}>
                      {KARATS.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  {/* Stone */}
                  <div className="col-md-6">
                    <label className="form-label">Stone Preference</label>
                    <select className="form-select" {...register('stone')}>
                      {STONES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Timeline */}
                  <div className="col-md-6">
                    <label className="form-label">Expected Timeline</label>
                    <select className="form-select" {...register('timeline')}>
                      {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="col-12">
                    <label className="form-label">Budget Range — PKR {budget.toLocaleString()}</label>
                    <input
                      type="range"
                      className="form-range"
                      min={10000} max={500000} step={5000}
                      value={budget}
                      onChange={e => setBudget(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--gold-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>PKR 10,000</span><span>PKR 500,000+</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="form-label">Design Description *</label>
                    <textarea
                      className={`form-control${errors.description ? ' is-invalid' : ''}`}
                      rows={4}
                      placeholder="Describe your design idea, inspiration, or any reference you have in mind…"
                      {...register('description', { required: true, minLength: 10 })}
                    />
                    {errors.description && <div className="invalid-feedback">Please describe your design (min 10 chars)</div>}
                  </div>

                  <div className="col-12 mt-2">
                    <button type="submit" className="whatsapp-btn w-100" style={{ justifyContent: 'center', padding: '14px' }}>
                      <FaWhatsapp size={20} /> Send via WhatsApp
                    </button>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                      This will open WhatsApp with your details pre-filled. We'll respond within 24 hours.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function LeadPopupModal() {
  const [show, setShow]     = useState(false);
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  useEffect(() => {
    if (sessionStorage.getItem('lead_popup_shown')) return;
    const id = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(id);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('lead_popup_shown', '1');
    setShow(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('lead_popup_shown', '1');
    const msg = encodeURIComponent(`Hi, I'm ${name} (+${phone}). I'd like to receive your jewellery catalog.`);
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="lead-popup-overlay" onClick={handleClose}>
      <div className="lead-popup" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button className="lead-popup-close" onClick={handleClose} aria-label="Close">
          <FiX size={16} />
        </button>
        <img
          src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
          alt="Bridal Collection"
          className="lead-popup-img"
        />
        <div className="lead-popup-body">
          <span className="section-label" style={{ marginBottom: 6 }}>Limited Pieces Available</span>
          <h3 className="lead-popup-title">Exclusive Bridal Collection</h3>
          <p className="lead-popup-sub">Get our full WhatsApp catalog with prices, weights, and custom options.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="lead-popup-input"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              className="lead-popup-input"
              placeholder="WhatsApp number (+92…)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <button type="submit" className="whatsapp-btn w-100" style={{ marginTop: 4, justifyContent: 'center' }}>
              <FaWhatsapp size={18} /> Get WhatsApp Catalog
            </button>
          </form>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, width: '100%', marginTop: 12, cursor: 'pointer' }}>
            No thanks, I'll browse on my own
          </button>
        </div>
      </div>
    </div>
  );
}

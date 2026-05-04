import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const STATS = [
  { num: '40+', label: 'Years of Craft' },
  { num: '5K+', label: 'Happy Customers' },
  { num: '500+', label: 'Unique Designs' },
  { num: '3',   label: 'Cities Served' },
];

const VALUES = [
  { title: 'Our Legacy',         body: 'Founded in 1985 in the heart of Lahore, Tayyab Jewellers has been crafting pure gold jewellery for over four decades. Every piece we create carries the trust of generations.' },
  { title: 'Master Craftsmen',   body: 'Our artisans have inherited their skills through family traditions, blending centuries-old techniques with contemporary design to create jewellery that stands apart.' },
  { title: 'Purity Promise',     body: 'We deal exclusively in hallmark certified gold. Every gram is verified, every karat is guaranteed. Our customers deserve nothing less than absolute purity.' },
];

export default function About() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  return (
    <div style={{ background: 'var(--black-rich)' }}>
      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <span className="section-label">Est. Since 1985</span>
          <h1 className="about-title">Our Story</h1>
          <p className="about-subtitle">Four decades of craftsmanship, trust, and pure gold — built in Lahore, loved across Pakistan.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--black-soft)', padding: '48px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="row g-3">
            {STATS.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="stat-box">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">Who We Are</span>
            <h2 className="section-title">Built on Trust &amp; Tradition</h2>
          </div>
          <div className="row g-4">
            {VALUES.map((v, i) => (
              <div key={i} className="col-md-4">
                <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: 28, height: '100%', transition: 'border-color var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div className="gold-divider" />
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', marginBottom: 12 }}>{v.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, fontWeight: 300 }}>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-pad" style={{ background: 'var(--black-soft)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Visit or Contact Us</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: <FiMapPin size={22} />, title: 'Our Store', detail: 'Main Bazar, Lahore, Punjab, Pakistan' },
              { icon: <FiPhone size={22} />,  title: 'Phone',    detail: '+92 300 000 0000' },
              { icon: <FiMail size={22} />,   title: 'Email',    detail: 'info@tayyabjewellers.pk' },
            ].map((c, i) => (
              <div key={i} className="col-md-4">
                <div className="contact-card text-center">
                  <div style={{ color: 'var(--gold-primary)', marginBottom: 12 }}>{c.icon}</div>
                  <h5 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', letterSpacing: 2, color: 'var(--gold-primary)', textTransform: 'uppercase', marginBottom: 8 }}>{c.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>{c.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${whatsapp}?text=Hi, I'd like to know more about Tayyab Jewellers`}
              target="_blank" rel="noreferrer"
              className="whatsapp-btn"
            >
              <FaWhatsapp size={18} /> Chat on WhatsApp
            </a>
            <Link to="/products" className="luxury-btn">Browse Collections</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const G   = '#C9A84C';
const GD  = '#8B6914';
const BG  = '#0A0A0A';
const CR  = '#F0EAD6';
const MU  = '#9A8866';

const INFO_CARDS = [
  {
    icon: <FiPhone size={22} />,
    title: 'Phone',
    detail: '+92 315 484 4005',
    href: 'tel:+923154844005',
  },
  {
    icon: <FiMail size={22} />,
    title: 'Email',
    detail: 'info@tayyabjewellers.pk',
    href: 'mailto:info@tayyabjewellers.pk',
  },
  {
    icon: <FiMapPin size={22} />,
    title: 'Address',
    detail: 'Main Market Township, Lahore, Pakistan',
    href: null,
  },
];

const HOURS = [
  { day: 'Monday – Saturday', time: '10:00 AM – 8:00 PM' },
  { day: 'Sunday',            time: 'Closed'              },
];

export default function Contact() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923154844005';

  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const { name, phone, message } = form;
    if (!name.trim() || !message.trim()) return;
    const text = encodeURIComponent(
      `Hi, I'm ${name}${phone ? ` (${phone})` : ''}.\n\n${message}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div style={{ background: BG, color: CR, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '72px 24px 56px', borderBottom: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: G, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'Cinzel, serif' }}>
          Tayyab Jewellers
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, fontFamily: 'Cormorant Garamond, serif', color: CR, marginBottom: 16 }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: 15, color: MU, maxWidth: 480, margin: '0 auto', lineHeight: 1.75, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          We're here to help — visit us, call us, or send a message.
        </p>
      </div>

      <div className="container" style={{ maxWidth: 960, padding: '56px 24px' }}>

        {/* ── Info Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
          {INFO_CARDS.map((c, i) => (
            <div key={i} style={{
              background: 'var(--black-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 12, padding: '28px 24px', textAlign: 'center',
              transition: 'border-color 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ color: G, marginBottom: 14 }}>{c.icon}</div>
              <p style={{ fontSize: 10, letterSpacing: 2.5, color: G, textTransform: 'uppercase', fontFamily: 'Cinzel, serif', marginBottom: 8 }}>{c.title}</p>
              {c.href
                ? <a href={c.href} style={{ fontSize: 14, color: CR, fontFamily: 'Jost, sans-serif', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = G}
                    onMouseLeave={e => e.currentTarget.style.color = CR}
                  >{c.detail}</a>
                : <p style={{ fontSize: 14, color: MU, fontFamily: 'Jost, sans-serif', margin: 0 }}>{c.detail}</p>
              }
            </div>
          ))}
        </div>

        {/* ── Business Hours ── */}
        <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '28px 32px', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <FiClock size={18} style={{ color: G }} />
            <p style={{ fontSize: 10, letterSpacing: 2.5, color: G, textTransform: 'uppercase', fontFamily: 'Cinzel, serif', margin: 0 }}>Business Hours</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {HOURS.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < HOURS.length - 1 ? 12 : 0, borderBottom: i < HOURS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: 14, color: MU }}>{h.day}</span>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: 14, color: h.time === 'Closed' ? '#ef4444' : CR, fontWeight: 500 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact Form + Map ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }} className="contact-grid">

          {/* Form */}
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '32px 28px' }}>
            <p style={{ fontSize: 10, letterSpacing: 2.5, color: G, textTransform: 'uppercase', fontFamily: 'Cinzel, serif', marginBottom: 20 }}>Send a Message</p>
            <form onSubmit={handleWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  name="name" required value={form.name} onChange={handleChange}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = G}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+92 300 0000000"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = G}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="message" required value={form.message} onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                  onFocus={e => e.currentTarget.style.borderColor = G}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                />
              </div>
              <button type="submit" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#fff', fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: 14,
                boxShadow: '0 4px 16px rgba(37,211,102,0.3)', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)'; }}
              >
                <FaWhatsapp size={17} /> Send via WhatsApp
              </button>
            </form>
          </div>

          {/* Map */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', minHeight: 380 }}>
            <iframe
              title="Tayyab Jewellers Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.6!2d74.3083912!3d31.4610019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901f2e2c34dfd%3A0xb8e7f8f332888a0c!2sTayyab%20Jewellers!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: 380 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ── CTA Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(139,105,20,0.06) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 14, padding: '40px 32px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, letterSpacing: 2.5, color: G, textTransform: 'uppercase', fontFamily: 'Cinzel, serif', marginBottom: 14 }}>Bespoke Service</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: CR, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, marginBottom: 12 }}>
            Looking for a Custom Design?
          </h2>
          <p style={{ color: MU, fontFamily: 'Jost, sans-serif', fontSize: 14, fontWeight: 300, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.75 }}>
            Bring us your sketch, photo, or idea — our master craftsmen will turn it into a one-of-a-kind piece in pure gold.
          </p>
          <Link to="/custom-order" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 30px', borderRadius: 50,
            background: `linear-gradient(135deg, ${G}, ${GD})`,
            color: BG, fontFamily: 'Jost, sans-serif', fontWeight: 700,
            fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(201,168,76,0.35)', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(201,168,76,0.35)'; }}
          >
            <FiSend size={14} /> Start Custom Order
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ── Shared styles ── */
const labelStyle = {
  display: 'block', fontSize: 11, letterSpacing: 1.5,
  color: MU, textTransform: 'uppercase',
  fontFamily: 'Cinzel, sans-serif', marginBottom: 7,
};

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--black-soft)', border: '1px solid var(--border-subtle)',
  borderRadius: 8, color: CR, fontSize: 13,
  fontFamily: 'Jost, sans-serif', outline: 'none',
  transition: 'border-color 0.2s',
};

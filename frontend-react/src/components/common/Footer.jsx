import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa';

// Site dark-gold palette
const GOLD       = '#C9A84C';
const GOLD_DARK  = '#8B6914';
const DARK       = '#0A0A0A';
const DARK_SOFT  = '#111111';
const DARK_CARD  = '#1A1A1A';
const CREAM      = '#F0EAD6';
const MUTED      = '#9A8866';
const BORDER_GOLD = 'rgba(201,168,76,0.18)';
const BORDER_SUB  = 'rgba(255,255,255,0.05)';

const COLLECTIONS = [
  { label: 'Bridal Sets',  to: '/products?category=bridal' },
  { label: 'Gold Rings',   to: '/products?category=rings' },
  { label: 'Bangles',      to: '/products?category=bangles' },
  { label: 'Necklaces',    to: '/products?category=necklaces' },
  { label: 'Earrings',     to: '/products?category=earrings' },
  { label: 'Tikka',        to: '/products?category=tikka' },
];
const QUICK_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'Collections',  to: '/products' },
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'Our Story',    to: '/about' },
  { label: 'Track Order',  to: '/orders' },
];
const COMPANY = [
  { label: 'About Us',     to: '/about' },
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'My Orders',    to: '/orders' },
  { label: 'Wishlist',     to: '/wishlist' },
];

const FLink = ({ to, label }) => (
  <li style={{ marginBottom: 10 }}>
    <Link to={to} style={{ fontFamily: 'Jost, sans-serif', fontSize: 13.5, color: MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.color = GOLD}
      onMouseLeave={e => e.currentTarget.style.color = MUTED}
    >{label}</Link>
  </li>
);

const ColHeading = ({ children }) => (
  <div style={{
    fontFamily: 'Cinzel, serif', fontWeight: 600, fontSize: 11,
    letterSpacing: '2px', textTransform: 'uppercase',
    color: GOLD, marginBottom: 20,
    paddingBottom: 10, borderBottom: `1px solid ${BORDER_GOLD}`,
  }}>
    {children}
  </div>
);

export default function Footer() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  const socials = [
    { icon: <FaLinkedin size={15} />,  href: '#',                         label: 'LinkedIn' },
    { icon: <FiFacebook size={15} />,  href: '#',                         label: 'Facebook' },
    { icon: <FiInstagram size={15} />, href: '#',                         label: 'Instagram' },
    { icon: <FaWhatsapp size={15} />,  href: `https://wa.me/${whatsapp}`, label: 'WhatsApp' },
  ];

  const contacts = [
    { icon: <FiPhone size={14} />,  text: '+92 300 000 0000',             href: 'tel:+923000000000' },
    { icon: <FiMail size={14} />,   text: 'info@tayyabjewellers.pk',       href: 'mailto:info@tayyabjewellers.pk' },
    { icon: <FiMapPin size={14} />, text: 'Main Bazar, Lahore, Punjab, Pakistan', href: null },
  ];

  return (
    <footer style={{ background: DARK_SOFT, color: MUTED }}>

      {/* Top gold accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      {/* Main Footer Body */}
      <div style={{ padding: '64px 0 48px' }}>
        <div className="container">
          <div className="row g-5">

            {/* Brand Column */}
            <div className="col-lg-4">
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 16px rgba(201,168,76,0.3)`,
                  flexShrink: 0,
                }}>
                  <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 17 }}>T</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', color: GOLD, lineHeight: 1.15 }}>TAYYAB</div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: '0.65rem', letterSpacing: '3px', color: CREAM, lineHeight: 1.15 }}>JEWELLERS</div>
                </div>
              </div>

              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: 13.5, color: MUTED, lineHeight: 1.85, maxWidth: 280, marginBottom: 28, fontWeight: 300 }}>
                Crafting legacy through pure gold and timeless design. Hallmark certified jewellery for every occasion — from bridal sets to everyday elegance.
              </p>

              {/* Social Icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {socials.map(({ icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      border: `1.5px solid ${BORDER_GOLD}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: MUTED, textDecoration: 'none', transition: 'all 0.25s',
                      background: DARK_CARD,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; e.currentTarget.style.boxShadow = `0 4px 14px rgba(201,168,76,0.2)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER_GOLD; e.currentTarget.style.color = MUTED; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="col-6 col-lg-2">
              <ColHeading>Collections</ColHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {COLLECTIONS.map(l => <FLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="col-6 col-lg-2">
              <ColHeading>Quick Links</ColHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {QUICK_LINKS.map(l => <FLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Company */}
            <div className="col-6 col-lg-1" style={{ minWidth: 120 }}>
              <ColHeading>Company</ColHeading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {COMPANY.map(l => <FLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Get in Touch */}
            <div className="col-lg-3">
              <ColHeading>Get in Touch</ColHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {contacts.map(({ icon, text, href }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                    {href ? (
                      <a href={href} style={{ fontFamily: 'Jost, sans-serif', fontSize: 13.5, color: MUTED, textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = GOLD}
                        onMouseLeave={e => e.currentTarget.style.color = MUTED}
                      >{text}</a>
                    ) : (
                      <span style={{ fontFamily: 'Jost, sans-serif', fontSize: 13.5, color: MUTED, lineHeight: 1.5 }}>{text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a href={`https://wa.me/${whatsapp}?text=Hi, I'm interested in your jewellery collection`}
                target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 50,
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
                  color: '#0A0A0A', fontFamily: 'Jost, sans-serif', fontWeight: 700,
                  fontSize: 12, textDecoration: 'none',
                  boxShadow: `0 4px 14px rgba(201,168,76,0.3)`,
                  transition: 'all 0.25s', letterSpacing: 0.5,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,168,76,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(201,168,76,0.3)'; }}
              >
                <FaWhatsapp size={14} /> WhatsApp Us <FiArrowRight size={12} />
              </a>

              {/* Payment Methods */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>Payment Methods</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['COD', 'Bank Transfer', 'JazzCash', 'EasyPaisa'].map(p => (
                    <span key={p} style={{
                      padding: '3px 10px', borderRadius: 4,
                      border: `1px solid ${BORDER_GOLD}`,
                      fontSize: 10, fontFamily: 'Jost, sans-serif',
                      color: MUTED, background: 'rgba(201,168,76,0.05)',
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: `1px solid ${BORDER_SUB}`, padding: '18px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontFamily: 'Jost, sans-serif', fontSize: 12, color: 'rgba(154,136,102,0.7)' }}>
            &copy; {new Date().getFullYear()} Tayyab Jewellers. All rights reserved. — Hallmark Certified | Pure Gold Guaranteed
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[{ label: 'Privacy Policy', to: '/about' }, { label: 'Terms of Service', to: '/about' }].map(l => (
              <Link key={l.label} to={l.to} style={{ fontFamily: 'Jost, sans-serif', fontSize: 12, color: 'rgba(154,136,102,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(154,136,102,0.7)'}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}

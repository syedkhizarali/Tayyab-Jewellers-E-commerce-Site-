import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';

/* ── colour tokens ── */
const G       = '#C9A84C';
const GD      = '#8B6914';
const DARK    = '#111111';
const CARD    = '#1A1A1A';
const CREAM   = '#F0EAD6';
const MUTED   = '#9A8866';
const BORDER  = 'rgba(201,168,76,0.18)';

/* ── data ── */
const COLLECTIONS = [
  { label: 'Bridal Sets',  to: '/products?category=bridal'    },
  { label: 'Gold Rings',   to: '/products?category=rings'     },
  { label: 'Bangles',      to: '/products?category=bangles'   },
  { label: 'Necklaces',    to: '/products?category=necklaces' },
  { label: 'Earrings',     to: '/products?category=earrings'  },
  { label: 'Tikka',        to: '/products?category=tikka'     },
];
const QUICK_LINKS = [
  { label: 'Home',         to: '/'             },
  { label: 'Collections',  to: '/products'     },
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'Our Story',    to: '/about'        },
  { label: 'Track Order',  to: '/orders'       },
];
const COMPANY = [
  { label: 'About Us',     to: '/about'        },
  { label: 'Contact Us',   to: '/contact'      },
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'My Orders',    to: '/orders'       },
  { label: 'Wishlist',     to: '/wishlist'     },
];

/* ── tiny helpers ── */
const FLink = ({ to, label }) => (
  <li style={{ marginBottom: 9 }}>
    <Link to={to} style={{ fontFamily: 'Jost, sans-serif', fontSize: 13.5, color: MUTED, textDecoration: 'none', transition: 'color .2s' }}
      onMouseEnter={e => e.currentTarget.style.color = G}
      onMouseLeave={e => e.currentTarget.style.color = MUTED}
    >{label}</Link>
  </li>
);

const ColHead = ({ children }) => (
  <p style={{
    fontFamily: 'Cinzel, serif', fontWeight: 600, fontSize: 11,
    letterSpacing: '2px', textTransform: 'uppercase', color: G,
    marginBottom: 18, paddingBottom: 10,
    borderBottom: `1px solid ${BORDER}`,
  }}>{children}</p>
);

export default function Footer() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  const socials = [
    { icon: <FaLinkedin size={15} />,   href: '#',                                              label: 'LinkedIn'    },
    { icon: <FiFacebook size={15} />,   href: '#',                                              label: 'Facebook'    },
    { icon: <FiInstagram size={15} />,  href: '#',                                              label: 'Instagram'   },
    { icon: <FaWhatsapp size={15} />,   href: `https://wa.me/${whatsapp}`,                      label: 'WhatsApp'    },
    { icon: <SiGooglemaps size={15} />, href: 'https://www.google.com/maps/place/Tayyab+Jewellers/@31.4610019,74.3083912,17z/data=!3m1!4b1!4m6!3m5!1s0x391901f2e2c34dfd:0xb8e7f8f332888a0c!8m2!3d31.4610019!4d74.3083912!16s%2Fg%2F11sd2zx7s4?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D', label: 'Google Maps' },
  ];

  return (
    <footer style={{ background: DARK, color: MUTED }}>

      {/* top gold accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent 0%, ${G} 40%, ${G} 60%, transparent 100%)` }} />

      {/* ── Main body ── */}
      <div style={{ padding: '72px 0 52px' }}>
        <div className="container">

          {/* CSS-Grid: 5 columns on ≥992 px, 2 cols on tablet, 1 col on phone */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '40px 32px',
            alignItems: 'start',
          }}
            className="footer-grid"
          >

            {/* Col 1 — Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              {/* logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,${G},${GD})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(201,168,76,0.3)',
                }}>
                  <span style={{ color: '#fff', fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 18 }}>T</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '2.5px', color: G, lineHeight: 1.2 }}>TAYYAB</div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 400, fontSize: '0.68rem', letterSpacing: '3.5px', color: CREAM, lineHeight: 1.2 }}>JEWELLERS</div>
                </div>
              </div>

              <p style={{ fontFamily: 'Jost,sans-serif', fontSize: 13, color: MUTED, lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
                Crafting legacy through pure gold and timeless design. Hallmark certified jewellery for every occasion.
              </p>

              {/* social icons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {socials.map(({ icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: `1.5px solid ${BORDER}`, background: CARD,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: MUTED, textDecoration: 'none', transition: 'all .25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,168,76,.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; e.currentTarget.style.boxShadow = 'none'; }}
                  >{icon}</a>
                ))}
              </div>
            </div>

            {/* Col 2 — Collections */}
            <div>
              <ColHead>Collections</ColHead>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {COLLECTIONS.map(l => <FLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Col 3 — Quick Links */}
            <div>
              <ColHead>Quick Links</ColHead>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {QUICK_LINKS.map(l => <FLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Col 4 — Company */}
            <div>
              <ColHead>Company</ColHead>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {COMPANY.map(l => <FLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Col 5 — Get in Touch */}
            <div>
              <ColHead>Get in Touch</ColHead>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
                {[
                  { icon: <FiPhone size={14} />,  text: '+92 315 484 4005',              href: 'tel:+923154844005' },
                  { icon: <FiMail size={14} />,   text: 'info@tayyabjewellers.pk',        href: 'mailto:info@tayyabjewellers.pk' },
                  { icon: <FiMapPin size={14} />, text: 'Main Market Township , Lahore, Pakistan',   href: null },
                ].map(({ icon, text, href }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: G, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                    {href
                      ? <a href={href} style={{ fontFamily: 'Jost,sans-serif', fontSize: 13, color: MUTED, textDecoration: 'none', lineHeight: 1.5, transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = G}
                          onMouseLeave={e => e.currentTarget.style.color = MUTED}
                        >{text}</a>
                      : <span style={{ fontFamily: 'Jost,sans-serif', fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{text}</span>
                    }
                  </div>
                ))}
              </div>

              {/* Payment badges */}
              <div style={{ marginTop: 20 }}>
                <p style={{ fontFamily: 'Cinzel,serif', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Payment Methods</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['COD', 'Bank Transfer', 'JazzCash', 'EasyPaisa'].map(p => (
                    <span key={p} style={{
                      padding: '3px 9px', borderRadius: 4, fontSize: 10,
                      fontFamily: 'Jost,sans-serif', color: MUTED,
                      border: `1px solid ${BORDER}`, background: 'rgba(201,168,76,.04)',
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '18px 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
          <span style={{ fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'rgba(154,136,102,.65)' }}>
            &copy; {new Date().getFullYear()} Tayyab Jewellers. All rights reserved. — Hallmark Certified | Pure Gold Guaranteed
          </span>
          <div style={{ display: 'flex', gap: 18 }}>
            {[{ label: 'Privacy Policy', to: '/about' }, { label: 'Terms of Service', to: '/about' }].map(l => (
              <Link key={l.label} to={l.to} style={{ fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'rgba(154,136,102,.65)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = G}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(154,136,102,.65)'}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}

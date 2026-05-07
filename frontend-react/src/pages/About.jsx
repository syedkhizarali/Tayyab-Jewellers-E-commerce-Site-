import { FiPhone, FiAward, FiTruck, FiRefreshCw, FiHeart, FiTool, FiFileText, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const PILLARS = [
  {
    icon: <FiTool size={20} />,
    title: 'Our own workshop',
    desc: 'Custom designs crafted in-house by our own skilled artisans, built exactly to your vision.',
  },
  {
    icon: <FiAward size={20} />,
    title: 'Pure 22K gold',
    desc: 'We specialise in 22-karat jewellery. What we say is what you get — no hidden karat downgrades.',
  },
  {
    icon: <FiFileText size={20} />,
    title: 'Wholesale pricing',
    desc: 'We charge making costs that compete with wholesalers — exceptional quality, fair price.',
  },
  {
    icon: <FiHeart size={20} />,
    title: 'Honest guidance',
    desc: 'We guide every customer on gold prices and quality — whether you buy from us or not.',
  },
  {
    icon: <FiRefreshCw size={20} />,
    title: 'Fair resale',
    desc: 'Sell back to us anytime. We deduct only the making charges — never a punishing markdown.',
  },
  {
    icon: <FiTruck size={20} />,
    title: 'Home delivery',
    desc: 'Safe, authenticated delivery to your door across Pakistan with full security measures.',
  },
];

const CERTS = [
  { label: 'Pakistan Gems & Jewellery', href: 'https://www.pgjdc.org/index.php' },
  { label: 'Lahore Sarafa Association',  href: 'https://www.ggapcpakistan.com/LDSJA.html' },
];

export default function About() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';
  const phone    = import.meta.env.VITE_PHONE_NUMBER    || '+923154844005';

  return (
    <div style={{ background: 'var(--black-rich)', color: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '72px 24px 56px', borderBottom: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold-primary)', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'Cinzel, serif' }}>
          Est. since 1989 · Lahore, Pakistan
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', marginBottom: 18 }}>
          Our Story
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          Four decades of craftsmanship, trust, and pure gold — built in Lahore, loved across Pakistan.
        </p>
      </div>

      {/* ── Who We Are ── */}
      <Section label="Who we are">
        <p style={bodyText}>
          Tayyab Jewellers was founded in 1989 in the heart of Lahore, Pakistan. What began as a humble workshop driven by passion for fine jewellery has grown into a name that thousands of families across Pakistan trust for their most precious moments — engagements, weddings, milestones, and everyday elegance.
        </p>
        <p style={bodyText}>
          For over 35 years, we have served our customers not just with jewellery, but with integrity. We are craftsmen, advisors, and partners in the most meaningful purchases of your life.
        </p>
        <blockquote style={{
          background: 'var(--black-card)',
          borderLeft: '3px solid var(--gold-primary)',
          borderRadius: '0 8px 8px 0',
          padding: '20px 24px',
          margin: '24px 0 0',
        }}>
          <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.7, margin: 0 }}>
            "We don't just deliver products — we deliver desires, shaped in gold."
          </p>
        </blockquote>
      </Section>

      {/* ── What Makes Us Different ── */}
      <Section label="What makes us different">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 8 }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{
              background: 'var(--black-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: '22px 18px',
              transition: 'border-color 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: 10 }}>{p.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', marginBottom: 6, fontFamily: 'Jost, sans-serif', letterSpacing: 0.3 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, fontWeight: 300, fontFamily: 'Jost, sans-serif' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Our Promise ── */}
      <Section label="Our promise to you">
        <p style={bodyText}>
          At Tayyab Jewellers, we believe jewellery is not just an investment — it is trust made tangible. That is why we only charge you for the exact gold weight in the piece you receive. We do not quote 24-karat and deliver 21-karat. Every price we give you is transparent, and every gram is accounted for.
        </p>
        <p style={bodyText}>
          When you decide to sell or return a piece, we honour your investment. We deduct only the making charges — the cost of the craftsman's work — and a small margin on our original profit. Never a 50% loss. Never fear when dealing with us.
        </p>
        <p style={{ ...bodyText, marginBottom: 0 }}>
          We also offer repair services at reasonable rates, and expert guidance in gold, silver, gemstones, and diamonds — including a full range of certified diamond jewellery.
        </p>
      </Section>

      {/* ── Certified & Trusted ── */}
      <Section label="Certified & trusted">
        <p style={bodyText}>
          Tayyab Jewellers is a certified member of the Lahore Sarafa Gold Association, the governing body for gold traders and jewellers in Lahore. Our hallmark-certified gold and our membership in the association is your assurance that every piece meets the highest standards of purity and authenticity.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          {CERTS.map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: 'var(--gold-primary)', textDecoration: 'none',
                border: '1px solid rgba(201,168,76,0.25)', borderRadius: 6,
                padding: '8px 14px', background: 'rgba(201,168,76,0.04)',
                fontFamily: 'Jost, sans-serif', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
            >
              <FiExternalLink size={13} /> {c.label}
            </a>
          ))}
        </div>
      </Section>

      {/* ── Visit Us ── */}
      <div style={{ borderBottom: 'none', textAlign: 'center', padding: '52px 24px 80px', maxWidth: 820, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold-primary)', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'Cinzel, serif' }}>Visit us</p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.8, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          Whether you are looking for a custom bridal set, a simple daily-wear ring, or guidance on an investment in gold — we are here for you. Walk in, call us, or place a custom order today.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`tel:${phone}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, var(--gold-primary), #8B6914)',
              color: 'var(--black-rich)', fontWeight: 600, fontSize: 14,
              padding: '12px 28px', borderRadius: 50, textDecoration: 'none',
              fontFamily: 'Jost, sans-serif', letterSpacing: 0.3,
              boxShadow: '0 4px 18px rgba(201,168,76,0.35)', transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(201,168,76,0.35)'; }}
          >
            <FiPhone size={15} /> +92 315 484 4005
          </a>
          <a
            href={`https://wa.me/${whatsapp}?text=Hi, I'd like to know more about Tayyab Jewellers`}
            target="_blank" rel="noreferrer"
            className="whatsapp-btn"
          >
            <FaWhatsapp size={17} /> Chat on WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}

/* ── Shared styles ── */
const bodyText = {
  fontSize: 15,
  lineHeight: 1.85,
  color: 'var(--text-muted)',
  marginBottom: 14,
  fontFamily: 'Jost, sans-serif',
  fontWeight: 300,
};

function Section({ label, children }) {
  return (
    <div style={{ padding: '44px 24px', borderBottom: '1px solid var(--border-subtle)', maxWidth: 820, margin: '0 auto' }}>
      <p style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold-primary)', textTransform: 'uppercase', marginBottom: 20, fontFamily: 'Cinzel, serif' }}>
        {label}
      </p>
      {children}
    </div>
  );
}

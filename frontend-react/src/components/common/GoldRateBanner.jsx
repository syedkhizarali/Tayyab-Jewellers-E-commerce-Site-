import { useEffect, useState } from 'react';
import { getLatestRates } from '../../api/rates';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

const KARAT_ORDER = [24, 22, 21, 18];

export default function GoldRateBanner() {
  const [rates, setRates]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchRates = async () => {
    try {
      const data = await getLatestRates();
      const sorted = KARAT_ORDER
        .map(k => data.find(r => r.karat === k))
        .filter(Boolean);
      setRates(sorted);
      setUpdatedAt(new Date());
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchRates();
    const id = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (n) => new Intl.NumberFormat('en-PK').format(Math.round(n));

  return (
    <section className="gold-rate-section section-pad">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
          <div>
            <span className="section-label">Live Market Rates</span>
            <h2 className="section-title mb-0">Today's Gold Prices</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiTrendingUp size={16} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif' }}>
              {updatedAt
                ? `Updated ${updatedAt.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}`
                : 'Loading…'}
            </span>
            <button
              onClick={fetchRates}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              aria-label="Refresh rates"
            >
              <FiRefreshCw size={13} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card flex-fill" style={{ height: 140 }}>
                <div className="skeleton" style={{ height: '100%', borderRadius: 'var(--radius)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-3">
            {rates.map(rate => (
              <div key={rate.id} className="col-6 col-md-3">
                <div className="rate-card">
                  <div className="rate-karat">{rate.karat}K Gold</div>
                  <div className="rate-tola">
                    PKR {fmt(rate.price_per_tola)}
                    <small>per tola (11.66g)</small>
                  </div>
                  <div className="rate-gram">PKR {fmt(rate.price_per_gram)} <small>/ gram</small></div>
                  <div className="rate-updated">{rate.source === 'live' ? '● Live' : '● Manual'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center', fontStyle: 'italic' }}>
          Rates are indicative. Final price calculated at time of order based on weight and making charges.
        </p>
      </div>
    </section>
  );
}

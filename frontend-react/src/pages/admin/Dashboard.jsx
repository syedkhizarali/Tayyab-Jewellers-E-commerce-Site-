import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiAlertTriangle, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { getProducts } from '../../api/products';
import { getAllOrders } from '../../api/orders';
import { getLowStockItems } from '../../api/inventory';
import { getLatestRates } from '../../api/rates';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const fmt = (n) => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n);

const StatCard = ({ label, value, icon, color, to }) => (
  <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '24px 20px', position: 'relative', overflow: 'hidden', transition: 'border-color var(--transition)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: color }} />
    <div style={{ color, marginBottom: 12, paddingLeft: 4 }}>{icon}</div>
    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'var(--cream)', fontWeight: 600, lineHeight: 1, marginBottom: 6, paddingLeft: 4 }}>{value}</div>
    <div style={{ fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: 4 }}>{label}</div>
    {to && (
      <Link to={to} style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 11, color, fontFamily: 'Cinzel, serif', letterSpacing: 1, textDecoration: 'none' }}>
        View →
      </Link>
    )}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, lowStock: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard — Tayyab Jewellers';
    Promise.allSettled([
      getProducts(),
      getAllOrders(),
      getLowStockItems(5),
      getLatestRates(),
    ]).then(([prods, orders, low, ratesRes]) => {
      setStats({
        products: prods.value?.length || 0,
        orders: orders.value?.length || 0,
        lowStock: low.value?.length || 0,
      });
      setLowStockItems(low.value || []);
      setRates(ratesRes.value || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: <FiShoppingBag size={24} />, to: '/admin/products/add', color: 'var(--gold-primary)' },
    { label: 'Total Orders',   value: stats.orders,   icon: <FiPackage size={24} />,     to: '/admin/orders',       color: '#4A90D9' },
    { label: 'Low Stock',      value: stats.lowStock, icon: <FiAlertTriangle size={24} />, to: null,                color: '#E05252' },
    { label: 'Rates',          value: rates.length > 0 ? 'Live' : 'N/A', icon: <FiTrendingUp size={24} />, to: null, color: '#4caf50' },
  ];

  const STATUS_COLORS = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: 'var(--black-soft)', borderBottom: '1px solid var(--border-subtle)', padding: '32px 0 24px' }}>
        <div className="container-fluid" style={{ maxWidth: 1300, padding: '0 24px' }}>
          <span className="section-label">Admin</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: '2rem', margin: '4px 0' }}>Dashboard</h1>
        </div>
      </div>

      <div className="container-fluid" style={{ maxWidth: 1300, padding: '32px 24px' }}>
        {/* Stats */}
        <div className="row g-3 mb-4">
          {statCards.map((c) => (
            <div key={c.label} className="col-6 col-lg-3">
              <StatCard {...c} />
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Gold Rates */}
          <div className="col-lg-6">
            <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div className="gold-divider" />
              <h5 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Live Gold Rates</h5>
              {rates.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No rates available.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Karat', 'Per Tola (PKR)', 'Per Gram (PKR)'].map(h => (
                      <span key={h} style={{ fontSize: 10, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</span>
                    ))}
                  </div>
                  {rates.map((r) => (
                    <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <strong style={{ color: 'var(--gold-primary)', fontFamily: 'Cinzel, serif', fontSize: 13 }}>{r.karat}</strong>
                      <span style={{ color: 'var(--cream)', fontSize: 13 }}>{fmt(r.price_per_tola)}</span>
                      <span style={{ color: 'var(--cream)', fontSize: 13 }}>{fmt(r.price_per_gram)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Low Stock */}
          <div className="col-lg-6">
            <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div style={{ width: 32, height: 2, background: '#E05252', marginBottom: 16 }} />
              <h5 style={{ fontFamily: 'Cinzel, serif', color: '#E05252', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Low Stock Alert</h5>
              {lowStockItems.length === 0 ? (
                <p style={{ color: '#10b981', fontSize: 13 }}>All items well stocked.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {lowStockItems.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--cream)', fontSize: 13 }}>{p.name}</span>
                      <span style={{ fontSize: 12, fontFamily: 'Cinzel, serif', color: p.stock_quantity === 0 ? '#ef4444' : '#f59e0b', border: `1px solid ${p.stock_quantity === 0 ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`, padding: '2px 10px', borderRadius: 3 }}>
                        {p.stock_quantity === 0 ? 'Out of stock' : `${p.stock_quantity} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-12">
            <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: 24 }}>
              <div className="gold-divider" />
              <h5 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Quick Actions</h5>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/admin/products/add" className="luxury-btn" style={{ padding: '10px 24px', fontSize: 12, textDecoration: 'none' }}>
                  <FiPlus size={14} style={{ marginRight: 6 }} />Add Product
                </Link>
                <Link to="/admin/orders" className="ghost-btn" style={{ padding: '10px 24px', fontSize: 12, textDecoration: 'none' }}>
                  <FiPackage size={14} style={{ marginRight: 6 }} />Manage Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

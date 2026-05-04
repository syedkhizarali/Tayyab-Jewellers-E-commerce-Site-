import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLE = {
  pending:    { color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  processing: { color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  shipped:    { color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  delivered:  { color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  cancelled:  { color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
};

const fmt = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return '—'; }
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.title = 'Manage Orders — Admin';
    getAllOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const filterCount = (s) => orders.filter((o) => o.status === s).length;

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: 'var(--black-soft)', borderBottom: '1px solid var(--border-subtle)', padding: '32px 0 24px' }}>
        <div className="container-fluid" style={{ maxWidth: 1300, padding: '0 24px' }}>
          <span className="section-label">Admin</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: '2rem', margin: '4px 0' }}>Manage Orders</h1>
        </div>
      </div>

      <div className="container-fluid" style={{ maxWidth: 1300, padding: '32px 24px' }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {['all', ...STATUSES].map((s) => {
            const active = filter === s;
            const style = s !== 'all' ? STATUS_STYLE[s] : null;
            return (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '6px 16px', borderRadius: 20, border: `1px solid ${active && style ? style.color : active ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                background: active ? (style ? `rgba(${style.color === '#f59e0b' ? '245,158,11' : style.color === '#3b82f6' ? '59,130,246' : style.color === '#8b5cf6' ? '139,92,246' : style.color === '#10b981' ? '16,185,129' : style.color === '#ef4444' ? '239,68,68' : '201,168,76'},0.12)` : 'rgba(201,168,76,0.12)') : 'transparent',
                color: active ? (style ? style.color : 'var(--gold-primary)') : 'var(--text-muted)',
                fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all var(--transition)',
              }}>
                {s} {s !== 'all' && `(${filterCount(s)})`}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '48px 0' }}>No orders found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Order ID', 'Customer', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontFamily: 'Cinzel, serif', letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const st = STATUS_STYLE[order.status] || { color: 'var(--text-muted)', border: 'var(--border-subtle)' };
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'Cinzel, serif', fontSize: 12, color: 'var(--gold-primary)' }}>#{order.id}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'var(--cream)', fontSize: 13 }}>{order.user?.name || `User #${order.user_id}`}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{order.user?.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <strong style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif', fontSize: 15 }}>{fmt(order.total_price)}</strong>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(order.placed_at)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 10, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: st.color, border: `1px solid ${st.border}`, padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            background: 'var(--black-soft)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)',
                            color: 'var(--cream)', fontSize: 12, padding: '6px 12px', cursor: 'pointer',
                            fontFamily: 'Jost, sans-serif',
                          }}
                        >
                          {STATUSES.map((s) => <option key={s} value={s} style={{ background: 'var(--black-soft)' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

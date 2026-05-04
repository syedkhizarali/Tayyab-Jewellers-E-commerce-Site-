import { useEffect, useState, useContext } from 'react';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getMyOrders } from '../api/orders';
import LoadingSpinner from '../components/common/LoadingSpinner';

const fmt     = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' });

const STATUS_CLASS = {
  pending:    'status-pending',
  processing: 'status-processing',
  shipped:    'status-shipped',
  delivered:  'status-delivered',
  cancelled:  'status-cancelled',
};

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  useEffect(() => {
    getMyOrders()
      .then(data => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', padding: '0 0 80px' }}>
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Account</span>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={52} style={{ color: 'var(--border-gold)', marginBottom: 16 }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: 8 }}>No orders yet</p>
            <p>Your order history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div>
                    <span className="order-id">Order #{String(order.id).padStart(5, '0')}</span>
                    <span className="order-date">{fmtDate(order.placed_at)}</span>
                  </div>
                  <div className="order-meta">
                    <span className={`status-badge ${STATUS_CLASS[order.status] || 'status-pending'}`}>
                      {order.status}
                    </span>
                    <span style={{ color: 'var(--gold-primary)', fontWeight: 600, fontSize: 14 }}>{fmt(order.total_price)}</span>
                    {expanded === order.id ? <FiChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <FiChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="order-card-body">
                    {/* Items */}
                    {order.items?.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Items</div>
                        {order.items.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-primary)' }}>Product #{item.product_id} × {item.quantity}</span>
                            <span style={{ color: 'var(--gold-primary)' }}>{fmt(item.total_price)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Delivery address */}
                    {order.delivery_address && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Delivery Address</div>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>{order.delivery_address}</p>
                      </div>
                    )}

                    {/* WhatsApp track */}
                    <a
                      href={`https://wa.me/${whatsapp}?text=Hi, I'd like to track my order #${String(order.id).padStart(5, '0')}`}
                      target="_blank" rel="noreferrer"
                      className="whatsapp-btn"
                      style={{ display: 'inline-flex', fontSize: 13, padding: '8px 16px' }}
                    >
                      <FaWhatsapp size={15} /> Track on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

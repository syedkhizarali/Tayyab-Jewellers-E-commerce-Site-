import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const fmt = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);
const FALLBACK = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=70';

export default function Wishlist() {
  const { items, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleMoveToCart = async (item) => {
    try {
      await addToCart(item.product_id, 1);
      await removeFromWishlist(item.id);
      toast.success('Moved to cart');
    } catch { toast.error('Could not move to cart'); }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Saved Items</span>
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">{items.length} saved piece{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        {items.length === 0 ? (
          <div className="empty-state">
            <FiHeart size={52} style={{ color: 'var(--border-gold)', marginBottom: 16 }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: 8 }}>Your wishlist is empty</p>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Save pieces you love by clicking the heart icon on any product.</p>
            <Link to="/products" className="luxury-btn">Browse Collections</Link>
          </div>
        ) : (
          <div className="row g-3">
            {items.map(item => {
              const p = item.product || {};
              const price = (p.price || 0) + (p.making_charge || 0);
              const img   = p.images ? `${import.meta.env.VITE_API_BASE_URL}/uploads/products/${p.images}` : FALLBACK;

              return (
                <div key={item.id} className="col-12">
                  <div className="wishlist-card">
                    <img src={img} alt={p.name} className="wishlist-img" onError={e => { e.target.src = FALLBACK; }} />
                    <div className="wishlist-info">
                      <Link to={`/products/${item.product_id}`} className="wishlist-name">{p.name || `Product #${item.product_id}`}</Link>
                      <div className="wishlist-price">{fmt(price)}</div>
                      <div className="wishlist-actions">
                        <button className="luxury-btn" style={{ padding: '8px 16px', fontSize: 11 }} onClick={() => handleMoveToCart(item)}>
                          <FiShoppingBag size={13} /> Move to Cart
                        </button>
                        <button className="ghost-btn" style={{ padding: '8px 12px', fontSize: 11 }} onClick={async () => { await removeFromWishlist(item.id); toast.info('Removed'); }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

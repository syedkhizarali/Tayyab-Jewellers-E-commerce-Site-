import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingBag, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const fmt = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

export default function CartSidebar() {
  const { items, loading, cartTotal, isOpen, setIsOpen, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); }
    else { navigate('/checkout'); }
  };

  return (
    <>
      <div className={`cart-overlay${isOpen ? ' active' : ''}`} onClick={() => setIsOpen(false)} />

      <div className={`cart-sidebar${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="cart-sidebar-header">
          <h5>YOUR CART {items.length > 0 && `(${items.length})`}</h5>
          <button className="icon-btn" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-sidebar-body">
          {loading ? (
            <div className="cart-empty">
              <div className="gold-spinner" style={{ '--sz': '32px' }} />
            </div>
          ) : items.length === 0 ? (
            <div className="cart-empty">
              <FiShoppingBag size={48} style={{ color: 'var(--border-gold)', marginBottom: 12 }} />
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'var(--cream)' }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: 13, marginBottom: 20 }}>Discover our jewellery collections</p>
              <button className="luxury-btn" onClick={() => { setIsOpen(false); navigate('/products'); }}>
                Browse Collections
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map(item => {
                const product = item.product || {};
                const price = (product.price || 0) + (product.making_charge || 0);
                const imageUrl = product.images
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/products/${product.images}`
                  : `https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=60`;

                return (
                  <li key={item.id} className="cart-item">
                    <img
                      src={imageUrl}
                      alt={product.name || 'Product'}
                      className="cart-item-img"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=60'; }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{product.name || 'Jewellery Item'}</div>
                      <div className="cart-item-price">{fmt(price)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="qty-control">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <FiMinus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ff6b6b', padding: '4px', cursor: 'pointer' }}
                          aria-label="Remove"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">{fmt(cartTotal)}</span>
            </div>
            <button className="luxury-btn w-100" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button
              className="ghost-btn w-100 mt-2"
              onClick={() => { setIsOpen(false); navigate('/products'); }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiShoppingBag, FiPackage, FiShield, FiRefreshCw, FiAward } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getProductById } from '../api/products';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const fmt = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);
const FALLBACK = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80';

const TABS = ['Description', 'Specifications', 'Care Instructions'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart }                               = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user }                                    = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [adding, setAdding]   = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return null;

  const { name, karat, category, weight_grams, price = 0, making_charge = 0, stock_quantity = 0, description, images } = product;
  const inStock    = stock_quantity > 0;
  const wishlisted = isInWishlist(product.id);
  const goldValue  = price * qty;
  const making     = making_charge * qty;
  const total      = goldValue + making;
  const imgUrl     = images ? `${import.meta.env.VITE_API_BASE_URL}/uploads/products/${images}` : FALLBACK;

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please sign in to add to cart'); navigate('/login', { state: { from: `/products/${id}` } }); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      toast.success(`${name} added to cart`);
    } catch { toast.error('Could not add to cart'); }
    finally { setAdding(false); }
  };

  const handleWishlist = async () => {
    if (!user) { toast.info('Please sign in'); return; }
    try {
      if (wishlisted) { await removeFromWishlist(product.id); toast.info('Removed from wishlist'); }
      else            { await addToWishlist(product.id);      toast.success('Saved to wishlist'); }
    } catch { toast.error('Could not update wishlist'); }
  };

  const waMsg = encodeURIComponent(`Hi, I'm interested in ${name} (${karat}K, ${weight_grams}g) — Total: ${fmt(total)}`);

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="ghost-btn mb-4" style={{ padding: '8px 16px', fontSize: 12 }}>
          <FiArrowLeft size={14} /> Back to Collections
        </button>

        <div className="row g-5">
          {/* Image */}
          <div className="col-lg-6">
            <div className="detail-img-main">
              <img src={imgUrl} alt={name} onError={e => { e.target.src = FALLBACK; }} />
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-6">
            <div className="detail-category">{category}</div>
            <h1 className="detail-name">{name}</h1>

            <div style={{ marginBottom: 20 }}>
              {karat         && <span className="spec-badge">{karat}K Gold</span>}
              {weight_grams  && <span className="spec-badge">{weight_grams}g</span>}
              <span className={`spec-badge ${inStock ? 'in-stock' : 'out-stock'}`}>
                {inStock ? `In Stock (${stock_quantity})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="detail-price-box mb-4">
              <div className="price-row">
                <span>Gold Value ({weight_grams}g)</span>
                <span className="val">{fmt(goldValue)}</span>
              </div>
              {making_charge > 0 && (
                <div className="price-row">
                  <span>Making Charges</span>
                  <span className="val">{fmt(making)}</span>
                </div>
              )}
              <div className="price-row total-row">
                <span>Total ({qty} pc)</span>
                <span className="val">{fmt(total)}</span>
              </div>
            </div>

            {/* Qty */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Quantity</div>
              <div className="qty-control-lg">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(stock_quantity, q + 1))} disabled={qty >= stock_quantity}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="detail-actions mb-4">
              <button className="luxury-btn flex-fill" onClick={handleAddToCart} disabled={!inStock || adding}>
                <FiShoppingBag size={15} /> {adding ? 'Adding…' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`ghost-btn${wishlisted ? '' : ''}`}
                style={wishlisted ? { borderColor: 'var(--gold-primary)', background: 'var(--gold-pale)' } : {}}
              >
                <FiHeart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <a
              href={`https://wa.me/${whatsapp}?text=${waMsg}`}
              target="_blank" rel="noreferrer"
              className="whatsapp-btn w-100 mb-4"
              style={{ justifyContent: 'center' }}
            >
              <FaWhatsapp size={18} /> Inquire on WhatsApp
            </a>

            {/* Guarantees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                [<FiAward />,   'Hallmark certified — purity guaranteed'],
                [<FiShield />,  'Secure checkout with bank-grade encryption'],
                [<FiPackage />, 'Insured delivery across Pakistan'],
                [<FiRefreshCw />,'Free resize for all rings'],
              ].map(([icon, text], i) => (
                <div key={i} className="guarantee-item">{icon} <span>{text}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 60 }}>
          <div className="detail-tabs">
            {TABS.map((t, i) => (
              <button key={t} className={`detail-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
            ))}
          </div>
          <div style={{ padding: '24px 0', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8 }}>
            {activeTab === 0 && <p>{description || 'A beautiful handcrafted piece made with pure gold and exceptional artisanship.'}</p>}
            {activeTab === 1 && (
              <div className="row g-3">
                {[['Metal Type', product.metal_type || 'Gold'], ['Karat', `${karat}K`], ['Weight', `${weight_grams}g`], ['Category', category], ['Stock', stock_quantity]].map(([k, v]) => (
                  <div key={k} className="col-6 col-md-4">
                    <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 14 }}>
                      <div style={{ fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: 'var(--gold-primary)', marginBottom: 4, textTransform: 'uppercase' }}>{k}</div>
                      <div style={{ color: 'var(--cream)', fontSize: 14 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 2 && (
              <ul style={{ paddingLeft: 20 }}>
                {['Store in a dry, cool place away from direct sunlight.', 'Clean gently with a soft cloth after each use.', 'Avoid contact with chemicals, perfumes, and chlorine.', 'Remove before swimming or heavy exercise.', 'Store separately to avoid scratching.'].map((t, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

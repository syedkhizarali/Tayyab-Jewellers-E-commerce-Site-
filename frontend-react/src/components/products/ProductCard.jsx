import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiShoppingBag } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const fmt = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

const FALLBACK = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=70';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const { id, name, karat, category, weight_grams, price = 0, making_charge = 0, stock_quantity = 0, images } = product;
  const totalPrice = price + making_charge;
  const inStock    = stock_quantity > 0;
  const wishlisted = isInWishlist(id);
  const imgUrl     = images
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/products/${images}`
    : FALLBACK;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please sign in to add items to cart'); return; }
    if (!inStock) return;
    setAdding(true);
    try {
      await addToCart(id, 1);
      toast.success(`${name} added to cart`);
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please sign in to save to wishlist'); return; }
    try {
      if (wishlisted) { await removeFromWishlist(id); toast.info('Removed from wishlist'); }
      else            { await addToWishlist(id);      toast.success('Added to wishlist'); }
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img
          src={imgUrl}
          alt={name}
          className="product-img"
          loading="lazy"
          onError={e => { e.target.src = FALLBACK; }}
        />

        {karat && <span className="badge-karat">{karat}K</span>}
        {!inStock && <div className="badge-out-of-stock">Out of Stock</div>}

        <div className="product-overlay">
          <button
            className={`overlay-btn${wishlisted ? ' active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/products/${id}`} className="overlay-btn" aria-label="View details">
            <FiEye size={14} />
          </Link>
        </div>
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span className="product-category">{category || 'Jewellery'}</span>
          {weight_grams && <span className="product-weight">{weight_grams}g</span>}
        </div>
        <div className="product-name">
          <Link to={`/products/${id}`}>{name}</Link>
        </div>
        <div className="product-price">
          {fmt(totalPrice)}
          {making_charge > 0 && (
            <span className="making-charge">incl. PKR {making_charge.toLocaleString()} making</span>
          )}
        </div>
        <button
          className="luxury-btn btn-add-cart"
          onClick={handleAddToCart}
          disabled={!inStock || adding}
        >
          {adding ? 'Adding…' : inStock ? <><FiShoppingBag size={13} /> Add to Cart</> : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

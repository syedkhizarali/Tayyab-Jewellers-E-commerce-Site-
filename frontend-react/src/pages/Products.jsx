import { useEffect, useState, useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import { getProducts, searchProducts } from '../api/products';

const EMPTY_FILTERS = { category: '', metal_type: '', karat: '', min_price: '', max_price: '', in_stock: false };

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState(searchParams.get('query') || '');
  const [filters, setFilters]   = useState({
    ...EMPTY_FILTERS,
    category: searchParams.get('category') || '',
  });
  const [skip, setSkip]   = useState(0);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilters = query || Object.values(filters).some(v => v !== '' && v !== false);
      const params = { skip, limit: LIMIT, ...(query ? { query } : {}), ...filters };
      const data = hasFilters ? await searchProducts(params) : await getProducts({ skip, limit: LIMIT });
      setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query, filters, skip]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSkip(0);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setQuery('');
    setSkip(0);
    setSearchParams({});
  };

  return (
    <div className="products-page">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Browse & Discover</span>
          <h1 className="page-title">Our Collections</h1>
          <p className="page-subtitle">Handcrafted jewellery in pure gold — {products.length > 0 ? `${products.length} pieces available` : 'browse our full range'}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 12px' }}>
        {/* Toolbar */}
        <div className="products-toolbar">
          <form onSubmit={handleSearch} className="search-bar-wrap">
            <FiSearch className="search-icon" size={16} />
            <input
              type="text"
              className="search-input-lg"
              placeholder="Search by name, metal, style…"
              value={query}
              onChange={e => { setQuery(e.target.value); setSkip(0); }}
            />
          </form>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="results-count">{loading ? '…' : `${products.length} results`}</span>
            <ProductFilter filters={filters} onChange={f => { setFilters(f); setSkip(0); }} onReset={handleReset} />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <FiSearch size={48} style={{ color: 'var(--border-gold)', marginBottom: 16 }} />
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: 8 }}>No pieces found</p>
            <p style={{ fontSize: 14 }}>Try different keywords or clear your filters</p>
            <button className="ghost-btn mt-3" onClick={handleReset}>Clear Filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length === LIMIT && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="ghost-btn" onClick={() => setSkip(s => s + LIMIT)}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}

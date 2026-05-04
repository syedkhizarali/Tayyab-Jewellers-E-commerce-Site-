import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const METAL_TYPES = ['Gold', 'Silver', 'Platinum', 'Rose Gold'];
const KARATS      = [24, 22, 21, 18];
const CATEGORIES  = ['Bridal', 'Rings', 'Necklaces', 'Bangles', 'Earrings', 'Gemstones', 'Custom'];

export default function ProductFilter({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false);

  const hasActive = Object.values(filters).some(v => v !== '' && v !== null && v !== false && v !== undefined);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-wrap">
      <button
        className={`btn-filter${hasActive ? ' active' : ''}`}
        onClick={() => setOpen(p => !p)}
      >
        <FiFilter size={14} />
        Filters
        {hasActive && (
          <span style={{
            background: 'var(--gold-primary)', color: 'var(--black-rich)',
            borderRadius: '50%', width: 16, height: 16,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
          }}>!</span>
        )}
      </button>

      {open && <div className="filter-backdrop" onClick={() => setOpen(false)} />}

      <div className={`filter-panel${open ? ' open' : ''}`}>
        <div className="filter-panel-header">
          FILTERS
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <FiX size={16} />
          </button>
        </div>

        <div className="filter-body">
          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <select className="form-select" value={filters.category || ''} onChange={e => set('category', e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>

          {/* Metal */}
          <div className="filter-group">
            <label>Metal Type</label>
            <select className="form-select" value={filters.metal_type || ''} onChange={e => set('metal_type', e.target.value)}>
              <option value="">All Metals</option>
              {METAL_TYPES.map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
            </select>
          </div>

          {/* Karat */}
          <div className="filter-group">
            <label>Karat</label>
            <select className="form-select" value={filters.karat || ''} onChange={e => set('karat', e.target.value ? parseInt(e.target.value) : '')}>
              <option value="">All Karats</option>
              {KARATS.map(k => <option key={k} value={k}>{k}K</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range (PKR)</label>
            <div className="price-range">
              <input
                type="number"
                className="form-control"
                placeholder="Min"
                value={filters.min_price || ''}
                onChange={e => set('min_price', e.target.value ? parseFloat(e.target.value) : '')}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                value={filters.max_price || ''}
                onChange={e => set('max_price', e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
          </div>

          {/* In Stock */}
          <div className="filter-group">
            <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                className="form-check-input"
                id="inStockFilter"
                checked={!!filters.in_stock}
                onChange={e => set('in_stock', e.target.checked)}
                style={{ margin: 0 }}
              />
              <label className="form-check-label" htmlFor="inStockFilter" style={{ fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', margin: 0, letterSpacing: 0, textTransform: 'none', fontFamily: 'Jost, sans-serif' }}>
                In Stock Only
              </label>
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button className="ghost-btn w-100" onClick={() => { onReset(); setOpen(false); }} style={{ fontSize: 11 }}>
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}

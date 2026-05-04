import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiUpload, FiX } from 'react-icons/fi';
import { createProduct, uploadProductImage } from '../../api/products';

const METALS     = ['Gold', 'Silver', 'Platinum', 'Rose Gold'];
const KARATS     = ['24K', '22K', '21K', '18K', '14K', '925 Silver'];
const CATEGORIES = ['rings', 'necklaces', 'bracelets', 'earrings', 'bangles', 'pendants', 'sets', 'other'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => { document.title = 'Add Product — Admin'; }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        price:          parseFloat(data.price),
        making_charge:  parseFloat(data.making_charge || 0),
        weight_grams:   parseFloat(data.weight_grams || 0),
        stock_quantity: parseInt(data.stock_quantity || 0),
      };
      const product = await createProduct(payload);
      if (imageFile) {
        try { await uploadProductImage(product.id, imageFile); }
        catch { toast.warn('Product created but image upload failed'); }
      }
      toast.success('Product created!');
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to create product');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const Label = ({ children }) => (
    <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
      {children}
    </label>
  );

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ background: 'var(--black-soft)', borderBottom: '1px solid var(--border-subtle)', padding: '32px 0 24px' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="section-label">Admin</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: '2rem', margin: '4px 0' }}>Add New Product</h1>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 860, paddingTop: 40 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '32px', marginBottom: 24 }}>
            <div className="gold-divider" />
            <h5 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Product Image</h5>

            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed var(--border-gold)', borderRadius: 'var(--radius)',
              minHeight: 200, cursor: 'pointer', overflow: 'hidden', position: 'relative',
              background: preview ? 'transparent' : 'rgba(201,168,76,0.02)', transition: 'border-color var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 280, objectFit: 'contain' }} />
                  <button type="button" onClick={(e) => { e.preventDefault(); setPreview(null); setImageFile(null); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <FiX size={14} />
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <FiUpload size={32} style={{ color: 'var(--gold-primary)', marginBottom: 12 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Click to upload product image</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>PNG, JPG up to 5MB</p>
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
          </div>

          <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '32px' }}>
            <div className="gold-divider" />
            <h5 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Product Details</h5>

            <div className="row g-3">
              <div className="col-12">
                <Label>Product Name *</Label>
                <input className={`form-control${errors.name ? ' is-invalid' : ''}`} placeholder="e.g. Classic 22K Gold Ring"
                  {...register('name', { required: 'Name is required' })} />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="col-md-6">
                <Label>Metal Type *</Label>
                <select className={`form-select${errors.metal_type ? ' is-invalid' : ''}`} {...register('metal_type', { required: true })}>
                  <option value="">Select metal</option>
                  {METALS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <Label>Karat / Purity</Label>
                <select className="form-select" {...register('karat')}>
                  <option value="">Select karat</option>
                  {KARATS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <Label>Category</Label>
                <select className="form-select" {...register('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <Label>Weight (grams)</Label>
                <input type="number" step="0.01" className="form-control" placeholder="e.g. 8.5" {...register('weight_grams')} />
              </div>

              <div className="col-md-4">
                <Label>Price (PKR) *</Label>
                <input type="number" step="0.01" className={`form-control${errors.price ? ' is-invalid' : ''}`}
                  placeholder="e.g. 45000" {...register('price', { required: 'Price required', min: { value: 0, message: 'Invalid' } })} />
                {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
              </div>

              <div className="col-md-4">
                <Label>Making Charges (PKR)</Label>
                <input type="number" step="0.01" className="form-control" placeholder="e.g. 2000" {...register('making_charge')} />
              </div>

              <div className="col-md-4">
                <Label>Stock Quantity *</Label>
                <input type="number" className={`form-control${errors.stock_quantity ? ' is-invalid' : ''}`}
                  placeholder="e.g. 10" {...register('stock_quantity', { required: true, min: 0 })} />
              </div>

              <div className="col-12">
                <Label>Description</Label>
                <textarea className="form-control" rows={4} placeholder="Describe the product — design details, occasion, craftsmanship..." {...register('description')} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button type="submit" className="luxury-btn" disabled={isSubmitting} style={{ padding: '12px 32px' }}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
              <button type="button" className="ghost-btn" onClick={() => navigate('/admin')} style={{ padding: '12px 20px', fontSize: 12 }}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiCreditCard, FiSmartphone, FiTruck, FiMapPin, FiPlus, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getAddresses, createAddress } from '../api/addresses';
import { createOrder } from '../api/orders';
import { createPayment } from '../api/payments';

const fmt = (n) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

const PAYMENT_METHODS = [
  { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: <FiTruck size={18} />, desc: 'Pay when your order arrives' },
  { id: 'jazz_cash',        label: 'JazzCash',         icon: <FiSmartphone size={18} />, desc: 'Mobile wallet payment' },
  { id: 'easypaisa',        label: 'EasyPaisa',        icon: <FiSmartphone size={18} />, desc: 'Mobile wallet payment' },
  { id: 'bank_transfer',    label: 'Bank Transfer',    icon: <FiCreditCard size={18} />, desc: 'Direct IBFT / bank transfer' },
];

const BANK_DETAILS = [
  { label: 'Bank',           value: 'HBL — Habib Bank Limited' },
  { label: 'Account Title',  value: 'Tayyab Jewellers' },
  { label: 'Account No',     value: 'XXXX-XXXX-XXXX' },
  { label: 'IBAN',           value: 'PK00HABB0000000000000000' },
];

const STEPS = ['Address', 'Payment', 'Confirm'];

export default function Checkout() {
  const { items, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [placing, setPlacing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    document.title = 'Checkout — Tayyab Jewellers';
    if (items.length === 0) navigate('/products');
    getAddresses()
      .then((data) => {
        setAddresses(data || []);
        const def = data?.find((a) => a.is_default) || data?.[0];
        if (def) setSelectedAddress(def.id);
      })
      .catch(() => {});
  }, [items.length, navigate]);

  const saveNewAddress = async (data) => {
    try {
      const addr = await createAddress({ ...data, is_default: false });
      setAddresses((prev) => [...prev, addr]);
      setSelectedAddress(addr.id);
      setShowNewAddr(false);
      toast.success('Address saved');
    } catch { toast.error('Could not save address'); }
  };

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      const addr = addresses.find((a) => a.id === selectedAddress);
      const order = await createOrder({
        delivery_address: `${addr.address_line1}, ${addr.city}`,
        delivery_region: addr.state || addr.city,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.product?.price || 0 })),
      });
      if (paymentMethod !== 'cash_on_delivery') {
        await createPayment({ order_id: order.id, method: paymentMethod, amount: cartTotal, currency: 'PKR' });
      }
      await fetchCart();
      toast.success('Order placed! We\'ll confirm via WhatsApp.');
      navigate('/orders');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  const selectedAddr = addresses.find((a) => a.id === selectedAddress);

  return (
    <div style={{ background: 'var(--black-rich)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-hero" style={{ padding: '48px 0 32px' }}>
        <div className="container">
          <span className="section-label">Secure Checkout</span>
          <h1 className="page-title">Complete Your Order</h1>
        </div>
      </div>

      {/* Step progress */}
      <div className="container" style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, maxWidth: 480, margin: '0 auto 40px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: i < step ? 'pointer' : 'default' }}
                onClick={() => i < step && setStep(i)}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i < step ? 'var(--gold-primary)' : i === step ? 'transparent' : 'transparent',
                  border: `2px solid ${i <= step ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                  color: i < step ? 'var(--black-rich)' : i === step ? 'var(--gold-primary)' : 'var(--text-muted)',
                  fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600, transition: 'all 0.3s',
                }}>
                  {i < step ? <FiCheck size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, fontFamily: 'Cinzel, serif', letterSpacing: 1, color: i <= step ? 'var(--gold-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? 'var(--gold-primary)' : 'var(--border-subtle)', margin: '0 8px', marginBottom: 24, transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">

            {/* Step 0: Address */}
            {step === 0 && (
              <div className="checkout-section">
                <h5 className="checkout-section-title"><FiMapPin size={16} /> Delivery Address</h5>

                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', marginTop: 16 }}>
                  {addresses.map((addr) => (
                    <label key={addr.id} onClick={() => setSelectedAddress(addr.id)} style={{
                      display: 'block', padding: '16px 18px', borderRadius: 'var(--radius)',
                      border: `1.5px solid ${selectedAddress === addr.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      background: selectedAddress === addr.id ? 'rgba(201,168,76,0.06)' : 'var(--black-card)',
                      cursor: 'pointer', transition: 'all var(--transition)',
                    }}>
                      <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)} style={{ display: 'none' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ color: 'var(--cream)', fontFamily: 'Jost, sans-serif', fontSize: 14 }}>{addr.full_name}</strong>
                        {addr.is_default && <span style={{ fontSize: 10, fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', border: '1px solid var(--border-gold)', padding: '2px 6px', borderRadius: 3 }}>Default</span>}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '6px 0 2px' }}>{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{addr.city}, {addr.state}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '4px 0 0' }}>{addr.phone}</p>
                    </label>
                  ))}

                  <button onClick={() => setShowNewAddr(!showNewAddr)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '24px', borderRadius: 'var(--radius)', border: '1.5px dashed var(--border-subtle)',
                    background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', minHeight: 120,
                    transition: 'border-color var(--transition)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <FiPlus size={20} />
                    <span style={{ fontSize: 13, fontFamily: 'Cinzel, serif', letterSpacing: 1 }}>Add Address</span>
                  </button>
                </div>

                {showNewAddr && (
                  <form onSubmit={handleSubmit(saveNewAddress)} style={{ marginTop: 24, padding: 20, background: 'var(--black-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)' }}>
                    <h6 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>New Address</h6>
                    <div className="row g-3">
                      <div className="col-md-6"><input className={`form-control${errors.full_name ? ' is-invalid' : ''}`} placeholder="Full Name *" {...register('full_name', { required: true })} /></div>
                      <div className="col-md-6"><input className={`form-control${errors.phone ? ' is-invalid' : ''}`} placeholder="Phone *" {...register('phone', { required: true })} /></div>
                      <div className="col-12"><input className={`form-control${errors.address_line1 ? ' is-invalid' : ''}`} placeholder="Address Line 1 *" {...register('address_line1', { required: true })} /></div>
                      <div className="col-12"><input className="form-control" placeholder="Address Line 2" {...register('address_line2')} /></div>
                      <div className="col-md-4"><input className={`form-control${errors.city ? ' is-invalid' : ''}`} placeholder="City *" {...register('city', { required: true })} /></div>
                      <div className="col-md-4"><input className={`form-control${errors.state ? ' is-invalid' : ''}`} placeholder="Province *" {...register('state', { required: true })} /></div>
                      <div className="col-md-4"><input className="form-control" placeholder="Postal Code" {...register('postal_code')} /></div>
                      <div className="col-12">
                        <button type="submit" className="luxury-btn" style={{ padding: '10px 24px', fontSize: 12 }}>Save Address</button>
                        <button type="button" onClick={() => setShowNewAddr(false)} className="ghost-btn" style={{ padding: '10px 16px', fontSize: 12, marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  </form>
                )}

                <div style={{ marginTop: 24, textAlign: 'right' }}>
                  <button className="luxury-btn" onClick={() => { if (!selectedAddress) { toast.error('Select an address'); return; } setStep(1); }}
                    style={{ padding: '12px 32px' }}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-section">
                <h5 className="checkout-section-title"><FiCreditCard size={16} /> Payment Method</h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {PAYMENT_METHODS.map((pm) => (
                    <label key={pm.id} onClick={() => setPaymentMethod(pm.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                      borderRadius: 'var(--radius)',
                      border: `1.5px solid ${paymentMethod === pm.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      background: paymentMethod === pm.id ? 'rgba(201,168,76,0.06)' : 'var(--black-card)',
                      cursor: 'pointer', transition: 'all var(--transition)',
                    }}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)} style={{ display: 'none' }} />
                      <span style={{ color: paymentMethod === pm.id ? 'var(--gold-primary)' : 'var(--text-muted)' }}>{pm.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, color: 'var(--cream)', letterSpacing: 0.5 }}>{pm.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{pm.desc}</div>
                      </div>
                      {paymentMethod === pm.id && <FiCheck size={16} style={{ marginLeft: 'auto', color: 'var(--gold-primary)' }} />}
                    </label>
                  ))}
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(201,168,76,0.05)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)' }}>
                    <div className="gold-divider" />
                    <h6 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Bank Details</h6>
                    {BANK_DETAILS.map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <strong style={{ color: 'var(--cream)', fontFamily: 'Jost, sans-serif' }}>{value}</strong>
                      </div>
                    ))}
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, marginBottom: 0 }}>Transfer the exact amount and include your name in remarks. Admin will verify and confirm your order.</p>
                  </div>
                )}

                {(paymentMethod === 'jazz_cash' || paymentMethod === 'easypaisa') && (
                  <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(201,168,76,0.05)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius)', fontSize: 13 }}>
                    <p style={{ color: 'var(--cream)', marginBottom: 4 }}>Send to: <strong>0300-0000000</strong> (Tayyab Jewellers)</p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Save your transaction ID — you'll need it for order confirmation.</p>
                  </div>
                )}

                <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                  <button className="ghost-btn" onClick={() => setStep(0)} style={{ padding: '12px 24px', fontSize: 12 }}>Back</button>
                  <button className="luxury-btn" onClick={() => setStep(2)} style={{ padding: '12px 32px' }}>Review Order</button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="checkout-section">
                <h5 className="checkout-section-title"><FiCheck size={16} /> Review & Confirm</h5>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ padding: '16px 20px', background: 'var(--black-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold-primary)', textTransform: 'uppercase' }}>Delivering to</span>
                      <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    </div>
                    {selectedAddr && (
                      <>
                        <p style={{ color: 'var(--cream)', fontSize: 14, marginBottom: 2 }}>{selectedAddr.full_name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 2 }}>{selectedAddr.address_line1}, {selectedAddr.city}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 0 }}>{selectedAddr.phone}</p>
                      </>
                    )}
                  </div>

                  <div style={{ padding: '16px 20px', background: 'var(--black-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold-primary)', textTransform: 'uppercase' }}>Payment</span>
                      <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    </div>
                    <p style={{ color: 'var(--cream)', fontSize: 14, marginBottom: 0 }}>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</p>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                  <button className="ghost-btn" onClick={() => setStep(1)} style={{ padding: '12px 24px', fontSize: 12 }}>Back</button>
                  <button className="luxury-btn" onClick={placeOrder} disabled={placing} style={{ padding: '14px 36px', minWidth: 160 }}>
                    {placing ? <><span className="spinner-border spinner-border-sm me-2" />Placing...</> : 'Place Order'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div style={{ background: 'var(--black-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: 24, position: 'sticky', top: 100 }}>
              <h5 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Order Summary</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13, flex: 1 }}>{item.product?.name} <span style={{ color: 'var(--border-gold)' }}>×{item.quantity}</span></span>
                    <span style={{ color: 'var(--cream)', fontSize: 13, whiteSpace: 'nowrap' }}>{fmt((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ color: 'var(--cream)' }}>{fmt(cartTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                  <span style={{ color: '#4caf50', fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 1 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-gold)' }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: 16 }}>Total</span>
                  <strong style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--gold-primary)', fontSize: 18 }}>{fmt(cartTotal)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { register as apiRegister } from '../api/auth';

export default function Register() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm();

  const onSubmit = async ({ name, email, phone, password }) => {
    try {
      await apiRegister({ name, email, phone, password });
      await login(email, password);
      toast.success('Account created! Welcome to Tayyab Jewellers.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-panel" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&q=80')" }} />

      <div className="auth-form-panel">
        <div className="auth-card">
          <Link to="/" className="auth-logo">TAYYAB JEWELLERS</Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-sub">Join thousands of happy customers across Pakistan</p>

          {errors.root && <div className="auth-error">{errors.root.message}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control${errors.name ? ' is-invalid' : ''}`}
                placeholder="Your full name"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control${errors.email ? ' is-invalid' : ''}`}
                placeholder="your@email.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number <span style={{ color: 'var(--text-muted)', fontFamily: 'Jost', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input
                type="tel"
                className="form-control"
                placeholder="+92 300 0000000"
                {...register('phone')}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control${errors.password ? ' is-invalid' : ''}`}
                placeholder="Min 6 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control${errors.confirm ? ' is-invalid' : ''}`}
                placeholder="Re-enter password"
                {...register('confirm', {
                  required: 'Please confirm your password',
                  validate: v => v === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirm && <div className="invalid-feedback">{errors.confirm.message}</div>}
            </div>

            <button type="submit" className="luxury-btn w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

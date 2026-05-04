import { useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user, navigate, from]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="auth-page">
      {/* Left image panel */}
      <div className="auth-image-panel" />

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <Link to="/" className="auth-logo">TAYYAB JEWELLERS</Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-sub">Sign in to your account to continue</p>

          {errors.root && <div className="auth-error">{errors.root.message}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
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

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                className={`form-control${errors.password ? ' is-invalid' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <button type="submit" className="luxury-btn w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

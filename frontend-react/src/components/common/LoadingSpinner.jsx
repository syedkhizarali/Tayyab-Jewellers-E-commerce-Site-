export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const sizeMap = { sm: 24, md: 40, lg: 64 };
  const px = sizeMap[size] || 40;

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--black-rich)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, gap: 16,
      }}>
        <div className="gold-spinner" style={{ '--sz': `${px}px` }} />
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Loading
        </span>
      </div>
    );
  }

  return (
    <div className="spinner-wrap" style={{ padding: '40px 0' }}>
      <div className="gold-spinner" style={{ '--sz': `${px}px` }} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div style={{ padding: '12px 14px 16px' }}>
        <div className="skeleton skeleton-text short" style={{ marginLeft: 0 }} />
        <div className="skeleton skeleton-text" style={{ marginLeft: 0 }} />
        <div className="skeleton skeleton-text short" style={{ marginLeft: 0 }} />
        <div className="skeleton skeleton-btn" style={{ margin: '12px 0 0' }} />
      </div>
    </div>
  );
}

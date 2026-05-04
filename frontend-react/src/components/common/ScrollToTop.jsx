import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: 28, right: 28,
        width: 46, height: 46, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)',
        color: '#fff', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 18px rgba(26,26,46,0.35)',
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.85)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)';
        e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,168,76,0.45)';
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(26,26,46,0.35)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <FiArrowUp size={18} />
    </button>
  );
}

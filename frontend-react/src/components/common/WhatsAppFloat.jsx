import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000';
  const msg = encodeURIComponent("Hi, I'm interested in your jewellery collection at Tayyab Jewellers.");

  return (
    <div className="whatsapp-float">
      <a
        href={`https://wa.me/${whatsapp}?text=${msg}`}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <div className="whatsapp-pulse" />
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
}

import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ImageModal = ({ isOpen, onClose, imageUrl, productUrl }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const handleShare = async () => {
    const url = productUrl || window.location.href;
    
    // Si el navegador soporta Web Share API, usarla
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Enigma Artesanías y Accesorios',
          url: url,
        });
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      // Si no, mostrar menú personalizado
      setShowShareMenu(!showShareMenu);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      action: () => {
        const url = productUrl || window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
      },
    },
    {
      name: 'Gmail',
      icon: '📧',
      color: 'bg-red-500',
      action: () => {
        const url = productUrl || window.location.href;
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
      },
    },
    {
      name: 'Facebook',
      icon: 'f',
      color: 'bg-blue-600',
      action: () => {
        const url = productUrl || window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
      },
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      color: 'bg-gray-800',
      action: () => {
        const url = productUrl || window.location.href;
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
        setShowShareMenu(false);
      },
    },
    {
      name: 'Copiar enlace',
      icon: '🔗',
      color: 'bg-purple-500',
      action: async () => {
        try {
          const url = productUrl || window.location.href;
          await navigator.clipboard.writeText(url);
          alert('¡Enlace copiado al portapapeles!');
          setShowShareMenu(false);
        } catch (err) {
          console.error('Error al copiar:', err);
        }
      },
    },
  ];

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md sm:max-w-lg md:max-w-2xl w-full overflow-hidden">
        {/* Botón de cierre elegante */}
        <button
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition-all duration-200 z-20 shadow-lg hover:scale-110"
          onClick={onClose}
          title="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Componente principal de zoom y paneo */}
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          doubleClick={{ disabled: false, step: 0.2 }}
          wheel={{ step: 0.1, disabled: false }}
          pinch={{ step: 0.1, disabled: false }}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <TransformComponent>
                {/* La imagen que se puede hacer zoom */}
                <img
                  src={imageUrl}
                  alt="Imagen ampliada del producto"
                  className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] object-contain"
                />
              </TransformComponent>

              {/* Controles de zoom - Panel mejorado */}
              <div className="flex gap-2 p-4 bg-gray-50 border-t border-gray-200 justify-center flex-wrap">
                <button
                  onClick={() => zoomOut()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center"
                  title="Alejarse (-)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 text-sm font-medium"
                  title="Reiniciar vista"
                >
                  Restablecer
                </button>
                <button
                  onClick={() => zoomIn()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center"
                  title="Acercarse (+)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleShare}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center"
                  title="Compartir enlace"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.589 14.229 10.734 15 12 15c2.21 0 4-1.79 4-4 0-1.266-.771-2.411-1.858-3.316m0 0a9.728 9.728 0 00-5.656-1.684H7a6 6 0 006 6v0m-6-6a9.73 9.73 0 015.656 1.684m0 0A6 6 0 0121 12a6 6 0 01-9 5.659m0 0H15" />
                  </svg>
                </button>
              </div>

              {/* Menú de compartir */}
              {showShareMenu && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-4 z-20 min-w-[280px]">
                  <h3 className="text-white text-sm font-semibold mb-3">Compartir por medio</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {shareOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={option.action}
                        className={`${option.color} text-white py-2 px-3 rounded-lg text-sm font-medium hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2`}
                      >
                        <span>{option.icon}</span>
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instrucciones */}
              <div className="text-center text-gray-600 text-xs p-3 bg-gray-50 border-t border-gray-200 hidden md:block">
                💡 Doble clic para zoom • Rueda para acercar/alejar • Arrastra para mover
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ImageModal;
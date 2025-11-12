import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ZoomableImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleBackgroundClick}
    >
      <div className="relative p-4 max-w-4xl w-full">
        {/* Botón de cierre */}
        <button
          className="absolute top-4 right-4 text-white text-5xl z-10"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Componente principal de zoom y paneo */}
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          doubleClick={{ disabled: true }}
          wheel={{ step: 0.1 }}
          pinch={{ step: 0.1 }}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <TransformComponent>
                {/* La imagen que se puede hacer zoom */}
                <img
                  src={imageUrl}
                  alt="Imagen ampliada del producto"
                  className="w-full h-auto rounded shadow-lg max-h-[90vh] object-contain cursor-move"
                />
              </TransformComponent>

              {/* Controles de zoom */}
              <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                <button
                  onClick={() => zoomIn()}
                  className="bg-gray-800 text-white p-2 rounded-full shadow-lg w-8 h-8 flex items-center justify-center"
                >
                  +
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="bg-gray-800 text-white p-2 rounded-full shadow-lg w-8 h-8 flex items-center justify-center"
                >
                  -
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="bg-gray-800 text-white p-2 rounded-full shadow-lg text-sm"
                >
                  Volver
                </button>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ZoomableImageModal;
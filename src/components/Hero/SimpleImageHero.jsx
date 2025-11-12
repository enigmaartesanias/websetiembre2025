// src/components/SimpleImageHero.jsx

import video from '../../assets/images/video.mp4';

const SimpleImageHero = () => {
  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
      <video
        className="absolute top-2 md:top-0 left-0 w-full h-full object-cover filter sepia"
        src={video}
        autoPlay
        loop
        muted
        playsInline // Es importante para móviles
      />
      <div className="relative z-10 text-black text-center p-20">
        {/* Aquí puedes agregar un texto o el logo encima del video */}
        <h1 className="text-1xl md:text-6xl drop-shadow-lg">
          Enigma Artesanías y Accesorios
        </h1>
      </div>
    </div>
  );
};

export default SimpleImageHero;
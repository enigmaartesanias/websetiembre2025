import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Asegúrate de que tienes 'react-icons' instalado y de que importas FaWhatsapp si lo vas a usar en el footer

const Videoseccion = () => {
  return (
    <section className="bg-gray-100 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Contenedor principal para las dos columnas */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">

          {/* Columna del Video de YouTube */}
          <div className="w-full md:w-1/2 flex justify-center">
            {/* Contenedor responsivo para el iframe de YouTube */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}> {/* Esto hace que el iframe sea responsivo (relación de aspecto 16:9) */}
              <iframe
                // ¡Aquí está la corrección! Usamos la URL exacta de tu iframe de YouTube.
                src="https://www.youtube.com/embed/9khcqT7tKcM?si=AFjO05XmaGDpt3CD" // <--- ¡CAMBIO AQUÍ!
                title="YouTube video player" // Título del iframe de YouTube (puedes usar el tuyo original "El Arte de Enigma: Nuestra Esencia Artesanal" si lo prefieres)
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg" // Clases para ocupar todo el contenedor y dar estilo
              ></iframe>
            </div>
          </div>

          {/* Columna del texto y contenido */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-left md:text-left">
              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-4">
              Descubre la Magia Detrás de Cada Pieza
            </h2>
            <p className="text-left text-m md:text-lg text-gray-800 pl-0 mb-4">
              Sumérgete en el universo de Enigma y conoce el alma de nuestra joyería artesanal.
              En este video, te llevamos de viaje a través del meticuloso proceso de creación,
              desde la selección de las piedras naturales y cuarzos hasta los toques finales
              que dan vida a cada anillo, dije y accesorio.
              <br /><br />
              
            </p>
            {/* Puedes añadir un botón de CTA aquí si lo deseas, por ejemplo: */}
            {/* <div className="mt-6">
              <a href="/coleccion" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Ver Colección Completa
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videoseccion;
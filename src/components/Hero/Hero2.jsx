import andruDonalds from '../../assets/images/andru.jpg';

const Hero2 = () => {
  return (
    <section className="bg-gray-200 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Contenedor principal con grid para mayor control */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 items-center gap-8 md:gap-16"> {/* Cambiado a grid */}
          
          {/* Columna de la imagen */}
          {/* En móvil: w-full, en md: ocupa 1 de 3 columnas, en lg: ocupa 1 de 4 columnas */}
          <div className="w-full md:col-span-1 lg:col-span-1 flex justify-center md:justify-end">
            <img
              src={andruDonalds}
              alt="Andru Donalds con joyas"
              className="w-full max-w-[200px] h-auto rounded-lg shadow-lg object-cover" // Más pequeña por defecto
            />
          </div>

          {/* Columna del texto y contenido */}
          {/* En móvil: w-full, en md: ocupa 2 de 3 columnas, en lg: ocupa 3 de 4 columnas */}
          <div className="w-full md:col-span-2 lg:col-span-3 flex flex-col justify-center text-left md:text-left">
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-4">
              Andru Donalds y el Arte de Enigma
            </h2>
            <p className="text-left text-base md:text-lg sm:text-lg text-gray-700 mb-6 leading-relaxed">
              Una colaboración que une música y orfebrería. Andru Donalds, solista y voz principal de Enigma (proyecto musical - M.Cretu), luce nuestras joyas hechas a mano: anillos con piedras naturales, cuarzos y un dije único que refleja estilo, fuerza y esencia artesanal.
              
            </p>
            {/* Si tienes más contenido aquí, también se expandirá con el texto */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
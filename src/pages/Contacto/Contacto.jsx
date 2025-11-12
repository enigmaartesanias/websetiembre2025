import React from "react";

const Contacto = () => {
  return (
    <section className="w-full min-h-[500px] flex justify-center bg-gray-100 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6">
        {/* Columna izquierda: Solo Mapa */}
        <div className="flex items-center justify-center">
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow mt-7">
            <iframe
              title="Ubicación Enigma Artesanías"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3904.083331966378!2d-77.04030232489461!3d-11.899285688326085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d1948bd0e4d3%3A0xef0d54b8aee7da93!2senigma%20artesanias%20y%20accesorios!5e0!3m2!1ses!2spe!4v1751147953182!5m2!1ses!2spe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        {/* Columna derecha: Texto */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            Enigma Artesanías y Accesorios
          </h2>
          <p className="text-gray-600 text-center">
            Dirección: Jr. Madre Selva 544 Tda. 02 - Urb. Santa Isabel - Carabayllo<br />
            Lima - Perú<br />
            Whatsapp: +51 960282376<br />
            Email: artesaniasenigma@gmail.com
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
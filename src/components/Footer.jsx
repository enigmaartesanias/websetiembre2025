import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 w-full">
      <div className="container mx-auto px-14">
        {/* Sección principal del footer con 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8 text-center md:text-left">
          {/* Columna 1: Información de la tienda */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enigma Artesanías y Accesorios</h3>
            <p className="text-sm text-gray-400">
              Jr. Madre Selva 544 Tda. 02 - Urb. Santa Isabel - Carabayllo
            </p>
            <p className="text-sm text-gray-400">Lima - Perú</p>
          </div>

          {/* Columna 2: Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-sm text-gray-400">Email: artesaniasenigma@gmail.com</p>
            <p className="text-sm text-gray-400">WhatsApp: +51 960282376</p>
          </div>

          {/* Columna 3: Redes Sociales y Enlaces */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex items-center space-x-4 justify-center md:justify-start mb-4">
              <a href="https://www.facebook.com/enigmaartesaniasyaccesorios/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.instagram.com/enigma_artesanias/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
              <a href="https://wa.me/51960282376" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={24} />
              </a>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Más información</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400 items-center md:items-start">
              {/* ✅ Nuevo enlace a la tienda */}
              
              <Link to="/politicasenvios" className="hover:text-white">
                <span className="mr-1">📦</span> Políticas de envío y tarifas
              </Link>
              <Link to="/shippingpolicies" className="hover:text-white">
                <span className="mr-1">📦</span> Shipping Policies and Rates
              </Link>
            </div>
          </div>
        </div>

        {/* Sección de copyright y créditos */}
        <div className="py-4 mt-4 text-center text-sm text-gray-400 border-t border-gray-700">
          <p>Copyright © 2025 Enigma Artesanías y Accesorios. All Rights Reserved.</p>
          <p className="mt-2">Diseñado y creado por Aldo Magallanes</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
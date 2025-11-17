import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const CategoriaShowcase = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .eq('is_novedoso', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProductos(data || []);
      } catch (err) {
        console.error('Error al cargar productos:', err.message);
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    draggable: true,
    swipe: true,
    dots: true,
    dotsClass: "slick-dots-custom",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          draggable: true,
          swipe: true,
          dots: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-300 rounded-lg h-56"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No hay productos destacados en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-3">
        {/* Título del showcase */}
        <div className="text-left mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Creaciones del Momento
          </h2>
        </div>

        {/* Carrusel */}
        {/* Estilos locales para los dots del carrusel */}
        <style>{`
          .slick-slide {
            height: auto !important;
          }
          .slick-dots-custom {
            margin-top: 0.5rem;
            display: flex !important;
            justify-content: center;
            align-items: center;
          }
          .slick-dots-custom li {
            margin: 0 4px;
          }
          .slick-dots-custom li button {
            width: 8px !important;
            height: 8px !important;
            border-radius: 50% !important;
            padding: 0 !important;
            background: #cbd5e1 !important; /* gray-300 */
            border: none !important;
            box-shadow: none !important;
          }
          .slick-dots-custom li.slick-active button {
            background: #1f2937 !important; /* gray-800 */
          }
        `}</style>
        <div className="overflow-hidden">
          <Slider {...settings}>
            {productos.map((producto) => {
              // Lógica para formatear la fecha
              const date = new Date(producto.created_at);
              const month = date.toLocaleString('es-ES', { month: 'short' });
              const year = date.getFullYear();
              const formattedDate = `${month.charAt(0).toUpperCase() + month.slice(1)}. ${year}`;

              return (
                <div key={producto.id} className="px-0 md:px-0.5">
                  <Link to={`/producto/${producto.id}`} className="block pb-4">
                    {/* Contenedor de producto */}
                    <div className="w-full h-[400px] bg-black rounded overflow-hidden flex items-center justify-center" style={{ height: '250px' }}>
                      <img
                        src={producto.imagen_principal_url}
                        alt={producto.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-3 text-sm text-black font-semibold text-left mb-2">
                      {producto.titulo}
                    </div>
                    <div className="mt-1 text-sm text-black text-left mb-2">
                      S/ {producto.precio?.toFixed(2)} PEN
                    </div>
                    {/* Nuevo div para la fecha (más pequeño) */}
                    <div className="text-xs text-black text-opacity-70 text-left mt-1">
                      {formattedDate}
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CategoriaShowcase;
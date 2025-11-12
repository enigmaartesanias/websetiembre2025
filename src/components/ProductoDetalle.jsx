import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import iconoCompartir from '../assets/images/compartir.png';
import ImageModal from './ImageModal';

const LupaIcono = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-white"
    >
        <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
        />
    </svg>
);

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    const openModal = (url) => {
        setModalImageUrl(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl('');
    };

    useEffect(() => {
        const fetchProducto = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(error);
                setError('No se pudo cargar el producto.');
            } else {
                setProducto(data);
            }

            setLoading(false);
        };

        fetchProducto();
    }, [id]);

    useEffect(() => {
        if (producto) {
            const fetchRelacionados = async () => {
                try {
                    const { data, error } = await supabase
                        .from('productos')
                        .select('*')
                        .eq('is_novedoso', true)
                        .neq('id', id)
                        .order('orden', { ascending: true })
                        .limit(4);

                    if (error) throw error;
                    setRelacionados(data || []);
                } catch (err) {
                    console.error('Error al cargar productos relacionados:', err.message);
                }
            };

            fetchRelacionados();
        }
    }, [producto, id]);

    useEffect(() => {
        if (producto) {
            const fetchMateriales = async () => {
                try {
                    const { data: materialsData, error: materialsError } = await supabase
                        .from('producto_material')
                        .select('material_id')
                        .eq('producto_id', id);

                    if (materialsError) throw materialsError;

                    const materialsPromises = materialsData.map(async (materialData) => {
                        const { data: materialName, error: materialError } = await supabase
                            .from('materiales')
                            .select('nombre')
                            .eq('id', materialData.material_id)
                            .single();

                        if (materialError) throw materialError;

                        return materialName.nombre;
                    });

                    const materiales = await Promise.all(materialsPromises);
                    const materialPrincipal = materiales[0] || 'No especificado';

                    setProducto((prevProducto) => ({
                        ...prevProducto,
                        material_principal: materialPrincipal,
                    }));
                } catch (err) {
                    console.error('Error al cargar materiales:', err.message);
                }
            };

            fetchMateriales();
        }
    }, [producto, id]);

    if (loading) return <div className="p-8 text-center">Cargando producto...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!producto) return <div className="p-8 text-center">Producto no encontrado.</div>;

    const imageUrls = [
        producto.imagen_principal_url,
        producto.imagen2_url,
        producto.imagen3_url,
    ].filter(url => url);

    const totalImages = imageUrls.length;

    let sliderRef = null;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        afterChange: index => setCurrentSlide(index),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    draggable: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    };

    const shareText = `¡Mira este producto! ${producto.titulo}\n${window.location.href}`;

    return (
        <main className="pt-24 pb-12 bg-gray-50 min-h-screen">
            {/* Breadcrumb para volver a inicio */}
            <div className="container mx-auto px-8 max-w-3xl">
                <Link to="/" className="text-xm text-black-500 hover:underline">
                    &lt; Inicio
                </Link>
            </div>

            <div className="container mx-auto p-8 max-w-3xl bg-white shadow-xl rounded-lg">
                {/* Galería */}
                <div className="mb-6">
                    <Slider {...settings} ref={slider => (sliderRef = slider)}>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`Imagen ${index + 1}`}
                                    className="w-full h-[500px] sm:h-[600px] md:h-[700px] object-contain bg-white rounded cursor-pointer"
                                    onClick={() => openModal(url)}
                                />
                                <div
                                    className="absolute bottom-4 right-4 p-3 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 shadow-lg"
                                    onClick={() => openModal(url)}
                                    title="Ampliar imagen"
                                >
                                    <LupaIcono />
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {/* Navegación y contador personalizados */}
                    {totalImages > 1 && (
                        <div className="flex justify-center items-center mt-6 space-x-4">
                            <button
                                onClick={() => sliderRef.slickPrev()}
                                className={`text-2xl font-bold text-gray-500 hover:text-gray-700 ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={currentSlide === 0}
                            >
                                &lt;
                            </button>
                            <span className="text-sm text-gray-500">
                                {currentSlide + 1} de {totalImages}
                            </span>
                            <button
                                onClick={() => sliderRef.slickNext()}
                                className={`text-2xl font-bold text-gray-500 hover:text-gray-700 ${currentSlide === totalImages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={currentSlide === totalImages - 1}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>

                {/* Detalles - Orden reorganizado */}
                <div className="py-4 mb-4">
                    <h2 className="text-xl mb-2 text-left">{producto.titulo}</h2>
                    
                    {/* Precio y Material reorganizados */}
                    <div className="flex justify-between items-center mb-4">
                        {producto.precio && (
                            <div className="text-left">
                                <span className="text-gray-600">Precio:</span>
                                <p className="text-lg">
                                    S/ {producto.precio?.toFixed(2)} PEN
                                </p>
                            </div>
                        )}
                        <div className="text-right">
                            <span className="text-gray-600">Material:</span>
                            <p className="text-lg">{producto.material_principal}</p>
                        </div>
                    </div>
                    
                    {/* Botones de consulta y compartir */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                        <a
                            href={`https://wa.me/51960282376?text= ${encodeURIComponent(
                                `Estoy interesado(a) en el siguiente producto: ${producto.titulo}\n${window.location.origin}/producto/${producto.id}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Consultar o pedir por WhatsApp"
                            className="flex items-center justify-center gap-2 text-black font-bold"
                        >
                            Consultar producto
                            <img src={iconoCompartir} alt="WhatsApp" className="w-8 h-8 ml-1" />
                        </a>
                        
                        {/* Enlace de compartir en WhatsApp - Sutil y elegante */}
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-2 sm:mt-0"
                        >
                            <span className="mr-1">🔗</span>
                            Compartir producto
                        </a>
                    </div>
                    
                    {/* Información adicional con enlace a políticas de envío */}
                    <div className="text-left mb-4">
                        <span className="text-gray-600">Información adicional:</span>
                        <p>
                            "El precio no incluye IGV. Para más detalles sobre tallas o disponibilidad, por favor, contáctame por WhatsApp.
                        </p>
                        <p className="mt-2">
                           <Link to="/PoliticasEnvios" className="text-blue-600 hover:underline font-semibold">
                                Más detalles de envío
                           </Link> o consulta el producto en el enlace de arriba.
                        </p>
                    </div>

                    {/* Descripción */}
                    {producto.descripcion && (
                        <div className="py-4 text-left mb-2">
                            <span className="text-gray-600">Descripción:</span>
                            <p>{producto.descripcion}</p>
                        </div>
                    )}
                </div>

                {/* Productos relacionados */}
                <div className="py-10 mb-6">
                    <h2 className="text-1xl font-bold mb-4 text-left">
                        Productos relacionados
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                        {relacionados.length > 0 ? (
                            relacionados.map((relatedProducto) => (
                                <div key={relatedProducto.id} className="text-center">
                                    <Link to={`/producto/${relatedProducto.id}`}>
                                        <img
                                            src={relatedProducto.imagen_principal_url}
                                            alt={relatedProducto.titulo}
                                            className="w-full h-48 sm:h-56 object-cover rounded hover:shadow-lg transition-shadow"
                                        />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-800">{relatedProducto.titulo}</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            S/ {relatedProducto.precio}
                                        </p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No hay productos novedosos para mostrar.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal para ver la imagen ampliada */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={closeModal}
                imageUrl={modalImageUrl}
                productUrl={window.location.href}
            />
        </main>
    );
};

export default ProductoDetalle;
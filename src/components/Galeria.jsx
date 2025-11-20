// src/components/Galeria.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// ==========================================
// 1. DATOS Y CONFIGURACIÓN
// ==========================================

const CATEGORIES = [
    { name: "Aretes", slug: "aretes" },
    { name: "Pulseras", slug: "pulseras" },
    { name: "Anillos", slug: "anillos" },
    { name: "Collares", slug: "collares" },
];

const BASE_ROUTES = {
    plata: {
        aretes: "/plataaretes",
        pulseras: "/platapulseras",
        anillos: "/plataanillos",
        collares: "/platacollares",
    },
    alpaca: {
        aretes: "/alpacaaretes",
        pulseras: "/alpacapulseras",
        anillos: "/alpacaanillos",
        collares: "/alpacacollares",
    },
    cobre: {
        aretes: "/cobrearetes",
        pulseras: "/cobrepulseras",
        anillos: "/cobreanillos",
        collares: "/cobrecollares",
    },
};

const DEFAULT_SUBTITLE = "Diseños exclusivos hechos a mano"; 

const MATERIAL_CARDS = [
    {
        name: "Colección Plata",
        key: "plata",
        description: DEFAULT_SUBTITLE,
        imageSrc: "/images/anillo2.jpg",
        categories: CATEGORIES,
        isCustom: false,
    },
    {
        name: "Colección Alpaca",
        key: "alpaca",
        description: DEFAULT_SUBTITLE,
        imageSrc: "/images/collar23.jpg",
        categories: CATEGORIES,
        isCustom: false,
    },
    {
        name: "Colección Cobre",
        key: "cobre",
        description: DEFAULT_SUBTITLE,
        imageSrc: "/images/pulsera3.jpg",
        categories: CATEGORIES,
        isCustom: false,
    },
    {
        name: "Diseños Personalizados", 
        key: "custom",
        description: DEFAULT_SUBTITLE,
        imageSrc: "/images/per10.jpg",
        link: "/personalizado",
        isCustom: true,
    },
];

// ==========================================
// 2. COMPONENTE DE TARJETA INDIVIDUAL
// ==========================================

const MaterialCard = ({ card, isActive, isAnyCardActive, onToggle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { name, description, imageSrc, key, categories, link, isCustom } = card;

    const getRoute = (materialKey, categorySlug) => {
        return BASE_ROUTES[materialKey]?.[categorySlug] || "#";
    };

    // Detectar si estamos en modo móvil usando useMediaQuery (mejor práctica)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mediaQuery.matches);

        const listener = () => setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", listener);

        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    // En móviles, mostramos los enlaces directamente debajo de la imagen
    if (isMobile) {
        return (
            <div className="w-full relative overflow-hidden rounded-xl transition-shadow duration-300 cursor-pointer">
                {/* Imagen */}
                <div className="relative w-full h-80">
                    <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-cover brightness-50 contrast-150 saturate-75"
                        onError={(e) => {
                            console.error("Imagen no cargó:", imageSrc);
                            e.target.src = "https://placehold.co/600x600?text=No+Image";
                        }}
                    />
                </div>

                {/* Enlaces debajo de la imagen (solo en móvil) */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {isCustom ? (
                        <Link
                            to={link}
                            className="px-6 py-2 bg-gray-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-md transition-colors duration-300 no-underline uppercase"
                        >
                            Ver Modelos
                        </Link>
                    ) : (
                        categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                to={getRoute(key, cat.slug)}
                                className="px-4 py-1.5 text-xs font-bold text-white bg-gray-700 hover:bg-gray-900 rounded-full border border-gray-600 shadow-md transition-colors duration-300 no-underline uppercase"
                            >
                                {cat.name}
                            </Link>
                        ))
                    )}
                </div>
            </div>
        );
    }

    // En desktop, mantenemos el overlay
    const shouldShowOverlay = isActive || isHovered;

    return (
        <div
            className="w-full relative overflow-hidden rounded-xl transition-shadow duration-300 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            style={{ zIndex: 1 }}
        >
            {/* Contenedor de la Imagen */}
            <div className="relative w-full h-80">
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-full h-full object-cover brightness-50 contrast-150 saturate-75"
                    onError={(e) => {
                        console.error("Imagen no cargó:", imageSrc);
                        e.target.src = "https://placehold.co/600x600?text=No+Image";
                    }}
                />

                {/* Fondo base oscuro siempre presente */}
                <div className="absolute inset-0 bg-black/60 pointer-events-none" />

                {/* Overlay de categorías (aparece al activar o hacer hover) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: shouldShowOverlay ? "rgba(40, 40, 40, 0.95)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.3s ease",
                        zIndex: 10,
                        pointerEvents: shouldShowOverlay ? "auto" : "none",
                    }}
                >
                    <div
                        style={{
                            opacity: shouldShowOverlay ? 1 : 0,
                            transition: "opacity 0.3s ease",
                            width: "100%",
                            height: "100%",
                            padding: "1rem", // Reducido de 1.5rem a 1rem
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            pointerEvents: shouldShowOverlay ? "auto" : "none",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "0.75rem", // Reducido de 1rem a 0.75rem
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isCustom ? (
                                <Link
                                    to={link}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md transition-colors duration-300 no-underline uppercase"
                                >
                                    Cotizar Diseño
                                </Link>
                            ) : (
                                categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        to={getRoute(key, cat.slug)}
                                        className="px-6 py-2.5 text-xs font-bold text-white bg-gray-700 hover:bg-gray-900 rounded-full border border-gray-600 shadow-md transition-colors duration-300 no-underline uppercase"
                                    >
                                        {cat.name}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (GALERIA)
// ==========================================

const Galeria = () => {
    const [activeCard, setActiveCard] = useState(null);

    const handleCardToggle = (key) => {
        if (activeCard === key) {
            setActiveCard(null);
        } else {
            setActiveCard(key);
        }
    };

    return (
        <section 
            className="py-8 bg-gray-100 font-sans" // 👈 Cambiado de py-12 a py-8
            onClick={() => setActiveCard(null)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Colecciones Artesanales
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Explora nuestras piezas únicas por material y acabado
                    </p>
                </div>

                {/* Flex row en desktop, column en móvil */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-6"> {/* Reducido gap de 8 a 6 */}
                    {MATERIAL_CARDS.map((card) => (
                        <div 
                            key={card.key} 
                            className="flex flex-col bg-white p-4 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl w-full lg:w-[23.5%]" // Ancho aumentado a 23.5%
                        >
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight mb-1 text-center">
                                {card.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center"> {/* Reducido mb de 6 a 3 */}
                                {card.description}
                            </p>
                            
                            <MaterialCard
                                card={card}
                                isActive={activeCard === card.key}
                                isAnyCardActive={activeCard !== null}
                                onToggle={() => handleCardToggle(card.key)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Galeria;
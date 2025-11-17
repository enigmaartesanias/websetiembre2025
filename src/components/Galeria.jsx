import { Link } from "react-router-dom";

const images = [
    { src: "/images/anillos.jpg", text: "ANILLOS", slug: "anillos" },
    { src: "/images/pulseras.jpg", text: "PULSERAS", slug: "pulseras" },
    { src: "/images/collares.jpg", text: "COLLARES", slug: "collares" },
    { src: "/images/aretes.jpg", text: "ARETES", slug: "aretes" },
];

// Definimos las rutas exactas para cada material y categoría
const routes = {
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

const materials = [
    { name: "Plata", key: "plata" },
    { name: "Alpaca", key: "alpaca" },
    { name: "Cobre", key: "cobre" },
];

const Galeria = () => {
    return (
        <div className="max-w-7xl mx-auto px-3 py-4 sm:py-8 sm:px-6 lg:px-8 font-sans">
            <h4 className="text-2xl font-bold text-gray-900 text-center mb-4 tracking-tight">
                Explora nuestra Colección Artesanal
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-10">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="overflow-hidden transform transition-all duration-300 hover:scale-105 flex flex-col"
                    >
                        <div className="relative w-full aspect-square overflow-hidden">
                            <img
                                src={img.src}
                                alt={img.text}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <div className="p-3 flex flex-col items-center flex-grow bg-transparent">
                        <span className="text-base font-semibold text-gray-900 uppercase mb-2 tracking-wider text-center">
                                {img.text}
                            </span>
                        <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                {materials.map((mat) => (
                                <Link
                                    key={mat.key}
                                    to={routes[mat.key][img.slug]}
                                    className="inline-flex items-center justify-center px-3 py-0.5 border border-gray-200 text-sm font-medium rounded-full text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-shadow duration-150"
                                >
                                    {mat.name}
                                </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bloque para "Personalizados" con ancho reducido en móvil y centrado */}
            <div className="mt-8 md:mt-12 flex justify-center">
                <div className="w-11/12 mx-auto sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-2xl flex flex-col">
                    <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                             src="/images/personalizados/per10.jpg" 
                            alt="Joyas Personalizadas"
                            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <h5 className="text-white text-xl sm:text-2xl font-bold tracking-tight text-center">
                                DISEÑOS PERSONALIZADOS
                            </h5>
                        </div>
                    </div>
                    <div className="p-3 flex justify-center">
                        <Link
                            to="/personalizado"
                            // **AQUÍ ESTÁ LA LÍNEA MODIFICADA PARA CORREGIR EL ERROR**
                            className="inline-flex items-center justify-center px-4 py-1 border-2 border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-800 hover:text-white hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out shadow-sm"
                        >
                            Ver Creaciones Personalizadas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Galeria;


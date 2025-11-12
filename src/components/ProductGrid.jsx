import React from 'react';

const ProductGrid = ({ productos, onImageClick }) => {
    if (productos.length === 0) {
        return <p className="text-center text-gray-500">No hay productos que coincidan con los filtros.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {productos.map((producto) => (
                <div key={producto.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                    <img
                        src={producto.url_imagen}
                        alt={producto.nombre_producto}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => onImageClick(producto.url_imagen)}
                    />
                    <div className="p-2 sm:p-4 text-center">
                        <h2 className="text-sm sm:text-lg font-semibold mb-1 truncate">{producto.nombre_producto}</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{producto.categoria}</p>
                        <span className="text-sm sm:text-lg font-bold text-gray-800">S/ {producto.precio}.00</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
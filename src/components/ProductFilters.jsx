import React from 'react';


const ProductFilters = ({ categorias, precios, onFilterChange, filtros, loading }) => {
  const isPrecioFilterDisabled = filtros.categoria === 'Todos';
  const hayPrecios = precios && precios.length > 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Filtro por Categoría */}
      <div className="flex-1">
        <label htmlFor="categoria-filter" className="block text-gray-700 font-semibold mb-2 mt-4 md:mt-0">Filtrar por Categoría:</label>
        <select
          id="categoria-filter"
          name="categoria"
          onChange={onFilterChange}
          value={filtros.categoria}
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <option value="Todos">Cargando categorías...</option>
          ) : (
            <>
              <option value="Todos">Todas las Categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </>
          )}
        </select>
      </div>
      
      {/* Filtro por Precio */}
      <div className="flex-1">
        <label htmlFor="precio-filter" className="block text-gray-700 font-semibold mb-2">Filtrar por Precio:</label>
        <select
          id="precio-filter"
          name="precio"
          onChange={onFilterChange}
          value={filtros.precio}
          disabled={isPrecioFilterDisabled || (filtros.categoria !== 'Todos' && !hayPrecios)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPrecioFilterDisabled ? (
            <option value="Todos">Selecciona una categoría</option>
          ) : !hayPrecios ? (
            <option value="Todos">Cargando precios...</option>
          ) : (
            <option value="Todos">Todos los Precios</option>
          )}

          {precios.map(price => (
            <option key={price} value={price}>{`S/ ${price}.00`}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
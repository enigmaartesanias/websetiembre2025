import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import ZoomableImageModal from '../components/ZoomableImageModal';

const Tienda = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [filtros, setFiltros] = useState({ categoria: 'Todos', precio: 'Todos' });
    const [preciosDisponibles, setPreciosDisponibles] = useState([]);
    const [categoriasUnicas, setCategoriasUnicas] = useState([]);
    const [preciosPorCategoria, setPreciosPorCategoria] = useState({});

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('stock_tienda')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al cargar productos:', error.message);
        } else {
            setProductos(data || []);
            const uniqueCategories = [...new Set(data.map(p => p.categoria))].sort();
            setCategoriasUnicas(uniqueCategories);

            const preciosAgrupados = {};
            uniqueCategories.forEach(cat => {
                preciosAgrupados[cat] = [...new Set(data.filter(p => p.categoria === cat).map(p => p.precio))].sort((a, b) => a - b);
            });
            setPreciosPorCategoria(preciosAgrupados);

        }
        setLoading(false);
    };

    useEffect(() => {
        let newPrecios = [];
        let newFiltroPrecio = filtros.precio;

        if (filtros.categoria === 'Todos') {
            newFiltroPrecio = 'Todos';
        } else {
            newPrecios = preciosPorCategoria[filtros.categoria] || [];
            if (newFiltroPrecio !== 'Todos' && !newPrecios.includes(parseInt(newFiltroPrecio))) {
                newFiltroPrecio = 'Todos';
            }
        }
        
        setPreciosDisponibles(newPrecios);
        setFiltros(prev => ({ ...prev, precio: newFiltroPrecio }));

    }, [filtros.categoria, preciosPorCategoria]);


    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const productosFiltrados = productos.filter(p => {
        const categoriaMatch = filtros.categoria === 'Todos' || p.categoria === filtros.categoria;
        const precioMatch = filtros.precio === 'Todos' || p.precio.toString() === filtros.precio;
        return categoriaMatch && precioMatch;
    });

    const openModal = (url) => {
        setSelectedImageUrl(url);
    };

    const closeModal = () => {
        setSelectedImageUrl(null);
    };

    if (loading) {
        return <div className="text-center mt-12 text-lg">Cargando productos...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* ✅ Título actualizado y con un margen superior más grande para evitar la superposición */}
            <h1 className="text-xl md:text-3xl font-bold text-center mt-16 md:mt-8 mb-4">Stock actual en tienda</h1>

            <ProductFilters 
                categorias={categoriasUnicas}
                precios={preciosDisponibles}
                onFilterChange={handleFiltroChange}
                filtros={filtros}
            />
            
            <ProductGrid 
                productos={productosFiltrados}
                onImageClick={openModal}
            />

            {selectedImageUrl && (
                <ZoomableImageModal 
                    isOpen={!!selectedImageUrl}
                    onClose={closeModal}
                    imageUrl={selectedImageUrl}
                />
            )}
        </div>
    );
};

export default Tienda;
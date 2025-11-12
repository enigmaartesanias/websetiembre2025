import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const StockAdmin = () => {
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        nombre_producto: '',
        categoria: '',
        precio: '',
        stock_actual: '',
        url_imagen: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

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
            console.error('Error al cargar productos de stock:', error.message);
        } else {
            setProductos(data || []);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            alert('Por favor, selecciona una imagen para subir.');
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `stock_images/${fileName}`;

        setUploading(true);

        const { error: uploadError } = await supabase.storage
            .from('stock_imagen')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error al subir la imagen:', uploadError.message);
            alert('Error al subir la imagen.');
        } else {
            const { data } = supabase.storage
                .from('stock_imagen')
                .getPublicUrl(filePath);

            setImageUrl(data.publicUrl);
            setFormData((prevData) => ({
                ...prevData,
                url_imagen: data.publicUrl,
            }));
            alert('Imagen subida con éxito!');
        }

        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            const { error } = await supabase
                .from('stock_tienda')
                .update(formData)
                .eq('id', editingId);

            if (error) {
                console.error('Error al actualizar el producto:', error.message);
                alert('Error al actualizar el producto.');
            } else {
                alert('Producto actualizado con éxito!');
                setEditingId(null);
            }
        } else {
            const { error } = await supabase.from('stock_tienda').insert([formData]);
            
            if (error) {
                console.error('Error al añadir el producto:', error.message);
                alert('Error al añadir el producto.');
            } else {
                alert('Producto añadido con éxito!');
            }
        }

        setFormData({
            nombre_producto: '',
            categoria: '',
            precio: '',
            stock_actual: '',
            url_imagen: '',
        });
        setImageUrl('');
        fetchProductos();
    };

    const handleEdit = (producto) => {
        setEditingId(producto.id);
        setFormData({
            nombre_producto: producto.nombre_producto,
            categoria: producto.categoria,
            precio: producto.precio,
            stock_actual: producto.stock_actual,
            url_imagen: producto.url_imagen,
        });
        setImageUrl(producto.url_imagen);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            const { error } = await supabase
                .from('stock_tienda')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error al eliminar el producto:', error.message);
                alert('Error al eliminar el producto.');
            } else {
                alert('Producto eliminado con éxito!');
                fetchProductos();
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <Link to="/admin" className="text-sm text-gray-600 hover:underline mb-4 block">
                    &lt; Volver al Panel de Administración
                </Link>
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Gestión de Stock de la Tienda
                </h1>

                {/* Formulario de Stock */}
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-100 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Editar Producto' : 'Añadir Nuevo Producto'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="nombre_producto"
                            value={formData.nombre_producto}
                            onChange={handleChange}
                            placeholder="Nombre del Producto"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {/* ✅ Aquí se reemplazó el input de texto por un select */}
                        <select
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            required
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Selecciona una Categoría</option>
                            <option value="Anillos">Anillos</option>
                            <option value="Pulseras">Pulseras</option>
                            <option value="Collares">Collares</option>
                            <option value="Aretes">Aretes</option>
                        </select>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            placeholder="Precio (ej. 150.00)"
                            step="0.01"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="number"
                            name="stock_actual"
                            value={formData.stock_actual}
                            onChange={handleChange}
                            placeholder="Cantidad en Stock"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    {/* Sección de carga de imagen */}
                    <div className="mt-4">
                        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
                            Subir Imagen del Producto
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            disabled={uploading}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploading && <p className="text-sm text-gray-500 mt-2">Subiendo...</p>}
                        {imageUrl && (
                            <div className="mt-4">
                                <img src={imageUrl} alt="Vista previa" className="w-32 h-32 object-cover rounded-md shadow-sm" />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {editingId ? 'Actualizar Producto' : 'Añadir Producto'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setFormData({
                                    nombre_producto: '',
                                    categoria: '',
                                    precio: '',
                                    stock_actual: '',
                                    url_imagen: '',
                                });
                                setImageUrl('');
                            }}
                            className="mt-2 w-full py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                        >
                            Cancelar Edición
                        </button>
                    )}
                </form>

                {/* Lista de Productos en Stock */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Productos en Stock</h2>
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : productos.length === 0 ? (
                        <p className="text-center text-gray-500">No hay productos en stock.</p>
                    ) : (
                        <ul className="space-y-4">
                            {productos.map((producto) => (
                                <li
                                    key={producto.id}
                                    className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-sm"
                                >
                                    <div className="flex items-center space-x-4 w-full md:w-auto">
                                        <img
                                            src={producto.url_imagen || 'https://via.placeholder.com/100'}
                                            alt={producto.nombre_producto}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-lg truncate">{producto.nombre_producto}</p>
                                            <p className="text-sm text-gray-500">{producto.categoria}</p>
                                            <p className="text-sm text-gray-500">Stock: {producto.stock_actual}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-4 md:mt-0">
                                        <button
                                            onClick={() => handleEdit(producto)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(producto.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockAdmin;
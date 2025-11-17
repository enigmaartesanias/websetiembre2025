import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ImageUploader from './ImageUploader';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';

const CarouselAdmin = () => {
    const { user } = useAuth();

    // Si no hay usuario, muestra mensaje de acceso restringido
    if (!user) {
        return (
            <div className="p-8 text-center text-gray-700">
                <h2 className="text-2xl font-bold mb-4">Acceso restringido</h2>
                <p>Debes iniciar sesión para administrar el carrusel.</p>
            </div>
        );
    }

    const [carouselItems, setCarouselItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItemDescription, setNewItemDescription] = useState('');
    const [newItemImageUrl, setNewItemImageUrl] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchCarouselItems();
    }, [user]);

    const fetchCarouselItems = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('carousel_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCarouselItems(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los ítems del carrusel para administración.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateItem = async (e) => {
        e.preventDefault();
        if (!newItemImageUrl || !newItemDescription) {
            setError('La URL de la imagen y la descripción son obligatorias.');
            return;
        }

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('carousel_items')
                    .update({ image_url: newItemImageUrl, description: newItemDescription })
                    .eq('id', editingItem.id);

                if (error) throw error;
                setEditingItem(null);
            } else {
                const { error } = await supabase
                    .from('carousel_items')
                    .insert({ image_url: newItemImageUrl, description: newItemDescription });

                if (error) throw error;
            }
            setNewItemDescription('');
            setNewItemImageUrl('');
            fetchCarouselItems();
            setError(null);
        } catch (err) {
            setError(`Error al ${editingItem ? 'actualizar' : 'añadir'} el ítem: ${err.message}`);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este ítem? Esto también eliminará la imagen asociada.')) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const { data: itemToDelete, error: fetchError } = await supabase
                .from('carousel_items')
                .select('image_url')
                .eq('id', id)
                .single();

            if (fetchError) throw new Error(`No se pudo obtener la URL de la imagen: ${fetchError.message}`);

            const { error: deleteDbError } = await supabase
                .from('carousel_items')
                .delete()
                .eq('id', id);

            if (deleteDbError) throw new Error(`No se pudo eliminar el ítem de la base de datos: ${deleteDbError.message}`);

            if (itemToDelete && itemToDelete.image_url) {
                const urlParts = itemToDelete.image_url.split('/');
                const publicIndex = urlParts.indexOf('public');
                const filePathInStorage = urlParts.slice(publicIndex + 2).join('/');

                if (filePathInStorage) {
                    const { error: deleteStorageError } = await supabase.storage
                        .from('carousel-images')
                        .remove([filePathInStorage]);

                    if (deleteStorageError) {
                        setError(`Ítem eliminado de la DB, pero error al eliminar la imagen del Storage: ${deleteStorageError.message}`);
                    }
                }
            }

            await fetchCarouselItems();
        } catch (err) {
            setError(`Error al eliminar el ítem: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (item) => {
        setEditingItem(item);
        setNewItemDescription(item.description);
        setNewItemImageUrl(item.image_url);
        setError(null);
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setNewItemDescription('');
        setNewItemImageUrl('');
        setError(null);
    };

    const handleImageUploadSuccess = (url) => {
        setNewItemImageUrl(url);
        setError(null);
        alert('Imagen subida exitosamente. ¡Ahora puedes añadir la descripción y guardar el ítem!');
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-700">Cargando ítems del carrusel...</div>;
    }

    const renderAdminContent = () => (
        <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-20">Administración del Carrusel</h2>

            <form onSubmit={handleAddOrUpdateItem} className="mb-8 p-6 border rounded-lg bg-gray-50">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{editingItem ? 'Editar Ítem' : 'Añadir Nuevo Ítem'}</h3>

                <div className="mb-4">
                    <ImageUploader onUploadSuccess={handleImageUploadSuccess} />
                </div>

                <div className="mb-4">
                    <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
                        URL de la Imagen:
                    </label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={newItemImageUrl}
                        onChange={(e) => setNewItemImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    {newItemImageUrl && (
                        <div className="mt-2">
                            <img src={newItemImageUrl} alt="Vista previa" className="w-32 h-32 object-cover rounded-md shadow" />
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Descripción:
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        placeholder="Collar de plata con piedra preciosa"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {editingItem ? 'Actualizar Ítem' : 'Añadir Ítem'}
                    </button>
                    {editingItem && (
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Ítems Existentes</h3>
            {carouselItems.length === 0 ? (
                <p className="text-center text-gray-500">No hay ítems en el carrusel aún.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Imagen</th>
                                <th className="py-3 px-6 text-left">Descripción</th>
                                <th className="py-3 px-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {carouselItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.id}</td>
                                    <td className="py-3 px-6 text-left">
                                        <img src={item.image_url} alt={item.description} className="w-16 h-16 object-cover rounded" />
                                    </td>
                                    <td className="py-3 px-6 text-left">{item.description}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    return (
        <div className="container mx-auto p-6 max-w-4xl bg-white shadow-xl rounded-lg mt-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">¡Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
            {renderAdminContent()}
        </div>
    );
};

export default CarouselAdmin; 
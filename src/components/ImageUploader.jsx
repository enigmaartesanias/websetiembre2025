import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

const ImageUploader = ({ onUploadSuccess, bucketName = 'carousel-images' }) => {
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Opciones de compresión inicial
    const compressionOptions = {
        maxSizeMB: 1, // Máximo 1 MB
        useWebWorker: true,
        maxIteration: 10,
    };

    // Dimensiones máximas (mantiene proporciones)
    const MAX_WIDTH = 1200;
    const MAX_HEIGHT = 1200;

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setImageFile(null);
            setCompressedFile(null);
            setUploadError(null);
            return;
        }

        setImageFile(file);
        setUploadError(null);
        setCompressedFile(null);
        setProcessing(true);

        try {
            // Paso 1: Comprimir el archivo para reducir su tamaño (peso)
            const compressedBlob = await imageCompression(file, compressionOptions);

            // Paso 2: Procesar la imagen manteniendo proporciones
            const processedFile = await processImageWithCanvas(compressedBlob, MAX_WIDTH, MAX_HEIGHT);

            setCompressedFile(processedFile);
            console.log('Imagen original:', (file.size / 1024).toFixed(2), 'KB');
            console.log('Imagen procesada (final):', (processedFile.size / 1024).toFixed(2), 'KB');
        } catch (err) {
            console.error('Error durante el procesamiento de la imagen:', err.message);
            setUploadError(`Error al procesar la imagen. Asegúrate de que es un archivo de imagen válido. Detalle: ${err.message}`);
            setCompressedFile(null);
        } finally {
            setProcessing(false);
        }
    };

    // Función para procesar la imagen con Canvas (redimensiona SIN recortar)
    const processImageWithCanvas = (imageBlob, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Calcular nuevas dimensiones manteniendo proporciones
                    let newWidth = img.width;
                    let newHeight = img.height;

                    if (newWidth > maxWidth) {
                        newHeight = (newHeight * maxWidth) / newWidth;
                        newWidth = maxWidth;
                    }

                    if (newHeight > maxHeight) {
                        newWidth = (newWidth * maxHeight) / newHeight;
                        newHeight = maxHeight;
                    }

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Dibujar sin recortar
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const processedFile = new File([blob], imageBlob.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(processedFile);
                        } else {
                            reject(new Error('No se pudo convertir el canvas a Blob.'));
                        }
                    }, 'image/jpeg', 0.95);
                };
                img.onerror = () => {
                    reject(new Error('No se pudo cargar la imagen para procesamiento Canvas.'));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(imageBlob);
        });
    };

    const uploadImage = async () => {
        if (!compressedFile) {
            setUploadError('Por favor, selecciona una imagen para subir.');
            return;
        }

        setUploading(true);
        setUploadError(null);

        const fileExtension = imageFile.name.split('.').pop();
        const filePath = `${uuidv4()}.${fileExtension}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, compressedFile, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl }, error: urlError } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            if (urlError) {
                throw urlError;
            }

            if (publicUrl) {
                console.log('Imagen subida exitosamente:', publicUrl);
                if (onUploadSuccess) {
                    onUploadSuccess(publicUrl);
                }
                setImageFile(null);
                setCompressedFile(null);
            } else {
                throw new Error('No se pudo obtener la URL pública de la imagen.');
            }
        } catch (err) {
            console.error('Error al subir la imagen:', err.message);
            setUploadError(`Error al subir la imagen: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Subir Nueva Imagen</h3>
            <p className="text-xs text-gray-600 mb-3">
                💡 Las imágenes se redimensionarán manteniendo sus proporciones. 
                Máximo: 1200x1200px. Se recomienda formato vertical para mejor visualización.
            </p>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-3 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                disabled={uploading || processing}
            />
            {imageFile && (
                <p className="text-sm text-gray-600 mb-2">Archivo seleccionado: {imageFile.name}</p>
            )}
            {processing && (
                <div className="flex items-center text-blue-500 text-sm mb-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando imagen...
                </div>
            )}
            {compressedFile && !processing && (
                <p className="text-green-600 text-sm mb-2">
                    Imagen lista para subir. Tamaño final: {(compressedFile.size / 1024).toFixed(2)} KB.
                </p>
            )}
            {uploadError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {uploadError}
                </div>
            )}
            <button
                onClick={uploadImage}
                disabled={uploading || processing || !compressedFile}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {uploading ? 'Subiendo...' : 'Subir Imagen'}
            </button>
        </div>
    );
};

export default ImageUploader;
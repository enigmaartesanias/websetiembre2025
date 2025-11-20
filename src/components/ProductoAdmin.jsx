import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ImageUploader from "./ImageUploader";
import { useNavigate } from 'react-router-dom';

const ProductoAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen_principal_url: "",
    imagen2_url: "",
    imagen3_url: "",
    precio: "",
    slug: "",
    orden: 0,
    activo: true,
    is_novedoso: false,
    meta_descripcion: "",
    palabras_clave: "",
    categoria_id: "",
    materiales_ids: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const navigate = useNavigate();

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        // Renovar sesión antes de cargar datos
        await supabase.auth.refreshSession();

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login', { replace: true });
          return;
        }

        const [categoriasRes, materialesRes, productosRes] = await Promise.all([
          supabase.from("categorias").select("*"),
          supabase.from("materiales").select("*"),
          supabase.from("productos").select("*").order("orden", { ascending: true }),
        ]);

        if (categoriasRes.error) throw categoriasRes.error;
        if (materialesRes.error) throw materialesRes.error;
        if (productosRes.error) throw productosRes.error;

        setCategorias(categoriasRes.data || []);
        setMateriales(materialesRes.data || []);
        setProductos(productosRes.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos: " + (err.message || err.toString()));
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Generar slug único
  useEffect(() => {
    if (formData.titulo) {
      const baseSlug = formData.titulo
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      const uniqueSlug = `${baseSlug}-${Date.now()}`;
      setFormData((prev) => ({ ...prev, slug: uniqueSlug }));
    }
  }, [formData.titulo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMaterialChange = (materialId) => {
    setFormData((prev) => ({
      ...prev,
      materiales_ids: [materialId], // Solo un ID, en un array
    }));
  };

  const handleImageUpload = (field, url) => {
    // Validar que la URL sea válida
    if (!url || typeof url !== 'string') {
      setError("Error: URL de imagen inválida");
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    // Renovar sesión antes de operar
    await supabase.auth.refreshSession();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Sesión no válida. Por favor, inicia sesión nuevamente.");
      navigate('/login', { replace: true });
      setSubmitting(false);
      return;
    }

    if (!formData.categoria_id) {
      setError("Debe seleccionar una categoría.");
      setSubmitting(false);
      return;
    }

    const currentMaterialesIds = Array.isArray(formData.materiales_ids) ? formData.materiales_ids : [];
    if (currentMaterialesIds.length === 0) {
      setError("Debe seleccionar al menos un material.");
      setSubmitting(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        precio: formData.precio !== "" ? parseFloat(formData.precio) : null,
        orden: formData.orden ? parseInt(formData.orden) : 0,
        activo: !!formData.activo,
        is_novedoso: !!formData.is_novedoso,
      };

      const { materiales_ids, ...productoData } = dataToSend;
      let productoId;

      if (editingProducto) {
        const { error, data } = await supabase
          .from("productos")
          .update(productoData)
          .eq("id", editingProducto.id)
          .select("id");

        if (error) throw error;
        productoId = data[0].id;

        const { error: deleteError } = await supabase
          .from("producto_material")
          .delete()
          .eq("producto_id", productoId);

        if (deleteError) throw deleteError;
      } else {
        const { error, data } = await supabase
          .from("productos")
          .insert([productoData])
          .select("id");

        if (error) throw error;
        productoId = data[0].id;
      }

      if (materiales_ids.length > 0) {
        const relaciones = materiales_ids.map((materialId) => ({
          producto_id: productoId,
          material_id: materialId,
        }));

        const { error: relacionesError } = await supabase
          .from("producto_material")
          .insert(relaciones);

        if (relacionesError) throw relacionesError;
      }

      await fetchProductos();
      resetForm();
      setSuccess("Producto guardado exitosamente.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error al guardar el producto:", err);
      const message = err?.message || err?.error || JSON.stringify(err) || "Error no especificado";
      setError("Error al guardar el producto: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("orden", { ascending: true });

      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar productos: " + (err.message || err));
    }
  };

  const handleEdit = async (producto) => {
    setEditingProducto(producto);
    setFormData({ ...producto });

    try {
      const { data, error } = await supabase
        .from("producto_material")
        .select("material_id")
        .eq("producto_id", producto.id);

      if (error) {
        console.error("Error al cargar materiales:", error);
        setFormData((prev) => ({ ...prev, materiales_ids: [] }));
      } else if (data && Array.isArray(data)) {
        const materialesIds = data.map((pm) => pm.material_id);
        setFormData((prev) => ({ ...prev, materiales_ids: materialesIds }));
      } else {
        setFormData((prev) => ({ ...prev, materiales_ids: [] }));
      }
    } catch (err) {
      console.error("Error inesperado al cargar materiales:", err);
      setFormData((prev) => ({ ...prev, materiales_ids: [] }));
    }

    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (!error) {
      await fetchProductos();
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      imagen_principal_url: "",
      imagen2_url: "",
      imagen3_url: "",
      precio: "",
      slug: "",
      orden: 0,
      activo: true,
      is_novedoso: false,
      meta_descripcion: "",
      palabras_clave: "",
      categoria_id: "",
      materiales_ids: [],
    });
    setEditingProducto(null);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white shadow-xl rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Administración de Productos
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">
          {editingProducto ? "Editar Producto" : "Nuevo Producto"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Título:</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Precio:</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Orden:</label>
            <input
              type="number"
              name="orden"
              value={formData.orden}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Slug (URL):</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              readOnly
              placeholder="Se genera automáticamente"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Categoría:</label>
            <select
              name="categoria_id"
              value={formData.categoria_id || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias && categorias.length > 0 ? (
                categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay categorías</option>
              )}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Materiales:</label>
            {materiales && materiales.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materiales.map((mat) => (
                  <label key={mat.id} className="flex items-center">
                    <input
                      type="radio"
                      name="material_selection"
                      checked={Array.isArray(formData.materiales_ids) && formData.materiales_ids.includes(mat.id)}
                      onChange={() => handleMaterialChange(mat.id)}
                      className="mr-2"
                    />
                    {mat.nombre}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay materiales disponibles.</p>
            )}
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm font-bold">Producto Activo</label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="is_novedoso"
              checked={formData.is_novedoso}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm font-bold">Marcar como Novedoso</label>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Imágenes</h4>
          <p className="text-sm text-gray-600 mb-4">
            💡 Recomendación: Sube imágenes en formato vertical (alto mayor que ancho) 
            para mejor visualización en ProductoDetalle. Tamaño sugerido: 600x800px o mayor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["imagen_principal_url", "imagen2_url", "imagen3_url"].map(
              (field, idx) => (
                <div key={field}>
                  <label className="block text-sm font-bold mb-2">
                    Imagen {idx + 1}:
                  </label>
                  <ImageUploader
                    bucketName="producto-images"
                    onUploadSuccess={(url) => handleImageUpload(field, url)}
                  />
                  <input
                    type="url"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-2"
                    placeholder={`URL de ${field}`}
                  />
                  {formData[field] && (
                    <img
                      src={formData[field]}
                      alt={field}
                      className="w-full h-48 object-contain rounded mt-2 bg-gray-100"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Meta Descripción:
            </label>
            <input
              type="text"
              name="meta_descripcion"
              value={formData.meta_descripcion}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              Palabras Clave:
            </label>
            <input
              type="text"
              name="palabras_clave"
              value={formData.palabras_clave}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className={`font-bold py-2 px-4 rounded ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700 text-white"
            }`}
          >
            {submitting ? "Guardando..." : editingProducto ? "Actualizar" : "Crear"} Producto
          </button>
          {editingProducto && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Productos Existentes</h3>
      {productos.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos creados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left">Orden</th>
                <th className="py-3 px-6 text-left">Título</th>
                <th className="py-3 px-6 text-left">Precio</th>
                <th className="py-3 px-6 text-left">Novedoso</th>
                <th className="py-3 px-6 text-left">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{prod.orden}</td>
                  <td className="py-3 px-6">{prod.titulo}</td>
                  <td className="py-3 px-6">S/ {prod.precio}</td>
                  <td className="py-3 px-6">
                    {prod.is_novedoso ? (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Sí
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        prod.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-xs mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
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
    </div>
  );
};

export default ProductoAdmin;
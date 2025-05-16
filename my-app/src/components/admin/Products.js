import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please check your connection and try again.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedProduct(null);
    setImageFile(null);
    setFeatured(false);
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: ''
    });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsAdding(false);
    setImageFile(null);
    setFeatured(product.featured || false);
    setFormData({
      name: product.name || '',
      categoryId: product.category?._id || '',
      price: product.price || '',
      stock: product.stock || '',
      description: product.description || ''
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        setError('Failed to delete product. Please try again.');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.name || !formData.categoryId || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.categoryId);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('stock', parseInt(formData.stock));
    formDataToSend.append('description', formData.description);
    formDataToSend.append('featured', featured);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      let response;
      if (isAdding) {
        response = await api.post('/products', formDataToSend);
        setProducts([...products, response.data]);
      } else {
        response = await api.put(`/products/${selectedProduct._id}`, formDataToSend);
        setProducts(products.map(product => 
          product._id === selectedProduct._id ? response.data : product
        ));
      }
      setIsAdding(false);
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setImageFile(null);
    setFeatured(false);
    setError(null);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-admin">
      <div className="header">
        <h1>Products Management</h1>
        <button onClick={handleAddProduct} className="add-btn">
          + Add New Product
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="products-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product._id}>
                  <td>{product._id.substring(0, 6)}...</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || 'Uncategorized'}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td className={product.stock < 10 ? 'low-stock' : ''}>
                    {product.stock}
                  </td>
                  <td>{product.featured ? '⭐' : '-'}</td>
                  <td className="actions">
                    <button onClick={() => handleEditProduct(product)} className="edit">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(isAdding || isEditing) && (
        <div className="form-modal">
          <div className="form-container">
            <h2>{isAdding ? 'Add New Product' : 'Edit Product'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*"
                  className="file-input"
                />
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <label htmlFor="featured">Featured Product</label>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : (isAdding ? 'Add Product' : 'Save Changes')}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
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
    subCategory: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });
  
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
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
      subCategory: '',
      price: '',
      stock: '',
      description: '',
      imageUrl: ''
    });
    setAvailableSubCategories([]);
  };
  
  // Function to get sub-categories for a selected category
  const fetchSubCategories = (categoryName) => {
    // All sports categories have the same consistent sub-categories: Gear and Apparel
    if (categoryName && ['Cricket', 'Football', 'Basketball', 'Badminton'].includes(categoryName)) {
      setAvailableSubCategories(['Gear', 'Apparel']);
    } else {
      setAvailableSubCategories([]);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setIsAdding(false);
    setSelectedProduct(product);
    setImageFile(null);
    setFeatured(product.featured || false);
    setFormData({
      name: product.name || '',
      categoryId: product.category?._id || '',
      subCategory: product.subCategory || '',
      price: product.price || '',
      stock: product.stock || '',
      description: product.description || '',
      imageUrl: product.image || ''
    });
    
    // Fetch sub-categories for the selected category
    if (product.category?.name) {
      fetchSubCategories(product.category.name);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('Failed to delete product.');
        console.error(err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If category changes, fetch the available sub-categories
    if (name === 'categoryId' && value) {
      const selectedCategory = categories.find(cat => cat._id === value);
      if (selectedCategory) {
        fetchSubCategories(selectedCategory.name);
        // Reset the sub-category when category changes
        setFormData(prev => ({
          ...prev,
          subCategory: ''
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { name, categoryId, price, stock } = formData;
    if (!name || !categoryId || !price || !stock) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.categoryId);
    data.append('subCategory', formData.subCategory || null);
    data.append('price', parseFloat(formData.price));
    data.append('stock', parseInt(formData.stock));
    data.append('description', formData.description);
    data.append('featured', featured);
    // Handle image - either file upload or URL
    if (imageFile) {
      data.append('image', imageFile);
    } else if (formData.imageUrl) {
      data.append('image', formData.imageUrl);
    }

    try {
      let response;
      if (isAdding) {
        response = await api.post('/products', data);
        setProducts([...products, response.data]);
      } else if (isEditing && selectedProduct) {
        response = await api.put(`/products/${selectedProduct._id}`, data);
        setProducts(products.map(p =>
          p._id === selectedProduct._id ? response.data : p
        ));
      }
      handleCancel();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
      console.error(err);
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
        <button className="add-btn" onClick={handleAddProduct}>+ Add New Product</button>
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
                  <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                  <td>{product.featured ? '⭐' : '-'}</td>
                  <td>
                    <button onClick={() => handleEditProduct(product)} className="edit">Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="delete">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="empty">No products found</td></tr>
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
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {formData.categoryId && availableSubCategories.length > 0 && (
                <div className="form-group">
                  <label>Sub-Category *</label>
                  <select
                    name="subCategory"
                    value={formData.subCategory || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Sub-Category</option>
                    {availableSubCategories.map(subCat => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div className="image-input-container">
                  <input type="file" onChange={handleImageChange} accept="image/*" />
                  <p className="or-divider">OR</p>
                  <div className="image-url-input">
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                {(imageFile || formData.imageUrl) && (
                  <div className="image-preview-container">
                    <p>Image Preview:</p>
                    <div className="image-preview">
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" />
                      ) : formData.imageUrl ? (
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                )}
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
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Processing...' : isAdding ? 'Add Product' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

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

  // New state variables for controlled form inputs
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

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
    console.log('handleAddProduct called');
    setIsAdding(true);
    setSelectedProduct(null);
    setImageFile(null);
    setFeatured(false);
    // Reset form fields
    setName('');
    setCategoryId('');
    setPrice('');
    setStock('');
    setDescription('');
  };

  const handleEditProduct = (product) => {
    console.log('handleEditProduct called with product:', product);
    setSelectedProduct(product);
    setIsEditing(true);
    setIsAdding(false);
    setImageFile(null);
    setFeatured(product.featured || false);
    // Set form fields with selected product data
    setName(product.name || '');
    setCategoryId(product.category?._id || '');
    setPrice(product.price || '');
    setStock(product.stock || '');
    setDescription(product.description || '');
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFeaturedChange = (e) => {
    setFeatured(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', categoryId);
    formData.append('price', parseFloat(price));
    formData.append('stock', parseInt(stock));
    formData.append('description', description);
    formData.append('featured', featured);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (isAdding) {
        const response = await api.post('/products', formData);
        setProducts([...products, response.data]);
      } else {
        const response = await api.put(`/products/${selectedProduct._id}`, formData);
        setProducts(products.map(product => 
          product._id === selectedProduct._id ? { ...product, ...response.data } : product
        ));
      }
      setIsEditing(false);
      setIsAdding(false);
      setImageFile(null);
      setFeatured(false);
      // Reset form fields
      setName('');
      setCategoryId('');
      setPrice('');
      setStock('');
      setDescription('');
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error('Error saving product:', err);
    }
  };

  if (loading) return <div className="admin-content">Loading products...</div>;
  if (error) return <div className="admin-content error-message">{error}</div>;

  return (
    <div className="admin-content">
      <div className="products-header">
        <h1>Products Management</h1>
        <button onClick={handleAddProduct} className="add-product-btn">Add New Product</button>
      </div>

      <div className="products-container">
        <div className="products-table">
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
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.category.name || product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.featured ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(isEditing || isAdding) && (
          <div
            key={isAdding ? 'new' : selectedProduct?._id || 'edit'}
            className="product-form"
          >
            <h2>{isAdding ? 'Add New Product' : 'Edit Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    console.log('Name input changed:', e.target.value);
                    setName(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                {selectedProduct?.image && !imageFile && (
                  <img src={selectedProduct.image} alt="Product" style={{ width: '100px', marginTop: '10px' }} />
                )}
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={featured} onChange={handleFeaturedChange} />
                  Featured
                </label>
              </div>
              <div className="form-actions">
                <button type="submit">{isAdding ? 'Add Product' : 'Save Changes'}</button>
                <button type="button" onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                  setImageFile(null);
                  setFeatured(false);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

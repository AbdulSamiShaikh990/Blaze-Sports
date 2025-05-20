import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories. Please check your connection and try again.');
        setLoading(false);
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setIsAdding(true);
    setSelectedCategory(null);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories(categories.filter(category => category._id !== categoryId));
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      console.error('Error deleting category:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryData = {
      name: formData.get('name'),
      description: formData.get('description')
    };

    try {
      if (isAdding) {
        const response = await api.post('/categories', categoryData);
        setCategories([...categories, response.data]);
      } else {
        const response = await api.put(`/categories/${selectedCategory._id}`, categoryData);
        setCategories(categories.map(category => 
          category._id === selectedCategory._id ? { ...category, ...response.data } : category
        ));
      }
      setIsEditing(false);
      setIsAdding(false);
    } catch (err) {
      setError('Failed to save category. Please try again.');
      console.error('Error saving category:', err);
    }
  };

  if (loading) return <div className="admin-content">Loading categories...</div>;
  if (error) return <div className="admin-content error-message">{error}</div>;

  return (
    <div className="admin-content">
      <div className="categories-header">
        <h1>Categories Management</h1>
        <button onClick={handleAddCategory} className="add-category-btn">Add New Category</button>
      </div>

      <div className="categories-container">
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <button onClick={() => handleEditCategory(category)}>Edit</button>
                    <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(isEditing || isAdding) && (
          <div className="category-form">
            <h2>{isAdding ? 'Add New Category' : 'Edit Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name:</label>
                <input type="text" name="name" defaultValue={selectedCategory?.name} required />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea name="description" defaultValue={selectedCategory?.description} required />
              </div>
              <div className="form-actions">
                <button type="submit">{isAdding ? 'Add Category' : 'Save Changes'}</button>
                <button type="button" onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories; 
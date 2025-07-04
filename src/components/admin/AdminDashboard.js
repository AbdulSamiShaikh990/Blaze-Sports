import React, { useState, useEffect } from 'react';
import AdminModal from './AdminModal';
import { FaUsers, FaBoxOpen, FaTags, FaTachometerAlt, FaPlus } from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import api from '../../config/api';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const sidebarLinks = [
  { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { key: 'users', label: 'Users', icon: <FaUsers /> },
  { key: 'products', label: 'Products', icon: <FaBoxOpen /> },
  { key: 'categories', label: 'Categories', icon: <FaTags /> },
];

const cardIcons = {
  users: <FaUsers className="card-icon" />,
  products: <FaBoxOpen className="card-icon" />,
  categories: <FaTags className="card-icon" />,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addProductData, setAddProductData] = useState({ name: '', price: '', category: '', subCategory: '', description: '', stock: '', featured: false, image: null });
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [formError, setFormError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserData, setAddUserData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addCategoryData, setAddCategoryData] = useState({ name: '', description: '' });

  // Format price in PKR
  const formatPrice = (price) => {
    return `PKR ${Number(price).toLocaleString('en-PK')}`;
  };

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setError('Authentication required. Please log in.');
        navigate('/auth');
        return;
      }
      
      try {
        // Get the ID token with a force refresh to ensure it's up-to-date
        const token = await user.getIdToken(true);
        localStorage.setItem('token', token);
        
        // Set the token in the API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch data after authentication is confirmed
        fetchAllData();
      } catch (error) {
        console.error('Error getting auth token:', error);
        setError('Authentication error. Please try logging in again.');
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  // Fetch live data from backend
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current token
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        // If no token, try to get a new one from the current user
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } else {
          throw new Error('No authentication token available');
        }
      }
      
      const [usersRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/categories'),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    // Optionally, you can set up polling for live updates:
    // const interval = setInterval(fetchAllData, 10000); // every 10s
    // return () => clearInterval(interval);
  }, []);

  // Stats for cards
  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalCategories: categories.length
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save button (mock)
  const handleSave = () => {
    alert('Saved! (mock)');
    setSelectedItem(editData);
    // After save, refresh data
    fetchAllData();
  };

  // When selectedItem changes, update editData
  useEffect(() => {
    if (selectedItem) {
      // Create a clean copy of the selected item
      const cleanData = { ...selectedItem };
      
      // Handle image field specially
      if (cleanData.image) {
        // Keep the image URL as is, don't convert to File object
        cleanData.image = cleanData.image;
      }
      
      setEditData(cleanData);
    } else {
      setEditData(null);
    }
  }, [selectedItem]);

  // Sidebar navigation
  const handleSidebarNav = (section) => {
    setActiveSection(section);
    setSelectedItem(null);
  };

  // Chart data (live)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [2, 3, 4, 5, stats.totalUsers, stats.totalUsers],
        backgroundColor: '#3498db',
        borderRadius: 8,
        maxBarThickness: 32,
      },
      {
        label: 'Products',
        data: [1, 1, 2, 2, stats.totalProducts, stats.totalProducts],
        backgroundColor: '#2ecc71',
        borderRadius: 8,
        maxBarThickness: 32,
      },
      {
        label: 'Categories',
        data: [2, 2, 3, 3, stats.totalCategories, stats.totalCategories],
        backgroundColor: '#f1c40f',
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#232b3e', font: { size: 14, weight: 'bold' } },
      },
      title: {
        display: true,
        text: 'Platform Growth (Last 6 Months)',
        color: '#232b3e',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 16 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#232b3e', font: { size: 13 } },
        grid: { color: '#e3e8ee' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#232b3e', font: { size: 13 } },
        grid: { color: '#e3e8ee' },
      },
    },
  };

  const doughnutData = {
    labels: ['Users', 'Products', 'Categories'],
    datasets: [
      {
        label: 'Total',
        data: [stats.totalUsers, stats.totalProducts, stats.totalCategories],
        backgroundColor: ['#3498db', '#2ecc71', '#f1c40f'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };
  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#232b3e', font: { size: 14, weight: 'bold' } },
      },
      title: {
        display: true,
        text: 'Distribution',
        color: '#232b3e',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 8 },
      },
    },
  };

  // Function to get sub-categories for a selected category
  const fetchSubCategories = (categoryId) => {
    console.log('fetchSubCategories called with categoryId:', categoryId);
    console.log('Available categories:', categories);
    
    if (categoryId) {
      const selectedCategory = categories.find(cat => (cat._id || cat.id) === categoryId);
      console.log('Selected category:', selectedCategory);
      
      // For debugging, let's always show subcategories for now
      setAvailableSubCategories(['Gear', 'Apparel']);
      console.log('Set subcategories to:', ['Gear', 'Apparel']);
      
      /* Original logic - commented out for debugging
      if (selectedCategory && ['Cricket', 'Football', 'Basketball', 'Badminton'].includes(selectedCategory.name)) {
        setAvailableSubCategories(['Gear', 'Apparel']);
      } else {
        setAvailableSubCategories([]);
      }
      */
    } else {
      setAvailableSubCategories([]);
      console.log('No category selected, cleared subcategories');
    }
  };

  // Add Product Handler
  const handleAddProductChange = (e) => {
    e.persist && e.persist(); // For React synthetic events
    const { name, value, type, checked, files } = e.target;
    if (e.target.name === 'featured') {
      setAddProductData({ ...addProductData, [e.target.name]: e.target.checked });
    } else if (e.target.name === 'image') {
      setAddProductData({ ...addProductData, image: e.target.files[0] });
    } else {
      setAddProductData({ ...addProductData, [e.target.name]: e.target.value });
      
      // If category changes, fetch the available sub-categories
      if (e.target.name === 'category' && e.target.value) {
        fetchSubCategories(e.target.value);
        // Reset the sub-category when category changes
        setAddProductData(prev => ({
          ...prev,
          subCategory: ''
        }));
      }
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormError(null);
    
    try {
      // Validate required fields
      if (!addProductData.name || !addProductData.price || !addProductData.category || !addProductData.stock) {
        setFormError('Please fill in all required fields');
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', addProductData.name);
      formData.append('description', addProductData.description || 'No description provided');
      formData.append('price', addProductData.price);
      formData.append('category', addProductData.category);
      formData.append('subCategory', addProductData.subCategory || 'Gear');
      formData.append('stock', addProductData.stock);
      formData.append('featured', addProductData.featured || false);
      
      // Add image if selected
      if (addProductData.image) {
        formData.append('image', addProductData.image);
        console.log('Image added to form data:', addProductData.image.name);
      }
      
      console.log('Sending product data with image');
      
      // Use fetch with FormData for file upload
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        // Don't set Content-Type header when using FormData with files
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      const result = await response.json();
      console.log('Product added successfully:', result);
      
      // Reset form data but keep the form open
      setAddProductData({ name: '', price: '', category: '', subCategory: '', description: '', stock: '', featured: false, image: null });
      fetchAllData();
      
      // Show success message
      setFormError('Product added successfully! You can add another or click Cancel to close.');
    } catch (err) {
      console.error('Error adding product:', err);
      setFormError(err.message || 'Failed to add product');
    }
  };

  // Edit Product Handler
  const handleProductEditSave = async () => {
    setFormError(null);
    
    try {
      // Get current user and refresh token
      const user = auth.currentUser;
      if (!user) {
        setFormError('Authentication required. Please log in again.');
        return;
      }
      
      // Get fresh token
      const token = await user.getIdToken(true);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const formData = new FormData();
      
      // Process each field in the editData
      Object.entries(editData).forEach(([key, value]) => {
        // Skip image field if it's a string (existing image URL) or null/undefined
        if (key === 'image') {
          if (value instanceof File) {
            formData.append('image', value);
          } else if (typeof value === 'string' && value.trim() !== '') {
            // If it's a string URL, pass it along
            formData.append('image', value);
          }
          // Skip if no value or empty string
          return;
        }
        
        // Handle category - always send only the category ID
        if (key === 'category') {
          if (typeof value === 'object' && value !== null && value._id) {
            formData.append('category', value._id);
          } else if (value) {
            formData.append('category', value);
          }
        } else if (value !== null && value !== undefined) {
          // For all other fields, append if they have a value
          formData.append(key, value);
        }
      });
      
      // Send the update request
      await api.put(`/products/${editData._id || editData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setSelectedItem(null);
      fetchAllData();
    } catch (err) {
      console.error('Error updating product:', err);
      setFormError(err.response?.data?.message || 'Failed to update product');
    }
  };

  // Add User Handler
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserData({ ...addUserData, [name]: value });
  };
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormError(null);
    
    try {
      await api.post('/auth/signup', { ...addUserData, userType: addUserData.role });
      
      // Reset form data but keep the form open
      setAddUserData({ name: '', email: '', password: '', role: 'user' });
      fetchAllData();
      
      // Show success message
      setFormError('User added successfully! You can add another or click Cancel to close.');
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to add user');
    }
  };
  // Edit User Handler
  const handleUserEditSave = async () => {
    setFormError(null);
    
    try {
      // Get current user and refresh token
      const user = auth.currentUser;
      if (!user) {
        setFormError('Authentication required. Please log in again.');
        return;
      }
      
      // Get fresh token
      const token = await user.getIdToken(true);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.put(`/users/${editData._id || editData.id}`, {
        name: editData.name,
        email: editData.email,
        role: editData.role || editData.userType || 'user',
      });
      setSelectedItem(null);
      fetchAllData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update user');
    }
  };

  // Add Category Handler
  const handleAddCategoryChange = (e) => {
    const { name, value } = e.target;
    setAddCategoryData({ ...addCategoryData, [name]: value });
  };
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormError(null);
    
    try {
      await api.post('/categories', addCategoryData);
      
      // Reset form data but keep the form open
      setAddCategoryData({ name: '', description: '' });
      fetchAllData();
      
      // Show success message
      setFormError('Category added successfully! You can add another or click Cancel to close.');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add category');
    }
  };
  // Edit Category Handler
  const handleCategoryEditSave = async () => {
    setFormError(null);
    
    try {
      // Get current user and refresh token
      const user = auth.currentUser;
      if (!user) {
        setFormError('Authentication required. Please log in again.');
        return;
      }
      
      // Get fresh token
      const token = await user.getIdToken(true);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.put(`/categories/${editData._id || editData.id}`, {
        name: editData.name,
        description: editData.description,
      });
      setSelectedItem(null);
      fetchAllData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update category');
    }
  };

  // Render main dashboard cards
  const renderDashboard = () => (
    <div className="dashboard-cards-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-subtitle">Welcome back! Here is a quick overview of your platform's stats.</div>
        <div className="dashboard-stats">
          <div className="stat-card">
          {cardIcons.users}
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          <button className="view-details" onClick={() => handleSidebarNav('users')}>View Users</button>
          </div>
          <div className="stat-card">
          {cardIcons.products}
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          <button className="view-details" onClick={() => handleSidebarNav('products')}>View Products</button>
          </div>
          <div className="stat-card">
          {cardIcons.categories}
            <h3>Total Categories</h3>
            <p>{stats.totalCategories}</p>
          <button className="view-details" onClick={() => handleSidebarNav('categories')}>View Categories</button>
        </div>
      </div>
      {/* Charts Section */}
      <div className="dashboard-charts-row">
        <div className="dashboard-chart dashboard-bar-chart">
          <Bar data={barData} options={barOptions} height={260} />
          </div>
        <div className="dashboard-chart dashboard-doughnut-chart">
          <Doughnut data={doughnutData} options={doughnutOptions} width={220} height={220} />
        </div>
      </div>
    </div>
  );

  // Render table for each section
  const renderTable = () => {
    if (activeSection === 'users') {
      return (
        <div className="section-table-container">
          <div className="section-header-row">
            <h2>Users Management</h2>
            <button className="add-btn" onClick={() => setShowAddUser(true)}><FaPlus style={{marginRight:4}}/> Add New User</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id || user._id} onClick={() => setSelectedItem(user)} className={selectedItem?.id === user.id || selectedItem?._id === user._id ? 'selected-row' : ''}>
                  <td>{user.id || user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role || user.userType}</td>
                  <td>
                    <button className="edit-btn" onClick={e => { e.stopPropagation(); setSelectedItem(user); }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (activeSection === 'categories') {
      return (
        <div className="section-table-container">
          <div className="section-header-row">
            <h2>Categories Management</h2>
            <button className="add-btn" onClick={() => setShowAddCategory(true)}><FaPlus style={{marginRight:4}}/> Add New Category</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id || cat._id} onClick={() => setSelectedItem(cat)} className={selectedItem?.id === cat.id || selectedItem?._id === cat._id ? 'selected-row' : ''}>
                  <td>{cat.id || cat._id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <button className="edit-btn" onClick={e => { e.stopPropagation(); setSelectedItem(cat); }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Add Category Modal */}
          {showAddCategory && (
            <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Category</h2>
                <form onSubmit={handleAddCategorySubmit} className="details-form" onClick={(e) => e.stopPropagation()}>
                  <label>Name:<input name="name" value={addCategoryData.name} onChange={handleAddCategoryChange} required /></label>
                  <label>Description:<input name="description" value={addCategoryData.description} onChange={handleAddCategoryChange} required /></label>
                  {formError && <div className="error-message">{formError}</div>}
                  <div style={{display:'flex',gap:12}}>
                    <button className="save-btn" type="submit">Add Category</button>
                    <button className="edit-btn" type="button" onClick={()=>setShowAddCategory(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }
    if (activeSection === 'products') {
      return (
        <div className="section-table-container">
          <div className="section-header-row">
            <h2>Products Management</h2>
            <button className="add-btn" onClick={() => setShowAddProduct(true)}><FaPlus style={{marginRight:4}}/> Add New Product</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Category</th><th>Sub-Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id || prod._id} onClick={() => setSelectedItem(prod)} className={selectedItem?.id === prod.id || selectedItem?._id === prod._id ? 'selected-row' : ''}>
                  <td>{prod.id || prod._id}</td>
                  <td>{prod.name}</td>
                  <td>{typeof prod.category === 'object' && prod.category ? prod.category.name : prod.category || 'Uncategorized'}</td>
                  <td>{prod.subCategory || '-'}</td>
                  <td>{formatPrice(prod.price)}</td>
                  <td>{prod.stock}</td>
                  <td>{prod.featured ? '⭐' : '-'}</td>
                  <td>
                    <button className="edit-btn" onClick={e => { e.stopPropagation(); setSelectedItem(prod); }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Product</h2>
                <form onSubmit={handleAddProductSubmit} className="details-form" onClick={(e) => e.stopPropagation()}>
                  <label>Product Name<input name="name" value={addProductData.name} onChange={handleAddProductChange} required placeholder="Enter product name" /></label>
                  
                  <label className="half-width">Price (PKR)<input name="price" type="number" value={addProductData.price} onChange={handleAddProductChange} required placeholder="Enter price in PKR" /></label>
                  
                  <label className="half-width">Stock Quantity<input name="stock" type="number" value={addProductData.stock} onChange={handleAddProductChange} required placeholder="Enter available quantity" /></label>
                  
                  <label>Category
                    <select name="category" value={addProductData.category} onChange={handleAddProductChange} required>
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </label>
                  
                  {/* Always show subcategory field for now */}
                  <label>Sub-Category
                    <select name="subCategory" value={addProductData.subCategory} onChange={handleAddProductChange} required>
                      <option value="">Select Sub-Category</option>
                      <option value="Gear">Gear</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </label>
                  
                  <label>Description<textarea name="description" value={addProductData.description} onChange={handleAddProductChange} rows="3" placeholder="Enter product description" /></label>
                  
                  <label className="checkbox-label">
                    <input name="featured" type="checkbox" checked={addProductData.featured} onChange={handleAddProductChange} />
                    Featured Product (will be highlighted on homepage)
                  </label>
                  
                  <label>Product Image<input name="image" type="file" accept="image/*" onChange={handleAddProductChange} /></label>
                  
                  {formError && <div className="error-message">{formError}</div>}
                  
                  <div className="form-actions">
                    <button className="cancel-btn" type="button" onClick={()=>setShowAddProduct(false)}>Cancel</button>
                    <button className="save-btn" type="submit">Add Product</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Render details/edit form for selected item
  const renderDetails = () => {
    if (!selectedItem) return null;
    if (activeSection === 'users') {
      return (
        <div className="details-form">
          <h2>Edit User</h2>
          <label>Name:<input name="name" value={editData?.name || ''} onChange={handleEditChange} /></label>
          <label>Email:<input name="email" value={editData?.email || ''} onChange={handleEditChange} /></label>
          <label>Role:
            <select name="role" value={editData?.role || editData?.userType || 'user'} onChange={handleEditChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {formError && <div className="error-message">{formError}</div>}
          <button className="save-btn" type="button" onClick={handleUserEditSave}>Save</button>
        </div>
      );
    }
    if (activeSection === 'categories') {
      return (
        <div className="details-form">
          <h2>Edit Category</h2>
          <label>Name:<input name="name" value={editData?.name || ''} onChange={handleEditChange} /></label>
          <label>Description:<input name="description" value={editData?.description || ''} onChange={handleEditChange} /></label>
          {formError && <div className="error-message">{formError}</div>}
          <button className="save-btn" type="button" onClick={handleCategoryEditSave}>Save</button>
        </div>
      );
    }
    if (activeSection === 'products') {
      return (
        <div className="details-form">
          <h2>Edit Product</h2>
          <label>Name:<input name="name" value={editData?.name || ''} onChange={handleEditChange} /></label>
          <label>Price:<input name="price" value={editData?.price || ''} onChange={handleEditChange} /></label>
          <label>Category:
            <select name="category" value={typeof editData?.category === 'object' ? editData.category?._id : editData?.category || ''} onChange={handleEditChange}>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>Description:<input name="description" value={editData?.description || ''} onChange={handleEditChange} /></label>
          <label>Stock:<input name="stock" value={editData?.stock || ''} onChange={handleEditChange} /></label>
          <label>Featured:<input type="checkbox" name="featured" checked={!!editData?.featured} onChange={e => setEditData({ ...editData, featured: e.target.checked })} /></label>
          <label>Image:<input name="image" type="file" accept="image/*" onChange={e => setEditData({ ...editData, image: e.target.files[0] || null })} /></label>
          {editData?.image && typeof editData.image === 'string' && (
            <div className="current-image">
              <p>Current image:</p>
              <img src={editData.image.startsWith('http') ? editData.image : `/uploads/${editData.image.replace('/uploads/', '')}`} 
                   alt="Current product" style={{maxWidth: '100px', maxHeight: '100px'}} />
            </div>
          )}
          {formError && <div className="error-message">{formError}</div>}
          <button className="save-btn" type="button" onClick={handleProductEditSave}>Save</button>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="admin-main-content"><div>Loading dashboard...</div></div>;
  if (error) return (
    <div className="admin-main-content">
      <div className="error-message">
        {error}
        {error.includes('Authentication') && (
          <button 
            className="login-btn" 
            onClick={() => navigate('/auth')}
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <SidebarAdmin onNavigate={handleSidebarNav} activeSection={activeSection} />
      <div className="admin-main-content">
        {activeSection === 'dashboard' && renderDashboard()}
        {['users', 'categories', 'products'].includes(activeSection) && (
          <div className="section-content">
            <div className="section-left">{renderTable()}</div>
            <div className="section-right">{renderDetails()}</div>
          </div>
        )}
        
        {/* User Add Modal - Persistent and won't disappear */}
        <AdminModal 
          isOpen={showAddUser} 
          onClose={() => setShowAddUser(false)} 
          title="Add New User"
        >
          <form onSubmit={handleAddUserSubmit} className="details-form">
            <label>Name:<input name="name" value={addUserData.name} onChange={handleAddUserChange} required /></label>
            <label>Email:<input name="email" type="email" value={addUserData.email} onChange={handleAddUserChange} required /></label>
            <label>Password:<input name="password" type="password" value={addUserData.password} onChange={handleAddUserChange} required /></label>
            <label>Role:
              <select name="role" value={addUserData.role} onChange={handleAddUserChange} required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            {formError && <div className="error-message">{formError}</div>}
            <div style={{display:'flex',gap:12,marginTop:15}}>
              <button className="save-btn" type="submit">Add User</button>
              <button className="edit-btn" type="button" onClick={()=>setShowAddUser(false)}>Cancel</button>
            </div>
          </form>
        </AdminModal>
        
        {/* Category Add Modal - Persistent and won't disappear */}
        <AdminModal 
          isOpen={showAddCategory} 
          onClose={() => setShowAddCategory(false)} 
          title="Add New Category"
        >
          <form onSubmit={handleAddCategorySubmit} className="details-form">
            <label>Name:<input name="name" value={addCategoryData.name} onChange={handleAddCategoryChange} required /></label>
            <label>Description:<input name="description" value={addCategoryData.description} onChange={handleAddCategoryChange} required /></label>
            {formError && <div className="error-message">{formError}</div>}
            <div style={{display:'flex',gap:12,marginTop:15}}>
              <button className="save-btn" type="submit">Add Category</button>
              <button className="edit-btn" type="button" onClick={()=>setShowAddCategory(false)}>Cancel</button>
            </div>
          </form>
        </AdminModal>
        
        {/* Product Add Modal - Persistent and won't disappear */}
        <AdminModal 
          isOpen={showAddProduct} 
          onClose={() => setShowAddProduct(false)} 
          title="Add New Product"
        >
          <form onSubmit={handleAddProductSubmit} className="details-form">
            <label>Product Name<input name="name" value={addProductData.name} onChange={handleAddProductChange} required placeholder="Enter product name" /></label>
            
            <label className="half-width">Price (PKR)<input name="price" type="number" value={addProductData.price} onChange={handleAddProductChange} required placeholder="Enter price in PKR" /></label>
            
            <label className="half-width">Stock Quantity<input name="stock" type="number" value={addProductData.stock} onChange={handleAddProductChange} required placeholder="Enter available quantity" /></label>
            
            <label>Category
              <select name="category" value={addProductData.category} onChange={handleAddProductChange} required>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>
            
            <label>Sub-Category
              <select name="subCategory" value={addProductData.subCategory} onChange={handleAddProductChange} required>
                <option value="">Select Sub-Category</option>
                <option value="Gear">Gear</option>
                <option value="Apparel">Apparel</option>
              </select>
            </label>
            
            <label>Description<textarea name="description" value={addProductData.description} onChange={handleAddProductChange} rows="3" placeholder="Enter product description" /></label>
            
            <label className="checkbox-label">
              <input name="featured" type="checkbox" checked={addProductData.featured} onChange={handleAddProductChange} />
              Featured Product (will be highlighted on homepage)
            </label>
            
            <label>Product Image<input name="image" type="file" accept="image/*" onChange={handleAddProductChange} /></label>
            
            {formError && <div className="error-message">{formError}</div>}
            
            <div className="form-actions">
              <button className="cancel-btn" type="button" onClick={()=>setShowAddProduct(false)}>Cancel</button>
              <button className="save-btn" type="submit">Add Product</button>
            </div>
          </form>
        </AdminModal>
      </div>
    </div>
  );
};

// Sidebar for admin panel
const SidebarAdmin = ({ onNavigate, activeSection }) => (
  <div className="admin-sidebar">
    <div className="admin-sidebar-logo">
      {/* You can replace this with your logo image if you want */}
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Admin Logo" />
      <span>Admin Panel</span>
    </div>
    <ul className="admin-sidebar-nav">
      {sidebarLinks.map(link => (
        <li
          key={link.key}
          className={activeSection === link.key ? 'active' : ''}
          onClick={() => onNavigate(link.key)}
        >
          {link.icon} {link.label}
        </li>
      ))}
    </ul>
  </div>
);

export default AdminDashboard;
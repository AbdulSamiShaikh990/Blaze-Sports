import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, categoriesRes] = await Promise.all([
          api.get('/users'),
          api.get('/products'),
          api.get('/categories')
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalProducts: productsRes.data.length,
          totalCategories: categoriesRes.data.length
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to fetch dashboard statistics. Please try again.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="admin-content">Loading dashboard...</div>;
  if (error) return <div className="admin-content error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/categories">Categories</Link></li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
            <Link to="/admin/users" className="view-details">View Users</Link>
          </div>
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
            <Link to="/admin/products" className="view-details">View Products</Link>
          </div>
          <div className="stat-card">
            <h3>Total Categories</h3>
            <p>{stats.totalCategories}</p>
            <Link to="/admin/categories" className="view-details">View Categories</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
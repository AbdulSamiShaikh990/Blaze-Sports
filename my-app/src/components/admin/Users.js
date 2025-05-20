import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users. Please check your connection and try again.');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name: e.target.name.value,
        email: e.target.email.value,
        role: e.target.role.value
      };

      const response = await api.put(`/users/${selectedUser._id}`, updatedUser);
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, ...response.data } : user
      ));
      setIsEditing(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  if (loading) return <div className="admin-content">Loading users...</div>;
  if (error) return <div className="admin-content error-message">{error}</div>;

  return (
    <div className="admin-content">
      <h1>Users Management</h1>
      <div className="users-container">
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditing && selectedUser && (
          <div className="edit-user-form">
            <h2>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" defaultValue={selectedUser.name} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" defaultValue={selectedUser.email} required />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select name="role" defaultValue={selectedUser.role} required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register a new user with email and password
  async function signup(email, password, name) {
    try {
      setError('');
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user in MongoDB
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        userType: 'customer',
        firebaseUid: userCredential.user.uid
      });
      
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Login with email and password
  async function login(email, password) {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from MongoDB
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        firebaseUid: userCredential.user.uid
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user exists in MongoDB, if not create one
      try {
        const response = await axios.post('http://localhost:5000/api/auth/google-login', {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          firebaseUid: userCredential.user.uid
        });
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
      } catch (err) {
        console.error('Error syncing with MongoDB:', err);
      }
      
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Logout user
  async function logout() {
    try {
      setError('');
      // Remove token from localStorage
      localStorage.removeItem('token');
      return await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      setError('');
      return await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Update user profile
  async function updateUserProfile(user, profile) {
    try {
      setError('');
      await updateProfile(user, profile);
      
      // Update user in MongoDB
      await axios.put('http://localhost:5000/api/users/profile', {
        name: profile.displayName,
        photoURL: profile.photoURL
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setCurrentUser({...currentUser, ...profile});
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user data from MongoDB to get user type
          const response = await fetch(`http://localhost:5000/api/firebase-auth/verify-token`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('User data from MongoDB:', data);
            
            // Store user type in localStorage
            localStorage.setItem('userType', data.user.userType);
            console.log('User type stored in localStorage:', data.user.userType);
          }
        } catch (error) {
          console.error('Error fetching user data from MongoDB:', error);
        }
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    loginWithGoogle,
    updateUserProfile,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

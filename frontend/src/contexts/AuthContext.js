import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../config/supabase';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { toast } = useToast();

  // Set up axios interceptor for authentication
  useEffect(() => {
    if (token && !token.startsWith('mock-token-')) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session first
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase auth error:', error);
        }
        
        if (session?.user) {
          console.log('Supabase session found:', session.user);
          setUser(session.user);
          setToken(session.access_token);
          setLoading(false);
          return;
        }
        
        // No fallback to localStorage - only use Supabase
        if (token && !token.startsWith('mock-token-')) {
          try {
            const response = await axios.get(`${API}/auth/me`);
            setUser(response.data);
          } catch (error) {
            console.error('Backend auth check failed:', error);
            logout();
          }
        } else {
          // Clear any mock tokens
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Try Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log('Supabase login failed:', error);
        throw new Error(`Login failed: ${error.message || 'Invalid credentials'}`);
      }

      if (data.user) {
        console.log('Supabase login successful:', data.user);
        setUser(data.user);
        setToken(data.session.access_token);
        localStorage.setItem('token', data.session.access_token);
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${data.user.email}!`,
        });

        return { success: true };
      }
    } catch (supabaseError) {
      console.log('Supabase login failed, trying backend API:', supabaseError);
      
      // Try backend API as fallback
      try {
        const response = await axios.post(`${API}/auth/login`, {
          email,
          password
        });

        const { token, user } = response.data;
        
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.first_name}!`,
        });

        return { success: true };
      } catch (apiError) {
        console.error('Backend API login failed:', apiError);
        throw new Error('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Try Supabase auth first
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            company_name: userData.companyName,
            country: userData.country,
            city: userData.city
          }
        }
      });

      if (error) {
        console.log('Supabase registration failed:', error);
        throw new Error(error.message || 'Registration failed');
      }

      if (data.user) {
        console.log('Supabase registration successful:', data.user);
        
        toast({
          title: 'Registration Successful',
          description: 'Please check your email to confirm your account.',
        });

        return { success: true };
      }
    } catch (supabaseError) {
      console.log('Supabase registration failed, trying backend API:', supabaseError);
      
      // Try backend API as fallback
      try {
        const response = await axios.post(`${API}/auth/register`, userData);
        
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created successfully.',
        });

        return { success: true };
      } catch (apiError) {
        console.error('Backend API registration failed:', apiError);
        throw new Error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase logout error:', error);
    }
    
    // Clear local state
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const isAuthenticated = !!user;
  const userDiscount = user?.user_metadata?.discount_percentage || 0;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    userDiscount,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
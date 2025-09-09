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
        
        // Fallback to localStorage for backward compatibility
        if (token) {
          if (token.startsWith('mock-token-')) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const mockUser = JSON.parse(storedUser);
              setUser(mockUser);
            } else {
              setToken(null);
              localStorage.removeItem('token');
            }
          } else {
            try {
              const response = await axios.get(`${API}/auth/me`);
              setUser(response.data);
            } catch (error) {
              console.error('Backend auth check failed:', error);
              if (!token.startsWith('mock-token-')) {
                logout();
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Try Supabase Auth first
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          console.log('Supabase login successful:', data.user);
          setUser(data.user);
          setToken(data.session.access_token);
          
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
          // Fallback to localStorage login for development
          console.log('Backend API not available, using localStorage login');
        }
        
        // Check admin user first - simple admin/admin login
        if (email === "admin" && password === "admin") {
          const adminUser = {
            id: "1",
            first_name: "Admin",
            last_name: "User",
            email: "admin@bilal-parts.com",
            role: "ADMIN",
            is_active: true
          };
          
          setUser(adminUser);
          setToken("mock-token-" + Date.now());
          localStorage.setItem('token', "mock-token-" + Date.now());
          localStorage.setItem('user', JSON.stringify(adminUser));
          
          toast({
            title: 'Login Successful',
            description: `Welcome back, ${adminUser.first_name}!`,
          });

          return { success: true };
        }
        
        // Check for admin@sadoparts.ru as regular user
        if (email === "admin@sadoparts.ru" && password === "admin123") {
          const regularUser = {
            id: "2",
            first_name: "Sadiq",
            last_name: "Layijov",
            email: "admin@sadoparts.ru",
            role: "CUSTOMER",
            is_active: true,
            status: "APPROVED"
          };
          
          setUser(regularUser);
          setToken("mock-token-" + Date.now());
          localStorage.setItem('token', "mock-token-" + Date.now());
          localStorage.setItem('user', JSON.stringify(regularUser));
          
          toast({
            title: 'Login Successful',
            description: `Welcome back, ${regularUser.first_name}!`,
          });

          return { success: true };
        }
        
        // Check registered users
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === email);
        
        if (user) {
          // Check if user is approved
          if (user.status === "PENDING") {
            throw new Error("Your account is pending approval. Please wait for admin approval.");
          }
          
          if (user.status === "REJECTED") {
            throw new Error("Your account has been rejected. Please contact support.");
          }
          
          // For approved users, check password (in real app, this would be hashed)
          if (password === user.password) { // Check the actual stored password
            setUser(user);
            setToken("mock-token-" + Date.now());
            localStorage.setItem('token', "mock-token-" + Date.now());
            localStorage.setItem('user', JSON.stringify(user));
            
            toast({
              title: 'Login Successful',
              description: `Welcome back, ${user.first_name}!`,
            });

            return { success: true };
          } else {
            throw new Error("Invalid password");
          }
        } else {
          throw new Error("User not found. Please register first.");
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast({
        title: 'Login Failed',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Try Supabase Auth first
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.first_name,
              last_name: userData.last_name,
              company_name: userData.company_name,
              phone: userData.phone,
              country: userData.country,
              city: userData.city,
              vat_number: userData.vat_number
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          console.log('Supabase registration successful:', data.user);
          
          toast({
            title: 'Registration Successful',
            description: 'Your account has been created. Please check your email to verify your account.',
          });

          return { success: true, user: data.user };
        }
      } catch (supabaseError) {
        console.log('Supabase registration failed, trying backend API:', supabaseError);
        
        // Try backend API as fallback
        try {
          const response = await axios.post(`${API}/auth/register`, userData);
          
          toast({
            title: 'Registration Successful',
            description: response.data.message || 'Your account has been created. Please check your email to verify your account.',
          });

          return { success: true, user: response.data.user };
        } catch (apiError) {
          // Fallback to localStorage registration for development
          console.log('Backend API not available, using localStorage registration');
        }
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = existingUsers.find(u => u.email === userData.email);
        
        if (userExists) {
          throw new Error('User with this email already exists');
        }
        
        const newUser = {
          id: "user-" + Date.now(),
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone: userData.phone,
          company_name: userData.company_name || '',
          country: userData.country || '',
          city: userData.city || '',
          vat_number: userData.vat_number || '',
          role: "CUSTOMER",
          status: "PENDING",
          is_active: false,
          discount: 0,
          password: userData.password, // Store the actual password
          created_at: new Date().toISOString()
        };
        
        // Save to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created. Please wait for admin approval.',
        });

        return { success: true, user: newUser };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
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
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const clearAllAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('registeredUsers');
    delete axios.defaults.headers.common['Authorization'];
    console.log('All auth data cleared');
  };

  const updateProfile = async (updateData) => {
    try {
      // Try backend API first
      const response = await axios.put(`${API}/auth/me`, updateData);
      setUser(response.data);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      return { success: true };
    } catch (apiError) {
      // Fallback to localStorage for development
      console.log('Backend API not available, using localStorage update');
      
      if (user) {
        const updatedUser = { ...user, ...updateData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update registered users if this is a registered user
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
          registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updateData };
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });

        return { success: true };
      } else {
        throw new Error('No user found to update');
      }
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to send reset email';
      toast({
        title: 'Reset Failed',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
    }
  };

  const isAdmin = () => {
    if (!user) return false;
    return user.role === 'ADMIN';
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    userDiscount: (user?.discount || 0) && user?.role !== 'ADMIN' ? user.discount : 0, // Only apply discount for non-admin users
    login,
    register,
    logout,
    clearAllAuthData,
    updateProfile,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
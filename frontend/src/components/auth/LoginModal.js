import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginModal = ({ children, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setOpen(false);
      setFormData({ email: '', password: '' });
      if (onSuccess) onSuccess();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-600">
            Login to Bilal-Parts
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              id="email"
              name="email"
              type="text"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email or username"
              className="focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="focus:ring-red-500 focus:border-red-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700 p-0"
              onClick={() => {
                // Handle forgot password
                console.log('Forgot password clicked');
              }}
            >
              Forgot Password?
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 p-0 text-xs"
              onClick={() => {
                setFormData({ email: 'admin', password: 'admin' });
              }}
            >
              Admin Login
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Logging in...</span>
              </div>
            ) : (
              'Login'
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700 p-0 font-medium"
              onClick={() => {
                setOpen(false);
                // You can trigger registration modal here
              }}
            >
              Sign up
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
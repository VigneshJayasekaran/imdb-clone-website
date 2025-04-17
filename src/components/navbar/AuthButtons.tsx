
import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';

const AuthButtons: React.FC = () => {
  const { login, signup } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  
  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }
    
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        // Reset form and close dialog
        setLoginEmail('');
        setLoginPassword('');
        // The dialog will be closed by the DOM
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    
    try {
      const success = await signup(signupUsername, signupEmail, signupPassword);
      if (success) {
        // Reset form and close dialog
        setSignupUsername('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        // The dialog will be closed by the DOM
      } else {
        setSignupError('Email already exists or sign up failed');
      }
    } catch (error) {
      setSignupError('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      {/* Login Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Login</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">Sign Up</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create an account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input 
                id="signup-email" 
                type="email" 
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input 
                id="signup-password" 
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {signupError && (
              <p className="text-red-500 text-sm">{signupError}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Sign Up</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthButtons;

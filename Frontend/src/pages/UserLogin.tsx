import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import '/Users/krismehra/AI-Powered_Identity_Verification_and_Fraud_Detection_for_KYC_Compliance/Frontend/UserLogin.css';

import userLoginBg from '@/assets/user-login.png';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (success) {
      navigate('/user-dashboard');
    } else {
      setError('Invalid credentials. Try: user@test.com / user123');
    }
  };

  return (
    <div
      className="relative min-h-screen text-white flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${userLoginBg})` }}
    >
      {/* 🔹 Blue-white overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-cyan-900/60 to-slate-900/80"></div>

      {/* 🔹 Soft blur = premium SaaS feel */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      {/* Back Button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-cyan-400 hover:text-cyan-300 z-30"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Main Content */}
      <div className="relative z-30 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 relative">
            <User className="w-10 h-10 text-white animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-50"></div>
          </div>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            User Login
          </h1>
          <p className="text-slate-300">Access your verification dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/80 border-cyan-400/40 backdrop-blur-3xl shadow-2xl holographic-card-aura">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Login to verify your documents securely
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/60 border-cyan-400/30 text-white placeholder:text-slate-500 hover:border-cyan-400 focus:border-cyan-400 input-focus-glow"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/60 border-cyan-400/30 text-white placeholder:text-slate-500 hover:border-cyan-400 focus:border-cyan-400 input-focus-glow"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 submit-button-glow active:scale-[0.99]"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
              <p className="text-xs text-slate-300 text-center">
                Demo Credentials: user@test.com / user123
              </p>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/admin-login')}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Login as Admin →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-slate-300 text-sm">
          <Shield className="w-4 h-4" />
          <span>Secured by VerifiX</span>
        </div>
      </div>
    </div>
  );
}

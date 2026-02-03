import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


import adminBg from '/Users/krismehra/AI-Powered_Identity_Verification_and_Fraud_Detection_for_KYC_Compliance/Frontend/src/assets/admin-login.png';


import '/Users/krismehra/AI-Powered_Identity_Verification_and_Fraud_Detection_for_KYC_Compliance/Frontend/UserLogin.css';

export default function AdminLogin() {
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
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials. Try: admin@verifix.com / admin123');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(255,255,255,0.60),
            rgba(219,234,254,0.58)
          ),
          url(${adminBg})
        `,
      }}
    >
      {/* Optional futuristic background layer */}
      <div className="kyc-security-background"></div>

      {/* Soft grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48ZyBmaWxsPSIjMDA5YmZlIiBmaWxsLW9wYWNpdHk9IjAuMDQiPjxwYXRoIGQ9Ik0zNiAxNmMwLTEuMS45LTIgMi0yczIgLjkgMiAyLS45IDItMiAyLTIuOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 z-0" />

      {/* Back Button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-blue-700 hover:text-blue-900 z-30"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* MAIN CONTENT */}
      <div className="relative z-30 w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-4 relative shadow-xl shadow-blue-300">
            <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-40"></div>
          </div>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-blue-800/70">
            Secure administrative access
          </p>
        </div>

        {/* LOGIN CARD */}
        <Card className="bg-white/90 backdrop-blur-2xl border border-blue-300/50 shadow-2xl rounded-2xl holographic-card-aura">
          <CardHeader>
            <CardTitle className="text-blue-900 text-2xl">
              Admin Access
            </CardTitle>
            <CardDescription className="text-blue-700/70">
              Manage verifications & fraud alerts
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EMAIL */}
              <div className="space-y-1">
                <Label className="text-blue-800">Admin Email</Label>
                <Input
                  type="email"
                  placeholder="admin@verifix.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/70 border-blue-400/40 text-blue-900 placeholder:text-blue-400 focus:border-blue-600 transition-all"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <Label className="text-blue-800">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/70 border-blue-400/40 text-blue-900 placeholder:text-blue-400 focus:border-blue-600 transition-all"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white transition-transform active:scale-[0.97]"
              >
                <Lock className="w-4 h-4 mr-2" />
                Admin Sign In
              </Button>
            </form>

            {/* DEMO CREDS */}
            <div className="mt-6 p-4 rounded-lg bg-blue-100/70 border border-blue-300">
              <p className="text-xs text-blue-700 text-center">
                Demo Credentials: admin@verifix.com / admin123
              </p>
            </div>

            {/* SWITCH */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/user-login')}
                className="text-blue-700 hover:text-blue-900 text-sm transition-colors"
              >
                Login as User →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-blue-700 text-sm">
          <Shield className="w-4 h-4" />
          <span>Protected Admin Access</span>
        </div>
      </div>
    </div>
  );
}

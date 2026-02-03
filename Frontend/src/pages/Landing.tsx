import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Scan, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Landing() {
  const navigate = useNavigate();

   // === Seva Agent Chat State ===
   type ChatMessage = {
  sender: 'user' | 'agent';
  text: string;
};

  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);

    try {
      // Call your Seva Agent backend API
      const res = await fetch('http://localhost:5000/api/seva-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      // Add agent response
      setMessages(prev => [...prev, { sender: 'agent', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: "Seva Agent is unavailable." }]);
    }

    setInput(""); // clear input
  };


  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{ backgroundImage: "url('/src/assets/bg-verifix.png')" }}
    >
    <div className="absolute inset-0 bg-black/60"></div>
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-10 h-10 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-50"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                VerifiX
              </h1>
              <p className="text-xs text-cyan-300/60">AI-Powered Verification</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
              onClick={() => navigate('/user-login')}
            >
              User Login
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={() => navigate('/admin-login')}
            >
              <Lock className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 backdrop-blur-sm">
            <span className="text-cyan-400 text-sm font-semibold">Trusted by 10,000+ Organizations 🇮🇳</span>
          </div>
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              Secure KYC Verification
            </span>
            <br />
            <span className="text-5xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Instantly verify Aadhaar, PAN and Driving License documents with advanced fraud detection.
            Protect your business with real-time AI-powered authentication.
          </p>
          <div className="flex justify-center gap-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-6"
              onClick={() => navigate('/user-login')}
            >
              <Scan className="w-5 h-5 mr-2" />
              Start Verification
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">99.8% Accuracy</CardTitle>
              <CardDescription className="text-slate-400">
                Industry-leading AI models trained on millions of Indian documents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Real-Time Processing</CardTitle>
              <CardDescription className="text-slate-400">
                Get verification results in under 3 seconds with instant fraud alerts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Advanced Fraud Detection</CardTitle>
              <CardDescription className="text-slate-400">
                Detect tampering, fake documents and suspicious patterns automatically
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              Supports All Indian Documents
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-cyan-400/30 flex items-center justify-center">
  <img src="/src/assets/aadhaar.png" alt="Aadhaar" className="w-full h-full object-cover" />
</div>

                <div>
                  <h4 className="font-semibold text-lg">Aadhaar Card</h4>
                  <p className="text-sm text-slate-400">12-digit UIDAI verification with biometric validation</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-cyan-400/30 flex items-center justify-center">
  <img src="/src/assets/pan.png" alt="PAN" className="w-full h-full object-cover" />
</div>

                <div>
                  <h4 className="font-semibold text-lg">PAN Card</h4>
                  <p className="text-sm text-slate-400">Income Tax Department verification with AI-powered OCR</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-900/50 border border-cyan-400/20 backdrop-blur-sm">
               <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-cyan-400/30 flex items-center justify-center">
  <img src="/src/assets/dl.png" alt="Driving Licence" className="w-full h-full object-cover" />
</div>

                <div>
                  <h4 className="font-semibold text-lg">Driving License</h4>
                  <p className="text-sm text-slate-400">State RTO verification with expiry validation</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative translate-y-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-3xl opacity-20"></div>
            <Card className="relative bg-slate-900/80 border-cyan-400/30 backdrop-blur-xl p-6">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Verification Speed</span>
                  <span className="text-cyan-400 font-bold">2.8s avg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Verifications</span>
                  <span className="text-cyan-400 font-bold">1.2M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fraud Blocked</span>
                  <span className="text-red-400 font-bold">50K+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Accuracy Rate</span>
                  <span className="text-green-400 font-bold">99.8%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center py-20 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-3xl border border-cyan-400/20 backdrop-blur-sm">
          <h3 className="text-4xl font-bold mb-6">Ready to Secure Your Platform?</h3>
          <p className="text-xl text-slate-300 mb-8">Join thousands of organizations using VerifiX</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-10 py-6"
            onClick={() => navigate('/user-login')}
          >
            Get Started Free
          </Button>
        </div>
      </main>

      <footer className="relative z-10 border-t border-cyan-400/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <p className="text-slate-400">© 2025 VerifiX By Kris Mehra. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    {/* ================== SEVA AGENT CHAT ================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat window */}
        {openChat && (
          <div className="w-80 h-96 bg-slate-900/95 border border-cyan-400/30 rounded-2xl shadow-xl flex flex-col overflow-hidden mb-4">
            {/* Header */}
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="/src/assets/seva-agent.png"
                  alt="Seva Agent"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-semibold">Seva Agent</span>
              </div>
              <button
                className="text-white font-bold"
                onClick={() => setOpenChat(false)}
              >
                ×
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                >
                  {msg.sender === 'agent' && (
                    <img
                      src="/src/assets/seva-agent.png"
                      alt="Seva Agent"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span
                    className={`px-3 py-2 rounded-2xl max-w-[70%] ${
                      msg.sender === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-white'
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-slate-700 flex">
              <input
                type="text"
                placeholder="Ask Seva Agent..."
                className="flex-1 px-3 py-2 rounded-l-2xl bg-slate-800 text-white outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-cyan-500 hover:bg-cyan-600 px-4 rounded-r-2xl text-white font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Floating Seva Agent Button */}
        <button
  onClick={() => setOpenChat(!openChat)}
  className="flex flex-col items-center gap-1"
>
          <div className="w-16 h-16 rounded-full shadow-lg border-2 border-cyan-400 overflow-hidden hover:scale-105 transition-transform">
           <img
            src="/src/assets/seva-agent.png"
            alt="Seva Agent"
            className="w-full h-full"
          />
  </div>
  {/* Namaste text */}
  <span className="text-xs font-semibold text-cyan-400 tracking-wide">
    Namaste
  </span>
</button>
    
      </div>
    </div>
  );
}

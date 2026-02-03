import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  LogOut,
  User,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedDoc, setSelectedDoc] = useState<'aadhaar' | 'pan' | 'dl' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [fraudScore, setFraudScore] = useState(0);
  const [extracted, setExtracted] = useState<any>(null);

  // ✅ NEW: image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileUpload = async (docType: 'aadhaar' | 'pan' | 'dl') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      // ✅ create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      setSelectedDoc(docType);
      setUploading(true);
      setVerified(false);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', docType);

      try {
        const res = await fetch('http://localhost:5000/verify', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        setFraudScore(data.fraudScore);
        setExtracted(data.extracted);
        setVerified(true);
      } catch (err) {
        console.error('Upload error:', err);
        alert('Error analyzing document.');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const getStatusInfo = () => {
    if (fraudScore < 20) {
      return {
        status: 'Safe',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        icon: CheckCircle,
      };
    } else if (fraudScore < 50) {
      return {
        status: 'Risky',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        icon: AlertTriangle,
      };
    } else {
      return {
        status: 'Fraud Detected',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        icon: XCircle,
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* NAVBAR */}
      <nav className="border-b border-cyan-400/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">VerifiX</h1>
              <p className="text-xs text-slate-400">User Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900/50 border border-cyan-400/20">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">{user?.name}</span>
            </div>

            <Button
              variant="outline"
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            Document Verification
          </h2>
          <p className="text-slate-400">
            Upload your Indian identity documents for instant verification
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT SIDE – UPLOAD */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Upload Document</CardTitle>
                <CardDescription className="text-slate-400">
                  Select and upload your document
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {[
                  { id: 'aadhaar', label: 'Aadhaar Card', img: '/src/assets/aadhaar.png' },
                  { id: 'pan', label: 'PAN Card', img: '/src/assets/pan.png' },
                  { id: 'dl', label: 'Driving License', img: '/src/assets/dl.png' },
                ].map((doc: any) => (
                  <div
                    key={doc.id}
                    onClick={() => handleFileUpload(doc.id)}
                    className="p-6 rounded-xl border-2 border-dashed border-cyan-400/30 hover:border-cyan-400/60 bg-slate-900/30 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <img src={doc.img} className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white">{doc.label}</h3>
                      </div>
                      <Upload className="text-cyan-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {uploading && (
              <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
                <CardContent className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent animate-spin rounded-full mx-auto" />
                  <p className="text-slate-400">Processing document…</p>
                  <Progress value={75} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE – RESULTS */}
          <div className="space-y-6">
            {verified && extracted && (
              <>
                {/* IMAGE PREVIEW */}
                <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">
                      Uploaded Document Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Uploaded Document"
                        className="max-h-80 rounded-xl border border-cyan-400/30 shadow-lg"
                      />
                    )}
                  </CardContent>
                </Card>

                {/* RESULT */}
                <Card className={`bg-slate-900/50 border ${statusInfo.borderColor}`}>
                  <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-white text-2xl">Verification Result</CardTitle>
                    <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {statusInfo.status}
                    </Badge>
                  </CardHeader>

                  <CardContent>
                    <Progress value={fraudScore} />
                    <p className={`mt-2 font-bold ${statusInfo.color}`}>
                      Fraud Score: {fraudScore}/100
                    </p>
                  </CardContent>
                </Card>

                {/* EXTRACTED DATA */}
                <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                      Extracted Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(extracted).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-slate-700/50 py-2"
                      >
                        <span className="text-slate-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          {String(value ?? '')}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Shield, CheckCircle, AlertTriangle, XCircle, LogOut, User, FileText } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileUpload = async (docType: 'aadhaar' | 'pan' | 'dl') => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedDoc(docType);
    setUploading(true);
    setVerified(false);

    const formData = new FormData();
    formData.append("file", file);   // must be "file"
    formData.append("type", docType);

    try {
      const res = await fetch("http://localhost:5000/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("BACKEND RESPONSE:", data);

      setFraudScore(data.fraudScore);
      setExtracted(data.extracted); // <-- fixed
      setVerified(true);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error analyzing document.");
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
      <nav className="relative z-10 border-b border-cyan-400/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
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
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            Document Verification
          </h2>
          <p className="text-slate-400">Upload your Indian identity documents for instant verification</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* UPLOAD SECTION */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Upload Document</CardTitle>
                <CardDescription className="text-slate-400">
                  Select and upload your document for AI-powered verification
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">

                {/* AADHAAR */}
                <div
                  onClick={() => handleFileUpload('aadhaar')}
                  className="p-6 rounded-xl border-2 border-dashed border-cyan-400/30 hover:border-cyan-400/60 bg-slate-900/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <img src="/src/assets/aadhaar.png" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">Aadhaar Card</h3>
                      <p className="text-sm text-slate-400">12-digit UIDAI document</p>
                    </div>
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                {/* PAN */}
                <div
                  onClick={() => handleFileUpload('pan')}
                  className="p-6 rounded-xl border-2 border-dashed border-cyan-400/30 hover:border-cyan-400/60 bg-slate-900/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <img src="/src/assets/pan.png" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">PAN Card</h3>
                      <p className="text-sm text-slate-400">Income Tax document</p>
                    </div>
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                {/* DRIVING LICENSE */}
                <div
                  onClick={() => handleFileUpload('dl')}
                  className="p-6 rounded-xl border-2 border-dashed border-cyan-400/30 hover:border-cyan-400/60 bg-slate-900/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <img src="/src/assets/dl.png" className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">Driving License</h3>
                      <p className="text-sm text-slate-400">State RTO document</p>
                    </div>
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* LOADING */}
            {uploading && (
              <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
                <CardContent className="py-8 text-center space-y-4">
                  <div className="inline-flex w-16 h-16 rounded-full bg-cyan-500/20">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent animate-spin rounded-full m-auto"></div>
                  </div>
                  <h3 className="text-xl text-white font-semibold">Processing Document...</h3>
                  <p className="text-slate-400">AI is analyzing your document for fraud detection</p>
                  <Progress value={75} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* RESULT + EXTRACTED DATA */}
          <div className="space-y-6">

            {/* VERIFICATION RESULT */}
            {verified && extracted && (
              <>
                <Card className={`bg-slate-900/50 border backdrop-blur-xl ${statusInfo.borderColor}`}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white text-2xl">Verification Result</CardTitle>
                      <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusInfo.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
  <div className="flex justify-between mb-2">
    <span className="text-white">Fraud Risk Score</span>
    <span className={`font-bold ${statusInfo.color}`}>{fraudScore}/100</span>
  </div>

  <Progress value={fraudScore} />
</div>


                    {/* Document Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900/50 border border-cyan-400/20 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">Document Type</p>
                        <p className="font-semibold capitalize text-cyan-400">{selectedDoc}</p>
                      </div>
                      <div className="p-4 bg-slate-900/50 border border-cyan-400/20 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">Processing Time</p>
                        <p className="font-semibold text-cyan-400">2.3s</p>
                      </div>
                    </div>

                    {/* Messages */}
                    {fraudScore < 20 && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex space-x-3">
                          <CheckCircle className="text-green-400" />
                          <div>
                            <h4 className="font-semibold text-green-400">Document Verified</h4>
                            <p className="text-sm text-slate-400">
                              Your document has passed all security checks. No fraud indicators detected.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {fraudScore >= 20 && fraudScore < 50 && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex space-x-3">
                          <AlertTriangle className="text-yellow-400" />
                          <div>
                            <h4 className="font-semibold text-yellow-400">Manual Review Required</h4>
                            <p className="text-sm text-slate-400">
                              Some irregularities detected. Please contact support for verification.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {fraudScore >= 50 && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex space-x-3">
                          <XCircle className="text-red-400" />
                          <div>
                            <h4 className="font-semibold text-red-400">Verification Failed</h4>
                            <p className="text-sm text-slate-400">
                              High fraud risk detected. Document tampering or forgery suspected.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* EXTRACTED INFO */}
                <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                      Extracted Information
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {Object.entries(extracted).map(([key, value]) => (
  <div key={key} className="flex justify-between py-2 border-b border-slate-700/50">
    <span className="text-slate-400 capitalize">
      {key.replace(/([A-Z])/g, ' $1')}
    </span>
    <span className="font-semibold text-cyan-400">
      {String(value ?? "")}
    </span>
  </div>
))}

                  </CardContent>
                </Card>
              </>
            )}

            {/* EMPTY STATE */}
            {!verified && !uploading && (
              <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-xl">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-500/10 rounded-full mb-4">
                    <Upload className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Document Selected</h3>
                  <p className="text-slate-400">Upload a document to see verification results</p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

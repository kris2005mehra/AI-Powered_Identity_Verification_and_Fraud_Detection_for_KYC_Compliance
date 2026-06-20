import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  LogOut,
  Search,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Activity,
  ShieldAlert,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/* =====================================================
   TYPES
   ===================================================== */
interface VerificationRecord {
  id: string;
  userName: string;
  userEmail: string;
  docType: string;
  status: string;
  fraudScore: number;
  fraudFlags: string[];
  extracted: Record<string, string>;
  rawText?: string;
  cleanedText?: string;
  date: string;
}

interface FraudAlert {
  id: string;
  user: string;
  docType: string;
  reason: string;
  severity: string;
  fraudScore: number;
  time: string;
}

interface DashboardStats {
  total: number;
  safe: number;
  risky: number;
  fraud: number;
  riskDistribution: { risk: string; count: number }[];
  docTypeDistribution: { name: string; value: number }[];
  fraudAlerts: FraudAlert[];
}

const API_BASE = 'http://localhost:5000';
const POLL_INTERVAL = 5000; // 5 seconds

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time data state
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    safe: 0,
    risky: 0,
    fraud: 0,
    riskDistribution: [],
    docTypeDistribution: [],
    fraudAlerts: [],
  });
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);

  /* =====================================================
     FETCH REAL DATA FROM BACKEND
     ===================================================== */
  const fetchData = useCallback(async () => {
    try {
      const [verRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/verifications`),
        fetch(`${API_BASE}/api/stats`),
      ]);

      const verData = await verRes.json();
      const statsData = await statsRes.json();

      setVerifications(verData.verifications || []);
      setStats(statsData);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLive(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setIsLive(false);
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredLogs = verifications.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* COLORS */
  const BAR_COLORS: Record<string, string> = {
    Safe: '#22c55e',
    Risky: '#eab308',
    Fraud: '#ef4444'
  };

  const PIE_COLORS = ['#39afebff', '#b31ad1ff', 'rgba(252, 186, 31, 0.86)', '#6366f1'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Safe':
        return <Badge className="bg-green-100 text-green-600 border-0">Safe</Badge>;
      case 'Risky':
        return <Badge className="bg-yellow-100 text-yellow-600 border-0">Risky</Badge>;
      case 'Fraud':
        return <Badge className="bg-red-100 text-red-600 border-0">Fraud</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge className="bg-red-100 text-red-600 border-0">Critical</Badge>;
      case 'High':
        return <Badge className="bg-orange-100 text-orange-600 border-0">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-600 border-0">Medium</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const approvalRate = stats.total > 0
    ? ((stats.safe / stats.total) * 100).toFixed(1)
    : '0.0';

  const fraudRate = stats.total > 0
    ? ((stats.fraud / stats.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-slate-800">
      {/* 🔥 INLINE ANIMATIONS */}
      <style>{`
        @keyframes fraudGlow {
          0% { box-shadow: 0 0 8px rgba(255,0,0,0.6); }
          50% { box-shadow: 0 0 18px rgba(255,0,0,1); }
          100% { box-shadow: 0 0 8px rgba(255,0,0,0.6); }
        }
        
        .fraud-glow {
          animation: fraudGlow 1.2s infinite ease-in-out;
          border: 2px solid #ff3b3b !important;
        }

        @keyframes bluePulse {
          0% { box-shadow: 0 0 6px rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 16px rgba(59,130,246,0.8); }
          100% { box-shadow: 0 0 6px rgba(59,130,246,0.4); }
        }
        .blue-glow {
          animation: bluePulse 1.6s infinite ease-in-out;
        }

        @keyframes livePulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .live-dot {
          animation: livePulse 1.5s infinite ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="relative z-10 border-b border-blue-300/40 backdrop-blur-md bg-white/60">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-blue-700">VerifiX Admin</h1>
                <p className="text-xs text-slate-500">Fraud Detection Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Live Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-xs">
                {isLive ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 live-dot" />
                    <Wifi className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 font-medium">LIVE</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <WifiOff className="w-3 h-3 text-red-600" />
                    <span className="text-red-700 font-medium">OFFLINE</span>
                  </>
                )}
              </div>

              {lastUpdated && (
                <span className="text-xs text-slate-400">
                  Updated: {lastUpdated}
                </span>
              )}

              {/* Manual Refresh */}
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={fetchData}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Refresh
              </Button>

              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-blue-200">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                className="border-blue-400 text-blue-600 hover:bg-blue-100"
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
      <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-blue-700">Analytics Dashboard</h2>
          <p className="text-slate-600">
            Real-time fraud detection and verification monitoring
            {stats.total === 0 && !isLoading && (
              <span className="ml-2 text-amber-600 font-medium">
                — No verifications yet. Data will appear when users submit documents.
              </span>
            )}
          </p>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total */}
          <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow fade-in">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Total Verifications</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-700">
                {isLoading ? '—' : stats.total.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-blue-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Real-time tracking
              </div>
            </CardContent>
          </Card>

          {/* Safe */}
          <Card className="bg-white border-2 border-green-500 shadow-green-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow fade-in">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Safe Documents</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-600">
                {isLoading ? '—' : stats.safe.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-slate-600 text-sm">
                <FileCheck className="w-4 h-4 mr-1" />
                {approvalRate}% approval rate
              </div>
            </CardContent>
          </Card>

          {/* Fraud */}
          <Card className="bg-white border-2 border-red-500 shadow-red-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow fade-in">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Fraud Detected</CardDescription>
              <CardTitle className="text-4xl font-bold text-red-600">
                {isLoading ? '—' : stats.fraud.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {fraudRate}% fraud rate
              </div>
            </CardContent>
          </Card>

          {/* Risky */}
          <Card className="bg-white border-2 border-yellow-500 shadow-yellow-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow fade-in">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Pending Review</CardDescription>
              <CardTitle className="text-4xl font-bold text-yellow-600">
                {isLoading ? '—' : stats.risky.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-yellow-600 text-sm">
                <Activity className="w-4 h-4 mr-1" />
                Requires manual check
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* BAR CHART */}
          <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader>
              <CardTitle className="text-blue-700 text-xl">Risk Distribution</CardTitle>
              <CardDescription className="text-slate-600">Verification status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="risk" stroke="#475569" />
                    <YAxis stroke="#475569" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        color: '#000'
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {stats.riskDistribution.map((entry, index) => (
                        <Cell key={index} fill={BAR_COLORS[entry.risk] || '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <p>No data yet — waiting for user verifications</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PIE CHART */}
          <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader>
              <CardTitle className="text-blue-700 text-xl">Document Types</CardTitle>
              <CardDescription className="text-slate-600">Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.docTypeDistribution.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.docTypeDistribution.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {stats.docTypeDistribution.filter(d => d.value > 0).map((_entry, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        color: '#000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <p>No data yet — waiting for user verifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FRAUD ALERTS */}
        <Card className="bg-white border-2 border-red-500 shadow-red-200 shadow-md hover:shadow-xl transition-all rounded-xl mb-8">
          <CardHeader>
            <CardTitle className="text-red-600 text-xl flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Recent Fraud Alerts
            </CardTitle>
            <CardDescription className="text-slate-600">
              Critical fraud detection notifications
            </CardDescription>
          </CardHeader>

          <CardContent>
            {stats.fraudAlerts.length > 0 ? (
              <div className="space-y-4">
                {stats.fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg bg-white fraud-glow transition-all fade-in"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{alert.user}</h4>
                          <p className="text-sm text-slate-500">{alert.id} • {alert.docType}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        {getSeverityBadge(alert.severity)}
                        <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 ml-13">{alert.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No fraud alerts — all submissions are clean so far</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-700 text-xl">Verification Logs</CardTitle>
                <CardDescription className="text-slate-600">
                  {verifications.length > 0
                    ? `${verifications.length} total verification${verifications.length !== 1 ? 's' : ''} — auto-refreshing every 5s`
                    : 'Waiting for user submissions…'
                  }
                </CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-blue-300 text-slate-700 placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredLogs.length > 0 ? (
              <div className="rounded-lg border border-blue-300 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50 border-blue-200">
                      <TableHead className="text-slate-700">ID</TableHead>
                      <TableHead className="text-slate-700">Submitter Account</TableHead>
                      <TableHead className="text-slate-700">Customer Name (Extracted)</TableHead>
                      <TableHead className="text-slate-700">ID Number (Extracted)</TableHead>
                      <TableHead className="text-slate-700">Document</TableHead>
                      <TableHead className="text-slate-700">Status</TableHead>
                      <TableHead className="text-slate-700">Fraud Score</TableHead>
                      <TableHead className="text-slate-700">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredLogs.map((log) => {
                      const extractedName = log.extracted?.name || '—';
                      const extractedId = log.extracted?.pan || log.extracted?.aadhaar || log.extracted?.dl_number || '—';
                      return (
                        <TableRow
                          key={log.id}
                          onClick={() => setSelectedRecord(log)}
                          className="hover:bg-blue-50/80 cursor-pointer border-blue-100 transition-all fade-in"
                        >
                          <TableCell className="font-mono text-blue-600">{log.id}</TableCell>
                          <TableCell className="font-medium">{log.userName}</TableCell>
                          <TableCell className="font-semibold text-blue-900">{extractedName}</TableCell>
                          <TableCell className="font-mono text-slate-600">{extractedId}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-600 border-0">{log.docType}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>
                            <span
                              className={`font-semibold ${
                                log.fraudScore < 20
                                  ? 'text-green-600'
                                  : log.fraudScore < 50
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {log.fraudScore}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600">{log.date}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">No verifications yet</p>
                <p className="text-sm">
                  When users upload documents on the User Dashboard, their results will appear here in real-time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* DETAILED RECORD MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-blue-50">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900">Verification Details: {selectedRecord.id}</h3>
                  <p className="text-xs text-slate-500">Submitted at {selectedRecord.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Score / Status Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-blue-100 bg-slate-50">
                  <span className="text-xs text-slate-500 block mb-1">Status</span>
                  {getStatusBadge(selectedRecord.status)}
                </div>
                <div className="p-4 rounded-xl border border-blue-100 bg-slate-50">
                  <span className="text-xs text-slate-500 block mb-1">Fraud Score</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xl font-bold ${
                      selectedRecord.fraudScore < 20 ? 'text-green-600' : selectedRecord.fraudScore < 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedRecord.fraudScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitter Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2.5 border-b pb-1">Submitter Account</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Account Name:</span>
                    <p className="font-medium text-slate-800">{selectedRecord.userName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Account Email:</span>
                    <p className="font-medium text-slate-800">{selectedRecord.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Real Extracted Customer Details */}
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-2.5 border-b pb-1">Real Extracted Customer Details</h4>
                {selectedRecord.extracted && Object.keys(selectedRecord.extracted).length > 0 ? (
                  <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 space-y-3">
                    {Object.entries(selectedRecord.extracted).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-sm py-1 border-b border-blue-100/50 last:border-0">
                        <span className="text-slate-600 capitalize font-medium">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-blue-900 font-semibold">{val || '—'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No details extracted.</p>
                )}
              </div>

              {/* Fraud Flags */}
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-2 border-b pb-1">Fraud Verification Flags</h4>
                {selectedRecord.fraudFlags && selectedRecord.fraudFlags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedRecord.fraudFlags.map((flag, idx) => (
                      <Badge key={idx} className="bg-red-100 text-red-700 border-red-200">
                        {flag.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 flex items-center">
                    <FileCheck className="w-4 h-4 mr-1.5" /> No fraud flags detected.
                  </p>
                )}
              </div>

              {/* Raw Extracted Text */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-1">Raw OCR Output</h4>
                <pre className="p-3 bg-slate-900 text-slate-300 rounded-lg text-xs font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {selectedRecord.cleanedText || selectedRecord.rawText || '—'}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <Button onClick={() => setSelectedRecord(null)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

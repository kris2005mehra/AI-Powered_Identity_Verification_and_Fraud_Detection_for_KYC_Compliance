import { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  verificationLogs,
  fraudAlerts,
  riskDistribution,
  docTypeDistribution
} from '@/data/mockData';
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredLogs = verificationLogs.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* UPDATED COLORS */
  const BAR_COLORS = {
    Safe: '#22c55e',
    Risky: '#eab308',
    Fraud: '#ef4444'
  };

  const PIE_COLORS = ['#39afebff', '#b31ad1ff', 'rgba(252, 186, 31, 0.86)'];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-slate-800">
      {/* 🔥 INLINE ANIMATIONS — NO CSS FILE NEEDED */}
      <style>{`
        /* Red Shake + Glow for Fraud Cards */
        @keyframes fraudGlow {
          0% { box-shadow: 0 0 8px rgba(255,0,0,0.6); }
          50% { box-shadow: 0 0 18px rgba(255,0,0,1); }
          100% { box-shadow: 0 0 8px rgba(255,0,0,0.6); }
        }
        
        .fraud-glow {
          animation: fraudGlow 1.2s infinite ease-in-out,
                     fraudShake 0.18s infinite linear;
          border: 2px solid #ff3b3b !important;
        }

        /* Blue Glow for Charts + Table */
        @keyframes bluePulse {
          0% { box-shadow: 0 0 6px rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 16px rgba(59,130,246,0.8); }
          100% { box-shadow: 0 0 6px rgba(59,130,246,0.4); }
        }
        .blue-glow {
          animation: bluePulse 1.6s infinite ease-in-out;
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
          <p className="text-slate-600">Real-time fraud detection and verification monitoring</p>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Blue */}
          <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Total Verifications</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-700">1,247</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% from last week
              </div>
            </CardContent>
          </Card>

          {/* Green */}
          <Card className="bg-white border-2 border-green-500 shadow-green-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Safe Documents</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-600">1,089</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-slate-600 text-sm">
                <FileCheck className="w-4 h-4 mr-1" />
                87.3% approval rate
              </div>
            </CardContent>
          </Card>

          {/* Red */}
          <Card className="bg-white border-2 border-red-500 shadow-red-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Fraud Detected</CardDescription>
              <CardTitle className="text-4xl font-bold text-red-600">98</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                7.9% fraud rate
              </div>
            </CardContent>
          </Card>

          {/* Yellow */}
          <Card className="bg-white border-2 border-yellow-500 shadow-yellow-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-600">Pending Review</CardDescription>
              <CardTitle className="text-4xl font-bold text-yellow-600">60</CardTitle>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="risk" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#000'
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {riskDistribution.map((entry, index) => (
                      <Cell key={index} fill={BAR_COLORS[entry.risk as keyof typeof BAR_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* PIE CHART */}
          <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
            <CardHeader>
              <CardTitle className="text-blue-700 text-xl">Document Types</CardTitle>
              <CardDescription className="text-slate-600">Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={docTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {docTypeDistribution.map((_entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
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
            <div className="space-y-4">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg bg-white fraud-glow transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{alert.user}</h4>
                        <p className="text-sm text-slate-500">{alert.id}</p>
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
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="bg-white border-2 border-blue-500 shadow-blue-200 shadow-md hover:shadow-xl transition-all rounded-xl blue-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-700 text-xl">Verification Logs</CardTitle>
                <CardDescription className="text-slate-600">
                  Last 10 verification attempts
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
            <div className="rounded-lg border border-blue-300 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 border-blue-200">
                    <TableHead className="text-slate-700">ID</TableHead>
                    <TableHead className="text-slate-700">User Name</TableHead>
                    <TableHead className="text-slate-700">Document</TableHead>
                    <TableHead className="text-slate-700">Status</TableHead>
                    <TableHead className="text-slate-700">Fraud Score</TableHead>
                    <TableHead className="text-slate-700">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-blue-50 border-blue-100 transition-all"
                    >
                      <TableCell className="font-mono text-blue-600">{log.id}</TableCell>
                      <TableCell className="font-medium">{log.userName}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

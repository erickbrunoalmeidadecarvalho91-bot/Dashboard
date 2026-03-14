import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Package, 
  TrendingUp, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { 
  ShopeeData, 
  ConnectionStatus, 
  ShopeeCredentials,
  ShopeeMetrics,
  Product
} from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'analytics', label: 'Análise', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
  ];

  return (
    <div className="w-64 bg-black border-r border-purple-900/30 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-purple-900/30">
        <h1 className="text-xl font-bold text-white tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          SHOPEE <span className="text-purple-500">AFILIADO</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.1)]" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-1">Shopee Affiliate Analytics Platform</p>
          <p className="text-[10px] text-zinc-600">v1.0.0 Stable</p>
        </div>
      </div>
    </div>
  );
};

const Header = ({ status }: { status: ConnectionStatus }) => {
  const statusConfig = {
    'DISCONNECTED': { color: 'bg-red-500', text: 'DESCONECTADO', icon: XCircle, shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
    'CONNECTION ERROR': { color: 'bg-orange-500', text: 'ERRO DE CONEXÃO', icon: AlertCircle, shadow: 'shadow-[0_0_10px_rgba(249,115,22,0.5)]' },
    'CONNECTED': { color: 'bg-green-500', text: 'CONECTADO', icon: CheckCircle2, shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]' },
  };

  const currentStatus = statusConfig[status];

  return (
    <header className="h-20 border-b border-purple-900/30 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-2xl font-bold text-white">SHOPEE AFILIADO <span className="text-zinc-500 font-medium text-lg ml-2">Dashboard</span></h2>
        <p className="text-xs text-zinc-500">Shopee Affiliate Analytics Platform</p>
      </div>

      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-zinc-900/50",
          status === 'CONNECTED' ? "border-green-500/20" : status === 'CONNECTION ERROR' ? "border-orange-500/20" : "border-red-500/20"
        )}>
          <div className={cn("w-2 h-2 rounded-full animate-pulse", currentStatus.color, currentStatus.shadow)} />
          <span className={cn("text-[10px] font-bold tracking-widest", status === 'CONNECTED' ? "text-green-400" : status === 'CONNECTION ERROR' ? "text-orange-400" : "text-red-400")}>
            {currentStatus.text}
          </span>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
          <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
        </div>
      </div>
    </header>
  );
};

const StatsCard = ({ title, value, subValue, icon: Icon, trend, prefix = "" }: { 
  title: string, 
  value: string | number, 
  subValue?: string, 
  icon: any, 
  trend?: string,
  prefix?: string
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-purple-600/10 transition-all" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-purple-500/50 transition-all">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-lg",
            trend.startsWith('+') ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {trend}
          </span>
        )}
      </div>
      
      <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{prefix}{value}</span>
        {subValue && <span className="text-xs text-zinc-500">{subValue}</span>}
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-purple-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-zinc-400 text-xs mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('Vendas') ? 'R$ ' : ''}{entry.value.toLocaleString('pt-BR')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartsSection = ({ data }: { data: ShopeeData['charts'] }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const chartData = data[timeframe];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Desempenho de Vendas</h3>
          <div className="flex bg-zinc-800 p-1 rounded-lg border border-zinc-700">
            {(['daily', 'weekly', 'monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                  timeframe === t ? "bg-purple-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {t === 'daily' ? 'DIA' : t === 'weekly' ? 'SEM' : 'MÊS'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                name="Vendas"
                stroke="#a855f7" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Crescimento de Comissões</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="commission" 
                name="Comissão"
                fill="#a855f7" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ProductAnalytics = ({ products }: { products: Product[] }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Top Produtos</h3>
        <button className="text-xs text-purple-400 font-bold hover:text-purple-300 transition-colors flex items-center gap-1">
          Ver todos <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Unidades</th>
              <th className="px-6 py-4">Receita</th>
              <th className="px-6 py-4">Comissão</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/${product.id}/100/100`} alt={product.name} referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{product.sold}</td>
                <td className="px-6 py-4 text-sm text-zinc-400 font-mono">R$ {product.revenue.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-purple-400 font-mono">R$ {product.commission.toLocaleString('pt-BR')}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                    Em Alta
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Settings = ({ credentials, onSave }: { credentials: ShopeeCredentials, onSave: (creds: ShopeeCredentials) => void }) => {
  const [appId, setAppId] = useState(credentials.appId);
  const [appSecret, setAppSecret] = useState(credentials.appSecret);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave({ appId, appSecret });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
            <SettingsIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Configurações da API</h3>
            <p className="text-sm text-zinc-500">Conecte sua conta Shopee Afiliado</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Shopee App ID</label>
            <input 
              type="text" 
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Insira seu App ID"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Shopee App Secret</label>
            <input 
              type="password" 
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              placeholder="Insira seu App Secret"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Save and Connect
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-purple-600/5 border border-purple-500/10 rounded-2xl">
          <h4 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Como obter as credenciais?
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Acesse o portal do <a href="#" className="text-purple-400 hover:underline">Shopee Open Platform</a>, crie uma aplicação do tipo "Affiliate Service" e copie o App ID e App Secret gerados.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [credentials, setCredentials] = useState<ShopeeCredentials>(() => {
    const saved = localStorage.getItem('shopee_creds');
    return saved ? JSON.parse(saved) : { appId: '', appSecret: '' };
  });
  const [data, setData] = useState<ShopeeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-connect and check status
  useEffect(() => {
    if (credentials.appId && credentials.appSecret) {
      checkConnection();
      fetchData();
      
      // Auto-check every 30 seconds
      const interval = setInterval(() => {
        checkConnection();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      setStatus('DISCONNECTED');
      setData(null);
    }
  }, [credentials]);

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/shopee/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (res.ok) {
        setStatus('CONNECTED');
      } else {
        setStatus('CONNECTION ERROR');
      }
    } catch (error) {
      setStatus('CONNECTION ERROR');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/shopee/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCredentials = (creds: ShopeeCredentials) => {
    setCredentials(creds);
    localStorage.setItem('shopee_creds', JSON.stringify(creds));
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-300 font-sans selection:bg-purple-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header status={status} />
        
        <main className="p-8 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {status === 'DISCONNECTED' ? (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl">
                      <AlertCircle className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Conecte sua conta</h3>
                    <p className="text-zinc-500 max-w-md mb-8">Para visualizar seus dados de afiliado, você precisa configurar suas credenciais da Shopee API.</p>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                    >
                      Configurar Agora
                    </button>
                  </div>
                ) : isLoading && !data ? (
                  <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin" />
                  </div>
                ) : data ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <StatsCard 
                        title="Produtos Vendidos" 
                        value={data.metrics.totalProductsSold} 
                        icon={Package} 
                        trend="+12%" 
                      />
                      <StatsCard 
                        title="Valor Total de Vendas" 
                        value={data.metrics.totalSalesValue.toLocaleString('pt-BR')} 
                        prefix="R$ "
                        icon={TrendingUp} 
                        trend="+8.4%" 
                      />
                      <StatsCard 
                        title="Comissão Recebida" 
                        value={data.metrics.commissionReceived.toLocaleString('pt-BR')} 
                        prefix="R$ "
                        icon={DollarSign} 
                        trend="+15.2%" 
                      />
                      <StatsCard 
                        title="Comissão Pendente" 
                        value={data.metrics.commissionPending.toLocaleString('pt-BR')} 
                        prefix="R$ "
                        icon={AlertCircle} 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <StatsCard 
                        title="Comissão Total" 
                        value={data.metrics.commissionOverall.toLocaleString('pt-BR')} 
                        prefix="R$ "
                        icon={DollarSign} 
                        subValue="Geral"
                      />
                      <StatsCard 
                        title="Ticket Médio" 
                        value={data.metrics.avgOrderValue.toLocaleString('pt-BR')} 
                        prefix="R$ "
                        icon={TrendingUp} 
                        subValue="Por pedido"
                      />
                      <StatsCard 
                        title="Taxa de Comissão" 
                        value={data.metrics.commissionPercentage} 
                        prefix=""
                        subValue="%"
                        icon={BarChart3} 
                      />
                    </div>

                    <ChartsSection data={data.charts} />
                    <ProductAnalytics products={data.topProducts} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
                    <h3 className="text-xl font-bold text-white">Erro ao carregar dados</h3>
                    <p className="text-zinc-500">Verifique suas credenciais nas configurações.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <Settings credentials={credentials} onSave={handleSaveCredentials} />
            )}

            {activeTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {data ? <ProductAnalytics products={data.topProducts} /> : <div className="text-center py-20 text-zinc-500">Conecte sua conta para ver os produtos.</div>}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {data ? <ChartsSection data={data.charts} /> : <div className="text-center py-20 text-zinc-500">Conecte sua conta para ver as análises.</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

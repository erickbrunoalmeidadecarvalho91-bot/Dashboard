export interface ShopeeMetrics {
  totalProductsSold: number;
  totalSalesValue: number;
  commissionReceived: number;
  commissionPending: number;
  commissionOverall: number;
  commissionPercentage: number;
  avgOrderValue: number;
  avgCommissionPerOrder: number;
}

export interface ChartData {
  name: string;
  sales: number;
  commission: number;
}

export interface Product {
  id: number;
  name: string;
  sold: number;
  revenue: number;
  commission: number;
}

export interface ShopeeData {
  metrics: ShopeeMetrics;
  charts: {
    daily: ChartData[];
    weekly: ChartData[];
    monthly: ChartData[];
  };
  topProducts: Product[];
}

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTION ERROR' | 'CONNECTED';

export interface ShopeeCredentials {
  appId: string;
  appSecret: string;
}

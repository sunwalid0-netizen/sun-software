'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  Package, 
  Calendar,
  ShoppingBag
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  items: {
    product: {
      name: string;
      category: {
        name: string;
        color: string;
      };
    };
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

interface ProductStats {
  name: string;
  quantity: number;
  revenue: number;
}

interface CategoryStats {
  name: string;
  value: number;
  color: string;
}

interface DailySales {
  date: string;
  sales: number;
  invoices: number;
}

export function ReportsDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // حساب إحصائيات اليوم
  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayInvoices = invoices.filter(inv => 
      new Date(inv.createdAt) >= today
    );

    return {
      totalSales: todayInvoices.reduce((sum, inv) => sum + inv.total, 0),
      invoiceCount: todayInvoices.length,
      averageOrder: todayInvoices.length > 0 
        ? todayInvoices.reduce((sum, inv) => sum + inv.total, 0) / todayInvoices.length 
        : 0
    };
  };

  // المنتجات الأكثر مبيعاً
  const getTopProducts = (): ProductStats[] => {
    const productMap = new Map<string, { quantity: number; revenue: number }>();

    invoices.forEach(inv => {
      inv.items.forEach(item => {
        const current = productMap.get(item.product.name) || { quantity: 0, revenue: 0 };
        productMap.set(item.product.name, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + item.totalPrice
        });
      });
    });

    return Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  // إحصائيات التصنيفات
  const getCategoryStats = (): CategoryStats[] => {
    const categoryMap = new Map<string, { value: number; color: string }>();

    invoices.forEach(inv => {
      inv.items.forEach(item => {
        const catName = item.product.category?.name || 'أخرى';
        const catColor = item.product.category?.color || '#888888';
        const current = categoryMap.get(catName) || { value: 0, color: catColor };
        categoryMap.set(catName, {
          value: current.value + item.totalPrice,
          color: catColor
        });
      });
    });

    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.value - a.value);
  };

  // مبيعات الأيام
  const getDailySales = (): DailySales[] => {
    const dayMap = new Map<string, { sales: number; invoices: number }>();

    invoices.forEach(inv => {
      const date = new Date(inv.createdAt).toLocaleDateString('ar-SA');
      const current = dayMap.get(date) || { sales: 0, invoices: 0 };
      dayMap.set(date, {
        sales: current.sales + inv.total,
        invoices: current.invoices + 1
      });
    });

    return Array.from(dayMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .slice(-7);
  };

  const todayStats = getTodayStats();
  const topProducts = getTopProducts();
  const categoryStats = getCategoryStats();
  const dailySales = getDailySales();

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مبيعات اليوم
            </CardTitle>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {todayStats.totalSales.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              إجمالي المبيعات
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عدد الفواتير
            </CardTitle>
            <Receipt className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {todayStats.invoiceCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              فاتورة اليوم
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط الطلب
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todayStats.averageOrder.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              لكل فاتورة
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المبيعات
            </CardTitle>
            <ShoppingBag className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              جميع الأوقات
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              مبيعات الأيام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} ج.م`, 'المبيعات']}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              توزيع المبيعات حسب التصنيف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)} ج.م`, 'المبيعات']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            المنتجات الأكثر مبيعاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'quantity' ? value : `${value.toFixed(2)} ج.م`,
                  name === 'quantity' ? 'الكمية' : 'الإيرادات'
                ]}
              />
              <Bar dataKey="quantity" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            آخر الفواتير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {invoices.slice(0, 10).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{invoice.invoiceNumber}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleString('ar-SA')}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-primary">
                      {invoice.total.toFixed(2)} ج.م
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {invoice.items.length} منتج
                    </span>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد فواتير بعد
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

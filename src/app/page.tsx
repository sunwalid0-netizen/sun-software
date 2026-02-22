'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Store, 
  AlertTriangle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { ProductCard } from '@/components/pos/product-card';
import { CartSidebar } from '@/components/pos/cart-sidebar';
import { CategoryTabs } from '@/components/pos/category-tabs';
import { SearchBar } from '@/components/pos/barcode-scanner';
import { InvoiceModal } from '@/components/pos/invoice-modal';
import { ProductsManagement } from '@/components/pos/products-management';
import { ReportsDashboard } from '@/components/pos/reports-dashboard';
import { useCartStore } from '@/store/pos-store';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  barcode: string | null;
  categoryId: string;
  stock: number;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  _count?: {
    products: number;
  };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  items: {
    id: string;
    productId: string;
    product: { name: string };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentTab, setCurrentTab] = useState('pos');
  
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCartStore();

  // جلب البيانات
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // جلب التصنيفات
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
      
      // جلب المنتجات
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      setProducts(productsData);
      
      // إذا لم تكن هناك بيانات، قم بإنشائها
      if (categoriesData.length === 0 || productsData.length === 0) {
        await fetch('/api/seed', { method: 'POST' });
        // إعادة جلب البيانات
        const [newCategories, newProducts] = await Promise.all([
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/products').then(r => r.json())
        ]);
        setCategories(newCategories);
        setProducts(newProducts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // البحث
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // تصفية المنتجات
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  // إتمام البيع
  const handleCompleteSale = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity
          })),
          subtotal: getSubtotal(),
          tax: getTax(),
          total: getTotal()
        })
      });

      if (response.ok) {
        const invoice = await response.json();
        setCurrentInvoice(invoice);
        setShowInvoice(true);
        clearCart();
        // تحديث المنتجات لتحديث المخزون
        fetchData();
      }
    } catch (error) {
      console.error('Error completing sale:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // المنتجات منخفضة المخزون
  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/alam-sesame-logo.png"
                  alt="عالم سمسم"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">عالم سمسم</h1>
                <p className="text-xs text-muted-foreground">نظام الكاشير</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {lowStockProducts.length} منتج منخفض
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Store className="w-3 h-3" />
                السوبر ماركت
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs */}
      <div className="container mx-auto p-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pos" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              شاشة البيع
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              التقارير
            </TabsTrigger>
          </TabsList>

          {/* POS Tab */}
          <TabsContent value="pos" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Products Section */}
              <div className="lg:col-span-3 space-y-4">
                {/* Search */}
                <SearchBar onSearch={handleSearch} />

                {/* Categories */}
                <CategoryTabs
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                {/* Products Grid */}
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 p-1">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                      {filteredProducts.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground">
                          <Package className="w-16 h-16 mb-4 opacity-20" />
                          <p>لا توجد منتجات</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1 h-[calc(100vh-140px)]">
                <CartSidebar 
                  onCompleteSale={handleCompleteSale} 
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-0">
            <ProductsManagement />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-0">
            <ReportsDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        invoice={currentInvoice}
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
}

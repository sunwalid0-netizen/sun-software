'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  barcode: string | null;
  categoryId: string;
  stock: number;
  isActive: boolean;
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
}

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    barcode: '',
    categoryId: '',
    stock: '',
    image: ''
  });

  // جلب البيانات
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // فتح نافذة الإضافة
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', barcode: '', categoryId: '', stock: '', image: '' });
    setShowDialog(true);
  };

  // فتح نافذة التعديل
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      barcode: product.barcode || '',
      categoryId: product.categoryId,
      stock: product.stock.toString(),
      image: product.image || ''
    });
    setShowDialog(true);
  };

  // حفظ المنتج
  const handleSaveProduct = async () => {
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowDialog(false);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // حذف المنتج
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // تصفية المنتجات
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.barcode && p.barcode.includes(searchQuery))
  );

  // المنتجات منخفضة المخزون
  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المنتجات..."
              className="pr-9 w-64"
            />
          </div>
          {lowStockProducts.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {lowStockProducts.length} منتج منخفض المخزون
            </Badge>
          )}
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Package className="w-8 h-8 animate-pulse text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>المخزون</TableHead>
                    <TableHead>الباركود</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          style={{ backgroundColor: product.category.color }}
                          className="text-white"
                        >
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.price.toFixed(2)} ج.م
                      </TableCell>
                      <TableCell>
                        <span className={product.stock <= 5 ? 'text-destructive font-medium' : ''}>
                          {product.stock}
                          {product.stock <= 5 && (
                            <AlertTriangle className="inline w-4 h-4 mr-1" />
                          )}
                        </span>
                      </TableCell>
                      <TableCell dir="ltr" className="text-right">
                        {product.barcode || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                        لا توجد منتجات
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">اسم المنتج *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">السعر *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">المخزون</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">التصنيف *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="barcode">الباركود</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="اختياري"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="image">رابط الصورة</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="اختياري"
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

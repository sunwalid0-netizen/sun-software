'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, CreditCard, X, Receipt } from 'lucide-react';
import { useCartStore } from '@/store/pos-store';
import { CartItemRow } from './cart-item';
import { useState } from 'react';

interface CartSidebarProps {
  onCompleteSale: () => void;
  isProcessing: boolean;
}

export function CartSidebar({ onCompleteSale, isProcessing }: CartSidebarProps) {
  const { items, clearCart, getSubtotal, getTax, getTotal } = useCartStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearCart = () => {
    if (showConfirm) {
      clearCart();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" />
            سلة المشتريات
          </CardTitle>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                size="sm"
                variant={showConfirm ? "destructive" : "ghost"}
                onClick={handleClearCart}
                className="h-8"
              >
                {showConfirm ? 'تأكيد؟' : 'إلغاء'}
                <X className="w-4 h-4 mr-1" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {items.length} منتج في السلة
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-center">السلة فارغة</p>
            <p className="text-xs text-center mt-1">
              اختر منتجات لإضافتها للسلة
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="border-t p-4 space-y-4 bg-muted/30">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الإجمالي الفرعي:</span>
            <span>{subtotal.toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الضريبة (14%):</span>
            <span>{tax.toFixed(2)} ج.م</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>الإجمالي:</span>
            <span className="text-primary">{total.toFixed(2)} ج.م</span>
          </div>
        </div>
        
        <div className="w-full space-y-2">
          <Button
            className="w-full h-12 text-lg"
            size="lg"
            onClick={onCompleteSale}
            disabled={items.length === 0 || isProcessing}
          >
            <CreditCard className="w-5 h-5 ml-2" />
            {isProcessing ? 'جاري المعالجة...' : 'إتمام البيع'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

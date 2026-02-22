'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { useCartStore } from '@/store/pos-store';
import Image from 'next/image';

interface CartItemRowProps {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
    categoryName?: string;
  };
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-6 h-6 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground">{item.price.toFixed(2)} ج.م</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => handleQuantityChange(item.quantity - 1)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
          className="w-12 h-7 text-center text-sm p-0"
          min="1"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <div className="text-left min-w-[60px]">
        <p className="font-semibold text-sm">
          {(item.price * item.quantity).toFixed(2)} ج.م
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={() => removeItem(item.productId)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

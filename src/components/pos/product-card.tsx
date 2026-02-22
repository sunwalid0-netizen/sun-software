'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/pos-store';
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      categoryName: product.category.name,
    };
    addItem(cartItem);
  };

  const isLowStock = product.stock <= 5;

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-primary/20">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          <div 
            className="absolute top-2 right-2"
            style={{ backgroundColor: product.category.color }}
          >
            <Badge variant="secondary" className="text-white text-xs">
              {product.category.name}
            </Badge>
          </div>
          {isLowStock && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="text-xs">
                مخزون منخفض
              </Badge>
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {product.price.toFixed(2)} ج.م
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            المخزون: {product.stock} قطعة
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

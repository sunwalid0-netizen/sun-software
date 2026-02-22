'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Grid2X2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
  _count?: {
    products: number;
  };
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-1">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => onSelectCategory('all')}
          className="flex-shrink-0"
          style={{
            backgroundColor: selectedCategory === 'all' ? 'hsl(var(--primary))' : undefined
          }}
        >
          <Grid2X2 className="w-4 h-4 ml-2" />
          الكل
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => onSelectCategory(category.id)}
            className="flex-shrink-0"
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : undefined,
              borderColor: category.color,
              color: selectedCategory === category.id ? 'white' : undefined
            }}
          >
            {category.name}
            {category._count && (
              <span className="mr-2 text-xs opacity-70">
                ({category._count.products})
              </span>
            )}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

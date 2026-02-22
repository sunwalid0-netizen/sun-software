import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - إنشاء البيانات الافتراضية
export async function POST() {
  try {
    // إنشاء التصنيفات
    const categories = await Promise.all([
      db.category.upsert({
        where: { id: 'cat-fruits' },
        update: {},
        create: { id: 'cat-fruits', name: 'فواكه', color: '#ef4444' }
      }),
      db.category.upsert({
        where: { id: 'cat-vegetables' },
        update: {},
        create: { id: 'cat-vegetables', name: 'خضروات', color: '#22c55e' }
      }),
      db.category.upsert({
        where: { id: 'cat-dairy' },
        update: {},
        create: { id: 'cat-dairy', name: 'ألبان', color: '#3b82f6' }
      }),
      db.category.upsert({
        where: { id: 'cat-drinks' },
        update: {},
        create: { id: 'cat-drinks', name: 'مشروبات', color: '#f59e0b' }
      }),
      db.category.upsert({
        where: { id: 'cat-legumes' },
        update: {},
        create: { id: 'cat-legumes', name: 'بقوليات', color: '#8b5cf6' }
      }),
      db.category.upsert({
        where: { id: 'cat-snacks' },
        update: {},
        create: { id: 'cat-snacks', name: 'سناكس', color: '#ec4899' }
      })
    ]);

    // إنشاء المنتجات
    const products = [
      // فواكه
      { id: 'prod-apple', name: 'تفاح أحمر', price: 8.50, barcode: '1001', categoryId: 'cat-fruits', stock: 50 },
      { id: 'prod-banana', name: 'موز', price: 6.00, barcode: '1002', categoryId: 'cat-fruits', stock: 40 },
      { id: 'prod-orange', name: 'برتقال', price: 5.50, barcode: '1003', categoryId: 'cat-fruits', stock: 60 },
      { id: 'prod-grapes', name: 'عنب', price: 12.00, barcode: '1004', categoryId: 'cat-fruits', stock: 30 },
      { id: 'prod-strawberry', name: 'فراولة', price: 18.00, barcode: '1005', categoryId: 'cat-fruits', stock: 20 },
      
      // خضروات
      { id: 'prod-tomato', name: 'طماطم', price: 4.00, barcode: '2001', categoryId: 'cat-vegetables', stock: 80 },
      { id: 'prod-cucumber', name: 'خيار', price: 3.50, barcode: '2002', categoryId: 'cat-vegetables', stock: 70 },
      { id: 'prod-potato', name: 'بطاطس', price: 3.00, barcode: '2003', categoryId: 'cat-vegetables', stock: 100 },
      { id: 'prod-onion', name: 'بصل', price: 2.50, barcode: '2004', categoryId: 'cat-vegetables', stock: 90 },
      { id: 'prod-carrot', name: 'جزر', price: 4.00, barcode: '2005', categoryId: 'cat-vegetables', stock: 60 },
      
      // ألبان
      { id: 'prod-milk', name: 'حليب طازج', price: 7.50, barcode: '3001', categoryId: 'cat-dairy', stock: 45 },
      { id: 'prod-cheese', name: 'جبنة بيضاء', price: 15.00, barcode: '3002', categoryId: 'cat-dairy', stock: 25 },
      { id: 'prod-yogurt', name: 'زبادي', price: 4.00, barcode: '3003', categoryId: 'cat-dairy', stock: 55 },
      { id: 'prod-butter', name: 'زبدة', price: 22.00, barcode: '3004', categoryId: 'cat-dairy', stock: 20 },
      
      // مشروبات
      { id: 'prod-juice', name: 'عصير برتقال', price: 9.00, barcode: '4001', categoryId: 'cat-drinks', stock: 35 },
      { id: 'prod-water', name: 'مياه معدنية', price: 2.00, barcode: '4002', categoryId: 'cat-drinks', stock: 100 },
      { id: 'prod-cola', name: 'مشروب غازي', price: 5.00, barcode: '4003', categoryId: 'cat-drinks', stock: 60 },
      { id: 'prod-tea', name: 'شاي', price: 12.00, barcode: '4004', categoryId: 'cat-drinks', stock: 30 },
      
      // بقوليات
      { id: 'prod-rice', name: 'أرز', price: 8.00, barcode: '5001', categoryId: 'cat-legumes', stock: 50 },
      { id: 'prod-beans', name: 'فول', price: 6.50, barcode: '5002', categoryId: 'cat-legumes', stock: 40 },
      { id: 'prod-lentils', name: 'عدس', price: 7.00, barcode: '5003', categoryId: 'cat-legumes', stock: 45 },
      { id: 'prod-chickpeas', name: 'حمص', price: 8.00, barcode: '5004', categoryId: 'cat-legumes', stock: 35 },
      
      // سناكس
      { id: 'prod-chips', name: 'شيبس', price: 6.00, barcode: '6001', categoryId: 'cat-snacks', stock: 80 },
      { id: 'prod-chocolate', name: 'شوكولاتة', price: 8.50, barcode: '6002', categoryId: 'cat-snacks', stock: 50 },
      { id: 'prod-biscuits', name: 'بسكويت', price: 5.00, barcode: '6003', categoryId: 'cat-snacks', stock: 60 },
      { id: 'prod-nuts', name: 'مكسرات', price: 25.00, barcode: '6004', categoryId: 'cat-snacks', stock: 20 }
    ];

    for (const product of products) {
      await db.product.upsert({
        where: { id: product.id },
        update: product,
        create: product as any
      });
    }

    return NextResponse.json({ 
      message: 'تم إنشاء البيانات الافتراضية بنجاح',
      categories: categories.length,
      products: products.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'فشل في إنشاء البيانات الافتراضية' }, { status: 500 });
  }
}

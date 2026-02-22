import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - جلب جميع المنتجات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock');

    const where: any = { isActive: true };

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { barcode: { contains: search } }
      ];
    }

    if (lowStock === 'true') {
      where.stock = { lte: 5 };
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'فشل في جلب المنتجات' }, { status: 500 });
  }
}

// POST - إضافة منتج جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, image, barcode, categoryId, stock } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'الاسم والسعر والتصنيف مطلوبون' }, { status: 400 });
    }

    // التحقق من عدم وجود باركود مكرر
    if (barcode) {
      const existingProduct = await db.product.findUnique({
        where: { barcode }
      });
      if (existingProduct) {
        return NextResponse.json({ error: 'الباركود موجود مسبقاً' }, { status: 400 });
      }
    }

    const product = await db.product.create({
      data: {
        name,
        price: parseFloat(price),
        image: image || null,
        barcode: barcode || null,
        categoryId,
        stock: parseInt(stock) || 0
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'فشل في إنشاء المنتج' }, { status: 500 });
  }
}

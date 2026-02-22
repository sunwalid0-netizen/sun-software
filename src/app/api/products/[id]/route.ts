import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - جلب منتج بالمعرف
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'فشل في جلب المنتج' }, { status: 500 });
  }
}

// PUT - تعديل منتج
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, image, barcode, categoryId, stock, isActive } = body;

    // التحقق من عدم وجود باركود مكرر
    if (barcode) {
      const existingProduct = await db.product.findFirst({
        where: {
          barcode,
          NOT: { id }
        }
      });
      if (existingProduct) {
        return NextResponse.json({ error: 'الباركود موجود مسبقاً' }, { status: 400 });
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        image: image || null,
        barcode: barcode || null,
        categoryId,
        stock: parseInt(stock) || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'فشل في تحديث المنتج' }, { status: 500 });
  }
}

// DELETE - حذف منتج
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // حذف افتراضي (تعطيل المنتج)
    await db.product.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'فشل في حذف المنتج' }, { status: 500 });
  }
}

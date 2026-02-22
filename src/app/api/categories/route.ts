import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - جلب جميع التصنيفات
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'فشل في جلب التصنيفات' }, { status: 500 });
  }
}

// POST - إضافة تصنيف جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: 'اسم التصنيف مطلوب' }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        name,
        color: color || '#22c55e'
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'فشل في إنشاء التصنيف' }, { status: 500 });
  }
}

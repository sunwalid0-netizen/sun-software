import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - جلب فاتورة بالمعرف
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'فشل في جلب الفاتورة' }, { status: 500 });
  }
}

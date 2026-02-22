import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - جلب جميع الفواتير
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    const where: any = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const invoices = await db.invoice.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'فشل في جلب الفواتير' }, { status: 500 });
  }
}

// POST - إنشاء فاتورة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, subtotal, tax, total, paymentMethod, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'لا توجد عناصر في الفاتورة' }, { status: 400 });
    }

    // توليد رقم فاتورة تسلسلي
    const lastInvoice = await db.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' }
    });

    let invoiceNumber = 'INV-001';
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('INV-', ''));
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // إنشاء الفاتورة
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax) || 0,
        total: parseFloat(total),
        paymentMethod: paymentMethod || 'cash',
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // تحديث المخزون
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الفاتورة' }, { status: 500 });
  }
}

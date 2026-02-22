'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer, X } from 'lucide-react';

interface InvoiceItem {
  id: string;
  productId: string;
  product: {
    name: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

interface InvoiceModalProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}

export function InvoiceModal({ invoice, open, onClose }: InvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md print:max-w-none" dir="rtl">
        <DialogHeader className="print:hidden">
          <div className="flex items-center justify-between">
            <DialogTitle>فاتورة رقم {invoice.invoiceNumber}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4" id="invoice-print">
          {/* شعار المتجر */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-primary">عالم سمسم</h2>
            <p className="text-sm text-muted-foreground">سوبر ماركت</p>
          </div>

          {/* معلومات الفاتورة */}
          <div className="flex justify-between text-sm">
            <span className="font-medium">رقم الفاتورة:</span>
            <span>{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">التاريخ:</span>
            <span>{formatDate(invoice.createdAt)}</span>
          </div>

          <Separator />

          {/* المنتجات */}
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
              <span>المنتج</span>
              <span className="text-center">الكمية</span>
              <span className="text-center">السعر</span>
              <span className="text-left">الإجمالي</span>
            </div>
            <Separator />
            {invoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 text-sm">
                <span className="truncate">{item.product.name}</span>
                <span className="text-center">{item.quantity}</span>
                <span className="text-center">{item.unitPrice.toFixed(2)}</span>
                <span className="text-left">{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* الإجماليات */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>الإجمالي الفرعي:</span>
              <span>{invoice.subtotal.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الضريبة (14%):</span>
              <span>{invoice.tax.toFixed(2)} ج.م</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي:</span>
              <span className="text-primary">{invoice.total.toFixed(2)} ج.م</span>
            </div>
          </div>

          {/* تذييل */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>شكراً لتسوقكم معنا!</p>
            <p>نتمنى لكم يوماً سعيداً</p>
          </div>
        </div>

        {/* أزرار */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="w-4 h-4 ml-2" />
            طباعة الفاتورة
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

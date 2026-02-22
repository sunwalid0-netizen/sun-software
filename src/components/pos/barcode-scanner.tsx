'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ScanBarcode } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "ابحث بالاسم أو الباركود..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(0);

  // دعم قارئ الباركود
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      // إذا كان الوقت بين الضغطات أقل من 50ms، فهو على الأرجح من قارئ الباركود
      if (currentTime - lastKeyTime.current > 50) {
        // ضغطة جديدة (ليست من القارئ)
        if (document.activeElement !== inputRef.current) {
          barcodeBuffer.current = '';
        }
      }
      
      lastKeyTime.current = currentTime;
      
      // إذا كان Enter و buffer يحتوي على بيانات
      if (e.key === 'Enter' && barcodeBuffer.current.length > 3) {
        // هذا باركود من القارئ
        onSearch(barcodeBuffer.current);
        setQuery(barcodeBuffer.current);
        barcodeBuffer.current = '';
        e.preventDefault();
      } else if (e.key.length === 1 && document.activeElement !== inputRef.current) {
        // إضافة الحرف للـ buffer
        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch]);

  // البحث التلقائي مع تأخير
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pr-10 h-12 text-lg"
      />
      <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
    </div>
  );
}

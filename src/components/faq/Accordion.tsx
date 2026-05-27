'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/types';

interface AccordionProps {
  items: FAQ[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

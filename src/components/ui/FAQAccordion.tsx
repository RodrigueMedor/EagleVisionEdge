import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export default function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={cn('max-w-3xl mx-auto', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-100 rounded-2xl mb-3 overflow-hidden shadow-soft transition-all duration-200 hover:shadow-md"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50/50 transition-colors flex justify-between items-center gap-4"
          >
            <span className="font-semibold text-primary">{item.question}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0',
                openIndex === index ? 'rotate-180' : ''
              )}
            />
          </button>
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            )}
          >
            <div className="px-6 py-4 text-gray-500 border-t border-gray-100 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

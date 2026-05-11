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
          className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-primary">{item.question}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-primary transition-transform',
                openIndex === index ? 'rotate-180' : ''
              )}
            />
          </button>
          <div
            className={cn(
              'bg-gray-50 transition-all duration-300',
              openIndex === index ? 'max-h-96' : 'max-h-0 overflow-hidden'
            )}
          >
            <div className="px-6 py-4 text-gray-600">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

export interface FaqItem {
  question: string
  answer: string
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    if (!mounted.current) {
      gsap.set(el, { height: 0 })
      mounted.current = true
      return
    }

    if (isOpen) {
      gsap.to(el, {
        height: el.scrollHeight,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => gsap.set(el, { height: 'auto' }),
      })
    } else {
      gsap.to(el, {
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      })
    }
  }, [isOpen])

  return (
    <div
      className="faq_accordion"
      data-anim="blur-fade"
      data-anim-delay={String(index * 0.06)}
    >
      <div className="faq_question" onClick={onToggle} role="button" tabIndex={0} aria-expanded={isOpen}>
        <div className="heading-cards">{item.question}</div>
        <div className={`fs_accordion-2_arrow-wrapper${isOpen ? ' is-active-accordion' : ''}`}>
          <img src="/images/open.svg" loading="lazy" alt="" className="faq5_arrow-icon" />
        </div>
      </div>
      <div className="faq_answer" ref={contentRef} style={{ overflow: 'hidden' }}>
        <div className="faq_item-content">
          <div className="max-width-large">
            {item.answer.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="faq_list">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          index={i}
        />
      ))}
    </div>
  )
}

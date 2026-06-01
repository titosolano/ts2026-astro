const ArrowSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 7 14" fill="none" aria-hidden="true">
    <path d="M0.613281 0.61377L6.34059 6.75017L0.613281 12.8866" stroke="currentColor" strokeWidth="1.22728" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface Props {
  href: string
  label: string
  target?: string
  variant?: 'base' | 'navbar'
}

export default function ButtonArrow({ href, label, target, variant = 'base' }: Props) {
  const isNavbar = variant === 'navbar'
  return (
    <div className="button-01_component">
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`button-01_main-wrapper${isNavbar ? ' is-navbar' : ''}`}
      >
        <div className="button-01_text-wrapper">
          <div>{label}</div>
        </div>
        <div className="button-01_arrow-wrapper">
          <div className="button-01_arrow-position">
            <div className="button-01_arrow-img"><ArrowSVG /></div>
          </div>
          <div className="button-01_arrow-position">
            <div className="button-01_arrow-img"><ArrowSVG /></div>
          </div>
        </div>
        <div className="button-01_background" />
      </a>
    </div>
  )
}

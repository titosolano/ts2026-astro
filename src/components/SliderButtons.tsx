interface Props {
  prevClass?: string
  nextClass?: string
  prevLabel?: string
  nextLabel?: string
}

const ArrowSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 7 14" fill="none" aria-hidden="true">
    <path d="M0.613281 0.61377L6.34059 6.75017L0.613281 12.8866" stroke="currentColor" strokeWidth="1.22728" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SliderButtons({
  prevClass = 'swiper-prev',
  nextClass = 'swiper-next',
  prevLabel,
  nextLabel,
}: Props) {
  return (
    <div className="slider-controls_component">
      <div className="slider-buttons_component">
        <button className={`slider-buttons_button ${prevClass}`} aria-label="Previous slide">
          <div className="slider-buttons_arrow-wrapper is-left">
            {[0, 1].map((i) => (
              <div key={i} className="slider-buttons_arrow-position">
                <div className="slider-buttons_icon-svg"><ArrowSVG /></div>
              </div>
            ))}
          </div>
          {prevLabel && <div dangerouslySetInnerHTML={{ __html: prevLabel }} />}
        </button>
        <button className={`slider-buttons_button ${nextClass}`} aria-label="Next slide">
          {nextLabel && <div dangerouslySetInnerHTML={{ __html: nextLabel }} />}
          <div className="slider-buttons_arrow-wrapper">
            {[0, 1].map((i) => (
              <div key={i} className="slider-buttons_arrow-position">
                <div className="slider-buttons_icon-svg"><ArrowSVG /></div>
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  )
}

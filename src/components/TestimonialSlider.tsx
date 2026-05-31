import { useEffect, useRef } from 'react'

export interface Testimonial {
  quote: string
  name: string
  title: string
  photo: string
  photoAlt: string
}

interface Props {
  testimonials: Testimonial[]
}

declare const Swiper: any

export default function TestimonialSlider({ testimonials }: Props) {
  const swiperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function init() {
      if (typeof Swiper === 'undefined' || !swiperRef.current) {
        setTimeout(init, 50)
        return
      }
      new Swiper(swiperRef.current, {
        speed: 800,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
          disabledClass: 'is-disabled',
        },
      })
    }
    init()
  }, [])

  return (
    <div className="testimonial-slider_component">
      <div className="testimonial-slider_slider-position">
        <div className="testimonial-slider_list-wrapper swiper" ref={swiperRef}>
          <div className="testimonial-slider_list swiper-wrapper">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-slider_list-item swiper-slide">
                <div className="testimonial-card_component">
                  <div className="testimonial-card_main-wrapper">
                    <div className="testimonial-card_content-top">
                      <img loading="lazy" src="/images/quote.svg" alt="" className="icon-1x1-small" />
                      <div className="spacer-small" />
                      <div>{t.quote}</div>
                    </div>
                    <div className="spacer-small" />
                    <div className="testimonial-card_client">
                      <div className="testimonial-card_client-image-wrapper">
                        <img loading="lazy" src={t.photo} alt={t.photoAlt} className="testimonial-card_client-image" />
                      </div>
                      <div className="testimonial-card_client-info">
                        <div className="testimonial-card_person-name">{t.name}</div>
                        <div className="testimonial-card_person-title">{t.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next — vertical-square variant */}
      <div className="testimonial-slider_buttons-position">
        <div className="slider-controls_component w-variant-8875b4b4-bd89-c661-cc80-1858cae07d96">
          <div className="slider-buttons_component w-variant-8875b4b4-bd89-c661-cc80-1858cae07d96">
            {(['prev', 'next'] as const).map((dir) => (
              <button
                key={dir}
                className={`slider-buttons_button w-variant-8875b4b4-bd89-c661-cc80-1858cae07d96 swiper-${dir}`}
                aria-label={dir === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
              >
                <div className={`slider-buttons_arrow-wrapper${dir === 'prev' ? ' is-left' : ''}`}>
                  {[0, 1].map((i) => (
                    <div key={i} className="slider-buttons_arrow-position">
                      <div className="slider-buttons_icon-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 7 14" fill="none" aria-hidden="true">
                          <path d="M0.613281 0.61377L6.34059 6.75017L0.613281 12.8866" stroke="currentColor" strokeWidth="1.22728" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

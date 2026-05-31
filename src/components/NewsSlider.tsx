import { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Navigation, Autoplay, Mousewheel, Keyboard } from 'swiper/modules'
import SliderButtons from './SliderButtons'

export interface Milestone {
  title: string
  body: string
  url?: string
  linkLabel?: string
  iconUrl?: string
}

const ExternalLinkSVG = () => (
  <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.001 16H2.00098C1.47054 16 0.961836 15.7893 0.586763 15.4142C0.21169 15.0391 0.000976563 14.5304 0.000976562 14V3C0.000976562 2.46957 0.21169 1.96086 0.586763 1.58579C0.961836 1.21071 1.47054 1 2.00098 1H6.00098V3H2.00098V14H13.001V10H15.001V14C15.001 14.5304 14.7903 15.0391 14.4152 15.4142C14.0401 15.7893 13.5314 16 13.001 16ZM7.70098 9.707L6.29098 8.293L12.584 2H9.00098V0H16.001V7H14.001V3.415L7.70098 9.707V9.707Z" fill="currentcolor" />
  </svg>
)

export default function NewsSlider({ items }: { items: Milestone[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const swiperEl = el.querySelector<HTMLElement>('.swiper')
    if (!swiperEl) return

    const swiper = new Swiper(swiperEl, {
      modules: [Navigation, Autoplay, Mousewheel, Keyboard],
      speed: 400,
      loop: true,
      autoplay: { delay: 2000, disableOnInteraction: false },
      autoHeight: false,
      centeredSlides: true,
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: false,
      slidesPerView: 1,
      spaceBetween: 0,
      rewind: false,
      mousewheel: { forceToAxis: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        nextEl: el.querySelector<HTMLElement>('.news-swiper-next'),
        prevEl: el.querySelector<HTMLElement>('.news-swiper-prev'),
        disabledClass: 'is-disabled',
      },
      slideActiveClass: 'is-active',
      slideDuplicateActiveClass: 'is-active',
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 0 },
        992: { slidesPerView: 3, spaceBetween: 0 },
      },
    })

    return () => swiper.destroy()
  }, [])

  return (
    <div className="slider-main_component" ref={sectionRef}>
      <div className="padding-global">
        <div className="container-large">
          <div className="slider-main_slider-wrapper">
            <div className="slider-main_list-wrapper swiper">
              <div className="slider-main_list swiper-wrapper">
                {items.map((item, i) => (
                  <div key={i} className="slider-main_item swiper-slide">
                    <div className="news_item">
                      <div className="news_item-icon-wrapper">
                        <img
                          loading="lazy"
                          src={item.iconUrl ?? '/images/trophy-1.svg'}
                          alt=""
                          className="news_icon"
                        />
                      </div>
                      <div className="news_item-content-wrapper">
                        <h3 className="heading-cards">{item.title}</h3>
                        <p className="text-size-small text-style-muted">{item.body}</p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="external-button_component"
                          >
                            <div>{item.linkLabel ?? 'More info'}</div>
                            <div className="external-button_icon">
                              <ExternalLinkSVG />
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="study-case-slider_bottom">
        <div className="padding-global">
          <div className="container-large">
            <SliderButtons
              prevClass="news-swiper-prev"
              nextClass="news-swiper-next"
              prevLabel="Prev"
              nextLabel="Next"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

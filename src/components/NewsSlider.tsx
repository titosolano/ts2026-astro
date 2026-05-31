import { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Navigation, Autoplay, Mousewheel, Keyboard } from 'swiper/modules'
import SliderButtons from './SliderButtons'
import MilestoneCard from './MilestoneCard'
import type { Milestone } from './MilestoneCard'

export type { Milestone }

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
                    <MilestoneCard milestone={item} />
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

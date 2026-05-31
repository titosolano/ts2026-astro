import { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import ProjectCard from './ProjectCard'
import type { Project } from './ProjectCard'
import SliderButtons from './SliderButtons'

export type { Project }

interface Props {
  projects: Project[]
}

export default function WorkSlider({ projects }: Props) {
  const swiperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = swiperRef.current
    if (!el) return

    function getNavbarHeight() {
      const div = document.createElement('div')
      div.style.cssText = 'position:absolute;visibility:hidden;height:var(--_dimensions---navbar-height)'
      document.body.appendChild(div)
      const h = div.offsetHeight
      div.remove()
      return h || 0
    }

    function scrollToSlider() {
      const top = el!.closest('.study-case-slider_component')?.getBoundingClientRect().top ?? 0
      window.scrollTo({ top: top + window.scrollY - getNavbarHeight(), behavior: 'smooth' })
    }

    const swiper = new Swiper(el, {
      modules: [Navigation, EffectFade],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      autoplay: false,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      watchSlidesProgress: true,
      autoHeight: true,
      allowTouchMove: false,
      simulateTouch: false,
      followFinger: false,
      slideActiveClass: 'is-active',
      navigation: {
        nextEl: el.closest('.study-case-slider_component')!.querySelector('.work-swiper-next'),
        prevEl: el.closest('.study-case-slider_component')!.querySelector('.work-swiper-prev'),
        disabledClass: 'is-disabled',
      },
      on: {
        init(s) { requestAnimationFrame(() => s.updateAutoHeight(0)) },
        slideChangeTransitionStart() { scrollToSlider() },
        slideChangeTransitionEnd(s) { s.updateAutoHeight(800) },
        resize(s) { s.updateAutoHeight(0) },
      },
    })

    return () => swiper.destroy()
  }, [])

  return (
    <div className="study-case-slider_component">
      <div className="study-case-slider_list-wrapper swiper" ref={swiperRef}>
        <div className="study-case-slider_list swiper-wrapper">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} asSlide />
          ))}
        </div>
      </div>

      <div className="study-case-slider_bottom">
        <div className="padding-global">
          <div className="container-large">
            <div className="study-case-slider_bottom-main-wrapper">
              <div className="study-case-slider_control-position">
                <SliderButtons
                  prevClass="work-swiper-prev"
                  nextClass="work-swiper-next"
                  prevLabel="Previous Project"
                  nextLabel="Next Project"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

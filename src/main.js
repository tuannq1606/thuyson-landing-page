import './style.css'

document.documentElement.classList.add('js')

const yearEl = document.getElementById('y')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function initReveal() {
  const nodes = document.querySelectorAll('.reveal')
  if (reducedMotion || typeof IntersectionObserver === 'undefined') {
    nodes.forEach((el) => el.classList.add('reveal-visible'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        const d = el.getAttribute('data-reveal-delay')
        if (entry.isIntersecting) {
          if (d != null && d !== '') el.style.setProperty('--reveal-delay', `${d}ms`)
          else el.style.removeProperty('--reveal-delay')
          el.classList.add('reveal-visible')
        } else {
          el.style.setProperty('--reveal-delay', '0ms')
          el.classList.remove('reveal-visible')
        }
      })
    },
    { rootMargin: '0px 0px -7% 0px', threshold: [0, 0.08, 0.15] }
  )
  nodes.forEach((el) => io.observe(el))
}

function initHeader() {
  const header = document.querySelector('[data-site-header]')
  if (!header) return
  const sync = () => {
    const sc = window.scrollY > 12
    header.classList.toggle('shadow-header', !sc)
    header.classList.toggle('shadow-header-scrolled', sc)
  }
  sync()
  if (reducedMotion) return
  window.addEventListener('scroll', sync, { passive: true })
}

function initNavHighlight() {
  if (typeof IntersectionObserver === 'undefined') return

  const links = [...document.querySelectorAll('a.site-nav-anchor[href^="#"]')]
  const ids = [...new Set(links.map((a) => a.getAttribute('href').slice(1)).filter(Boolean))]
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
  if (!sections.length) return

  const activeCls = 'site-nav-link-active'

  const clear = () => {
    links.forEach((a) => {
      a.removeAttribute('aria-current')
      a.classList.remove(activeCls)
    })
  }

  const setActive = (id) => {
    clear()
    const href = `#${id}`
    links.forEach((link) => {
      if (link.getAttribute('href') !== href) return
      link.setAttribute('aria-current', 'page')
      link.classList.add(activeCls)
    })
  }

  let currentId = ''
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (!visible.length) return
      const id = visible[0].target.id
      if (id && id !== currentId) {
        currentId = id
        setActive(id)
      }
    },
    { rootMargin: '-14% 0px -52% 0px', threshold: [0, 0.12, 0.22, 0.4] }
  )

  sections.forEach((s) => io.observe(s))

  const onScroll = () => {
    if (window.scrollY < 88) {
      currentId = ''
      clear()
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function initMobileMenu() {
  const root = document.querySelector('[data-mobile-menu-root]')
  const toggle = document.querySelector('[data-mobile-menu-toggle]')
  if (!root || !toggle) return

  const backdrop = root.querySelector('[data-mobile-menu-backdrop]')
  const panel = root.querySelector('[data-mobile-menu-panel]')
  const closeBtns = root.querySelectorAll('[data-mobile-menu-close]')
  const openCls = 'site-mobile-menu-open'

  const isOpen = () => document.documentElement.classList.contains(openCls)

  const open = () => {
    document.documentElement.classList.add(openCls)
    root.setAttribute('aria-hidden', 'false')
    toggle.setAttribute('aria-expanded', 'true')
    toggle.setAttribute('aria-label', 'Đóng menu')
    document.body.classList.add('overflow-hidden')
    window.setTimeout(() => {
      const focusTarget = panel?.querySelector('[data-mobile-menu-close]') || panel
      if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus()
    }, 0)
  }

  const close = () => {
    document.documentElement.classList.remove(openCls)
    root.setAttribute('aria-hidden', 'true')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'Mở menu')
    document.body.classList.remove('overflow-hidden')
    if (document.activeElement && root.contains(document.activeElement)) toggle.focus()
  }

  toggle.addEventListener('click', () => {
    if (isOpen()) close()
    else open()
  })

  closeBtns.forEach((btn) => btn.addEventListener('click', close))
  backdrop?.addEventListener('click', close)

  panel?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      window.setTimeout(close, 0)
    })
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close()
  })

  window.addEventListener(
    'resize',
    () => {
      if (window.matchMedia('(min-width: 768px)').matches && isOpen()) close()
    },
    { passive: true }
  )
}

const HERO_SERVICE_SLIDER_TITLES = [
  'Đổ mực',
  'Sửa chữa máy in & máy photocopy',
  'Sửa laptop — PC, cho thuê máy in / photocopy',
  'Bán mới & linh kiện (máy tính, máy in, camera, photocopy)',
  'Mua thanh lý máy văn phòng — báo giá rõ, làm việc minh bạch',
]

function padSlideNum(i) {
  return String(i + 1).padStart(2, '0')
}

function initHeroServiceSlider() {
  const root = document.querySelector('[data-hero-service-slider]')
  if (!root) return

  const track = root.querySelector('[data-slider-track]')
  const slides = root.querySelectorAll('[data-slider-slide]')
  const numEl = root.querySelector('[data-slider-num]')
  const titleEl = root.querySelector('[data-slider-title]')
  const liveEl = root.querySelector('[data-slider-live]')
  const dots = root.querySelectorAll('[data-slider-dot]')
  const prevBtn = root.querySelector('[data-slider-prev]')
  const nextBtn = root.querySelector('[data-slider-next]')

  const n = slides.length
  let index = 0
  let timer = 0

  function apply() {
    if (!track) return
    track.style.transform = `translateX(-${index * 100}%)`
    slides.forEach((s, j) => {
      s.setAttribute('aria-hidden', j !== index ? 'true' : 'false')
    })
    if (numEl) numEl.textContent = padSlideNum(index)
    const t = HERO_SERVICE_SLIDER_TITLES[index] ?? ''
    if (titleEl) titleEl.textContent = t
    if (liveEl) liveEl.textContent = `Dịch vụ ${padSlideNum(index)}: ${t}`
    dots.forEach((d, j) => {
      const on = j === index
      d.setAttribute('aria-current', on ? 'true' : 'false')
      d.classList.toggle('bg-white', on)
      d.classList.toggle('shadow-sm', on)
      d.classList.toggle('ring-white/40', on)
      d.classList.toggle('bg-white/35', !on)
      d.classList.toggle('shadow-none', !on)
      d.classList.toggle('ring-white/25', !on)
    })
  }

  function go(delta) {
    index = (index + delta + n) % n
    apply()
  }

  function goTo(i) {
    index = ((i % n) + n) % n
    apply()
  }

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = 0
    }
  }

  function startTimer() {
    clearTimer()
    if (reducedMotion) return
    timer = window.setInterval(() => go(1), 6000)
  }

  prevBtn?.addEventListener('click', () => {
    go(-1)
    clearTimer()
    startTimer()
  })
  nextBtn?.addEventListener('click', () => {
    go(1)
    clearTimer()
    startTimer()
  })

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      goTo(Number.parseInt(d.getAttribute('data-slider-dot') || '0', 10))
      clearTimer()
      startTimer()
    })
  })

  root.addEventListener('mouseenter', clearTimer)
  root.addEventListener('mouseleave', startTimer)

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimer()
    else startTimer()
  })

  apply()
  startTimer()
}

function initHeroParallax() {
  const root = document.querySelector('[data-hero-parallax]')
  if (!root || reducedMotion) return

  const deep = root.querySelector('[data-parallax="deep"]')
  const mids = root.querySelectorAll('[data-parallax="mid"]')
  const content = root.querySelector('[data-parallax="content"]')
  const aside = root.querySelector('[data-parallax="aside"]')

  if (!deep && mids.length === 0 && !content && !aside) return

  let scheduled = false
  const apply = () => {
    scheduled = false
    const y = window.scrollY
    const start = root.offsetTop
    const delta = Math.max(0, y - start)

    if (deep) {
      deep.style.transform = `translate3d(0, ${(delta * 0.13).toFixed(2)}px, 0)`
    }
    mids.forEach((el) => {
      el.style.transform = `translate3d(0, ${(delta * 0.065).toFixed(2)}px, 0)`
    })
    if (content) {
      content.style.transform = `translate3d(0, ${(-delta * 0.032).toFixed(2)}px, 0)`
    }
    if (aside) {
      aside.style.transform = `translate3d(0, ${(-delta * 0.058).toFixed(2)}px, 0)`
    }
  }

  const onScrollOrResize = () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(apply)
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
  apply()
}

initHeroParallax()
initHeroServiceSlider()
initReveal()
initHeader()
initNavHighlight()
initMobileMenu()
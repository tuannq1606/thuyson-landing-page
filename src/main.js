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
  const grid = root.querySelector('[data-parallax="grid"]')
  const glowL = root.querySelector('[data-parallax="glow-l"]')
  const glowR = root.querySelector('[data-parallax="glow-r"]')
  const content = root.querySelector('[data-parallax="content"]')
  const aside = root.querySelector('[data-parallax="aside"]')

  if (!deep && mids.length === 0 && !grid && !glowL && !glowR && !content && !aside) return

  const usePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(hover: hover)').matches

  let scrollDeep = 0
  let scrollMid = 0
  let scrollContent = 0
  let scrollAside = 0

  let mx = 0
  let my = 0
  let targetMx = 0
  let targetMy = 0
  const lerpPointer = usePointer ? 0.12 : 0.06
  let driftStart = typeof performance !== 'undefined' ? performance.now() : 0
  let heroIntersecting = true

  const syncScroll = () => {
    const y = window.scrollY
    const start = root.offsetTop
    const delta = Math.max(0, y - start)
    scrollDeep = delta * 0.13
    scrollMid = delta * 0.065
    scrollContent = -delta * 0.032
    scrollAside = -delta * 0.058
  }

  const applyTransforms = () => {
    const px = mx
    const py = my

    if (deep) {
      deep.style.transform = `translate3d(${(px * 22).toFixed(2)}px, ${(scrollDeep + py * 14).toFixed(2)}px, 0)`
    }
    mids.forEach((el, i) => {
      const sign = i % 2 === 0 ? 1 : -1
      const tx = px * 32 * sign
      const ty = scrollMid + py * 20 * sign
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`
    })
    if (grid) {
      grid.style.transform = `translate3d(${(px * 10).toFixed(2)}px, ${(py * 8).toFixed(2)}px, 0)`
    }
    if (glowL) {
      glowL.style.transform = `translate3d(${(px * 36).toFixed(2)}px, ${(py * 24 + scrollMid * 0.35).toFixed(2)}px, 0)`
    }
    if (glowR) {
      glowR.style.transform = `translate3d(${(px * -28).toFixed(2)}px, ${(py * -18 + scrollMid * 0.25).toFixed(2)}px, 0)`
    }
    if (content) {
      const cx = px * 4
      const cy = scrollContent + py * -6
      content.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
    }
    if (aside) {
      const ax = px * -5
      const ay = scrollAside + py * -8
      aside.style.transform = `translate3d(${ax.toFixed(2)}px, ${ay.toFixed(2)}px, 0)`
    }
  }

  let scrollScheduled = false
  const onScrollOrResize = () => {
    if (scrollScheduled) return
    scrollScheduled = true
    requestAnimationFrame(() => {
      scrollScheduled = false
      syncScroll()
      applyTransforms()
    })
  }

  const onPointerMove = (e) => {
    if (!usePointer) return
    const r = root.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    targetMx = Math.max(-1, Math.min(1, nx * 2))
    targetMy = Math.max(-1, Math.min(1, ny * 2))
  }

  const onPointerLeave = () => {
    if (!usePointer) return
    targetMx = 0
    targetMy = 0
  }

  if (usePointer) {
    root.addEventListener('mousemove', onPointerMove, { passive: true })
    root.addEventListener('mouseleave', onPointerLeave)
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        heroIntersecting = e ? e.isIntersecting : true
      },
      { threshold: 0, rootMargin: '80px 0px' }
    )
    io.observe(root)
  }

  const tickMotion = () => {
    if (!usePointer) {
      if (heroIntersecting) {
        const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - driftStart
        targetMx = Math.sin(t * 0.00028) * 0.42
        targetMy = Math.cos(t * 0.00024) * 0.36
      } else {
        targetMx *= 0.92
        targetMy *= 0.92
      }
    }

    mx += (targetMx - mx) * lerpPointer
    my += (targetMy - my) * lerpPointer

    syncScroll()
    applyTransforms()
    requestAnimationFrame(tickMotion)
  }

  syncScroll()
  applyTransforms()
  requestAnimationFrame(tickMotion)

  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
}

initHeroParallax()
initHeroServiceSlider()
initReveal()
initHeader()
initNavHighlight()
initMobileMenu()
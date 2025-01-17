import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { deviceDetection } from './deviceDetect';
import { CustomCursor } from './customCursor';
import CustomEase from 'gsap/CustomEase';
import Flip from 'gsap/Flip';
class GlobalScripts {
  constructor() {
    this.initLenis();
    this.lastScrollTop = 0;
    this.isAnimating = false;
    this.debounceTimeout = null;
    this.ticking = false;
    this.initPreloader();

    
    if ((deviceDetection.isMobile || deviceDetection.isTablet) || window.innerWidth < 992) {
      this.initMobileMenu();
    }

    if (deviceDetection.isDesktop) {
      this.initGlobalAnimations();
      new CustomCursor();
    }
  }

  initGlobalAnimations() {
    gsap.set('.about_us_footer_grid', { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', opacity: 0});
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.footer_1_wrap',
        start: 'top center',
      },
      defaults: {
        ease: (progress)=> {
          return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        },
        duration: 3
      }
    });
    tl.to('.about_us_footer_grid', {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      delay: 0.5,
      opacity: 1
    });
  }

  initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;

    const consentBanner = document.querySelector('.global_cookie_modal');
    const buttonWrap = consentBanner.querySelector('.accept-buttons');
    consentBanner.style = 'display: block;';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Decline all';

    closeButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declide');
      consentBanner.remove();
    });
    buttonWrap.appendChild(closeButton);

    consentBanner.querySelector('button:first-child').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'all');
      consentBanner.remove();
    });

    consentBanner.querySelector('[data-cc-accept="[]"]').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'necessary');
      consentBanner.remove();
    });
  }

  initPreloader() {
    const lenis = this.lenis;
    const initCookieConsent = this.initCookieConsent;
    lenis.stop();
    let customEase =
      'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1';
    let counter = {
      value: 0,
    };
    let loaderDuration = 3;

    // If not a first time visit in this tab
    if (sessionStorage.getItem('visited') !== null) {
      loaderDuration = 1;
      counter = {
        value: 75,
      };
    }
    sessionStorage.setItem('visited', 'true');

    function updateLoaderText() {
      let progress = Math.round(counter.value);
      $('.preloader_number').text(progress + '%');
    }
    function endLoaderAnimation() {
      $('.preloader_trigger').click();
      lenis.start();
      initCookieConsent();
    }
    let tl = gsap.timeline({
      onComplete: endLoaderAnimation,
    });
    tl.to(counter, {
      value: 100,
      onUpdate: updateLoaderText,
      duration: loaderDuration,
      ease: CustomEase.create('custom', customEase),
    });
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      func();
    }, wait);
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    this.lenis.on('scroll', ({ scroll }) => {
      const logo = document.querySelector('.global_nav');
      if (scroll > 96) {
        logo.classList.add('visible');
      } else {
        logo.classList.remove('visible');
      }
    });
    
    this.raf(this.time);
  }

  raf(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }

  initMobileMenu() {
    let hamburgerEl = document.querySelector('.global_nav_contain_hamburger_wrap');
    let navLineEl = document.querySelectorAll('.global_nav_contain_hamburger_line');
    let menuContainEl = document.querySelector('.global_nav_flip');
    let flipItemEl = document.querySelector('.global_nav_contain_hamburger_base');
    let menuWrapEl = document.querySelector('.global_nav_wrap');
    let menuBaseEl = document.querySelector('.global_nav_bg');
    let menuLinkEl = menuWrapEl.querySelectorAll('.nav_links_text');

    hamburgerEl.setAttribute('role', 'button');
    hamburgerEl.setAttribute('aria-expanded', 'false');
    hamburgerEl.setAttribute('aria-label', 'Toggle menu');
    hamburgerEl.setAttribute('tabindex', '0');
    
    menuWrapEl.setAttribute('role', 'navigation');
    menuWrapEl.setAttribute('aria-label', 'Mobile navigation');
    
    menuWrapEl.setAttribute('aria-hidden', 'true');

    let flipDuration = 0.4;

    function flip(forwards) {
      let state = Flip.getState(flipItemEl);
      if (forwards) {
        menuContainEl.appendChild(flipItemEl);
      } else {
        hamburgerEl.appendChild(flipItemEl);
      }
      Flip.from(state, { duration: flipDuration });
    }

    let tl = gsap.timeline({ paused: true });
    tl.set(menuWrapEl, { display: 'flex' });
    tl.from(menuBaseEl, {
      opacity: 0,
      duration: flipDuration,
      ease: 'none',
      onStart: () => {
        this.lenis.stop();
        flip(true);
        menuWrapEl.setAttribute('aria-hidden', 'false');
      },
    });
    // gsap.set(navLineEl[0], { originY: 0, originX: 0 });
    // gsap.set(navLineEl[1], { originY: 0, originX: 0 });
    tl.to(navLineEl[0], { y: 4, rotate: 45, duration: flipDuration, scale:0.9 }, '<');
    tl.to(navLineEl[1], { y: -4, rotate: -45, duration: flipDuration, scale:0.9 }, '<');
    tl.from(menuLinkEl, {
      opacity: 0,
      yPercent: 50,
      duration: 0.4,
      stagger: { amount: 0.4 },
      onReverseComplete: () => {
        this.lenis.start();
        flip(false);
        menuWrapEl.setAttribute('aria-hidden', 'true');
      },
    });

    function openMenu(open) {
      if (!tl.isActive()) {
        if (open) {
          tl.play();
          hamburgerEl.classList.add('nav-open');
          hamburgerEl.setAttribute('aria-expanded', 'true');
        } else {
          tl.reverse();
          hamburgerEl.classList.remove('nav-open');
          hamburgerEl.setAttribute('aria-expanded', 'false');
        }
      }
    }

    hamburgerEl.addEventListener('click', function () {
      if (this.classList.contains('nav-open')) {
        openMenu(false);
      } else {
        openMenu(true);
      }
    });

    menuBaseEl.addEventListener('mouseenter', () => openMenu(false));
    menuBaseEl.addEventListener('click', () => openMenu(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        openMenu(false);
      }
    });
  }
}

export default function () {
  return new GlobalScripts();
}

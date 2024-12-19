import Lenis from '@studio-freight/lenis';
import gsap from 'gsap'
import { deviceDetection } from './deviceDetect';
import { CustomCursor } from './customCursor';
class GlobalScripts {
  constructor() {
    this.initLenis();
    this.lastScrollTop = 0;
    this.isAnimating = false;
    this.debounceTimeout = null;
    this.ticking = false;
    this.initHeaderAnimation();
    if (deviceDetection.isDesktop) {
      new CustomCursor();
    }
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

    this.raf(this.time);
  }

  raf(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }

  initHeaderAnimation() {
    const header = document.querySelector('.nav_component');
    if (!header) return;

    const handleHeaderAnimation = (direction, currentScroll) => {
      if (this.isAnimating) return;
      this.isAnimating = true;

      if (direction === 1 && currentScroll > 100) {
        // Scrolling down - hide header
        gsap.to(header, {
          yPercent: -100,
          duration: 1.2,
          filter: 'blur(50px)',
          opacity:0,
          ease: "power2.in",
          onComplete: () => {
            this.isAnimating = false;
          }
        });
      } else if (direction === -1) {
        // Scrolling up - show header
        gsap.to(header, {
          yPercent: 0,
          duration: 1.2,
          opacity:1,
          filter: 'blur(0px)',
          ease: "power2.out",
          onComplete: () => {
            this.isAnimating = false;
          }
        });
      }
    };

    const onScroll = () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const scrollDirection = currentScroll > this.lastScrollTop ? 1 : -1;

          if (Math.abs(currentScroll - this.lastScrollTop) > 100 || currentScroll <= 0) {
            this.debounce(() => {
              handleHeaderAnimation(scrollDirection, currentScroll);
            }, 250);
            
            this.lastScrollTop = currentScroll;
          }

          this.ticking = false;
        });

        this.ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

}

export default function() {
  return new GlobalScripts();
}
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap'
import { deviceDetection } from './deviceDetect';
import { CustomCursor } from './customCursor';
import CustomEase from 'gsap/CustomEase';
class GlobalScripts {
  constructor() {
    this.initLenis();
    this.lastScrollTop = 0;
    this.isAnimating = false;
    this.debounceTimeout = null;
    this.ticking = false;
    this.initHeaderAnimation();
    this.initPreloader();
    if (deviceDetection.isDesktop) {
      new CustomCursor();
    }
  }

  initPreloader() {

    let customEase =
      "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1";
    let counter = {
      value: 0
    };
    let loaderDuration = 10;

    // If not a first time visit in this tab
    if (sessionStorage.getItem("visited") !== null) {
      loaderDuration = 2;
      counter = {
        value: 75
      };
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
      let progress = Math.round(counter.value);
      $(".preloader_number").text(progress + '%');
    }
    function endLoaderAnimation() {
      $(".preloader_trigger").click();
    }
      let tl = gsap.timeline({
        onComplete: endLoaderAnimation
      });
      tl.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: CustomEase.create("custom", customEase)
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
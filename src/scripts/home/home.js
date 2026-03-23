import '../../styles/home.css';
import SplitType from 'split-type';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { deviceDetection } from '../global/deviceDetect';

gsap.registerPlugin(CustomEase);

export default function () {
  return new HomeScripts();
}

class HomeScripts {
  constructor() {
    this.initHeroMarquee();
    this.initTrackTextAnimation();
    this.initStackingCards();
    this.initInfiniteLogoLoop();
    if (deviceDetection.isDesktop) {
      this.initHeroAnimation();
    }
  }

  initHeroAnimation() {
    const SKIP_ANIM = import.meta.env.DEV; // toggle: set to false to preview full loading delay in dev

    const loadingDuration = SKIP_ANIM ? 0 : sessionStorage.getItem('visited') !== null ? 2.5 : 4.75;
    const rows = [
      '.custom_text_wrap_one',
      '.custom_text_wrap_two',
      '.custom_text_wrap_three'
    ].map(selector => ({
      container: document.querySelector(selector),
      image: document.querySelector(`${selector} .hero_heading_image`),
      text: document.querySelectorAll(`${selector} .hero_heading_text`)
    }));

    const ctaRow = document.querySelector('.hero_heading_wrap .custom_text_wrap:last-child');
    const arrow = ctaRow.querySelector('.custom_text_container_arrow_icon');
    const navRow = document.querySelector('nav');
  
    // Set initial states
    rows.forEach(row => {
      gsap.set(row.container, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', scale:0.8 });
      gsap.set(row.image, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', scale:0.8});
      gsap.set(ctaRow, {  opacity:0});
      gsap.set(navRow, {  opacity:0});
      gsap.set(arrow, {  opacity:0});
    });
  
    // Create the animation timeline
    const tl = gsap.timeline({
      defaults: {
        ease: (progress)=> {
          return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        },
        duration: 2
      }
    });

    rows.forEach((row, index) => {
        tl.to(row.container, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          scale:1,
          delay:loadingDuration,
        }, 0);

        tl.to(row.image, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          scale:1,
          delay:loadingDuration,
        }, '0.5');
    });

    tl.to(navRow, {
      opacity:1,
      duration:3
    }, '-=1.5');

    tl.to(ctaRow, {
      opacity:1,
      duration:3,
    }, '-=2');

    tl.to(arrow, {
      opacity:1,
    }, '-=2');
    tl.to(arrow, {
      y: 10,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "circ.out"
    }, '-=2')
  }
  
  initHeroMarquee() {
    const wrap = document.querySelector('.updated_hero_track_wrap');
    if (!wrap) return;
    if (wrap.querySelector('.updated_hero_track_inner')) return;

    // Collect only direct .updated_hero_creator_card_wrap children
    const items = Array.from(
      wrap.querySelectorAll(':scope > .updated_hero_creator_card_wrap')
    );
    if (!items.length) return;

    // Create inner track element
    const track = document.createElement('div');
    track.classList.add('updated_hero_track_inner');

    // Move originals into track
    items.forEach(item => track.appendChild(item));

    // Clone originals for seamless loop
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    wrap.appendChild(track);

    // Impulse ease (approximates impulse:standard:v1 intensity:50)
    CustomEase.create('impulse', 'M0,0 C0.09,0 0.18,1.08 0.48,1.04 C0.7,1.01 1,1 1,1');

    const totalOriginal = items.length;
    let currentIndex = 0;
    const STEP_INTERVAL = 2;     // seconds between step starts
    const ANIM_DURATION = 0.85;  // seconds for each tween

    const getStepSize = () => {
      const card = track.querySelector('.updated_hero_creator_card_wrap');
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return card.offsetWidth + gap;
    };

    const step = () => {
      currentIndex++;
      const stepSize = getStepSize();
      const targetX = -(currentIndex * stepSize);

      gsap.to(track, {
        x: targetX,
        duration: ANIM_DURATION,
        ease: 'impulse',
        onComplete: () => {
          if (currentIndex >= totalOriginal) {
            gsap.set(track, { x: 0 });
            currentIndex = 0;
          }
          gsap.delayedCall(STEP_INTERVAL - ANIM_DURATION, step);
        },
      });
    };

    gsap.delayedCall(STEP_INTERVAL, step);
  }

  initTrackTextAnimation() {
    const stackingTextSection = document.querySelector('.stacking_text_wrap');
    const stackingCardParent = stackingTextSection.querySelector('.stacking_text_contain_inner');
    const stackingCardTextWrapper = stackingCardParent.querySelector('.stacking_text_contain_inner_wrapper');
    const stackingCardTextWrapperChildren = Array.from(stackingCardTextWrapper.children);
    const stackingCardImage = stackingTextSection.querySelector('.stacking_text_contain_inner_team_image');

    gsap.set(stackingCardImage, {
      opacity: 0,
      scale: 0.8,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stackingCardParent,
        start: 'top 50%', 
        end: 'bottom 50%',
        scrub: 1,
        toggleActions: 'play none none reverse',
        pinSpacing: false,
      }
    });

    stackingCardTextWrapperChildren.forEach((element) => {
      element.setAttribute('text-split', '');
    });

    new SplitType('[text-split]', {
      types: 'words',
      tagName: 'span',
    });

    gsap.set('[text-split]', { opacity: 1 });
    stackingCardTextWrapperChildren.forEach((element) => {
      tl.fromTo(element.querySelectorAll('.word'), {
        opacity: 0.2,
      }, {
        opacity: 1,
        stagger: { each: 0.2 },
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    tl.to(stackingCardImage, {
      opacity: 1,
      duration: 3,
      scale: 1,
      ease: 'power2.out',
    }, '+=1')
  }

  initStackingCards() {
    const cards = document.querySelectorAll('.stacking-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      let prev = card.previousElementSibling;
      if (!prev) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 65%',
            end: 'top top',
            scrub: 1,
          },
        })
        .fromTo(
          prev,
          {
            scale: 1,
            filter: 'blur(0px)',
          },
          {
            scale: 0.85,
            filter: 'blur(8px)',
          },
        )
    });
  }

  initInfiniteLogoLoop() {
    const scroller = document.querySelector('.logo_scroll')
    const scrollerInner = scroller.querySelector('.logo_scroll_inner')
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  }
}

import '../../styles/home.css';
import SplitType from 'split-type';
import gsap from 'gsap';
import { deviceDetection } from '../global/deviceDetect';

export default function () {
  return new HomeScripts();
}

class HomeScripts {
  constructor() {
    this.initTrackTextAnimation();
    this.initStackingCards();
    this.initInfiniteLogoLoop();
    if (deviceDetection.isDesktop) {
      this.initHeroAnimation();
    }
  }

  initHeroAnimation() {
    const loadingDuration = sessionStorage.getItem('visited') !== null ? 2.5 : 4.75;
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

    cards.forEach((card, index) => {
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
        .fromTo(
          card,
          {
            boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.02)',
          },
          {
            boxShadow: '0px -49px 49px 0px rgba(0, 0, 0, 0.02)',
          },
        );
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

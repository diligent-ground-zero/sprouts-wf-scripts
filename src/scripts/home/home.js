import '../../styles/home.css';
import SplitType from 'split-type';
import gsap from 'gsap';
export default function () {
  return new HomeScripts();
}

class HomeScripts {
  constructor() {
    this.initTrackTextAnimation();
    this.initStackingCards();
    this.initInfiniteLogoLoop();
    this.initHeroAnimation();
  }

  initHeroAnimation() {
    let customEase =
    'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1';
    const loadingDuration = sessionStorage.getItem('visited') !== null ? 3 : 1;
    const rows = [
      '.custom_text_wrap_one',
      '.custom_text_wrap_two',
      '.custom_text_wrap_three'
    ].map(selector => ({
      container: document.querySelector(selector),
      image: document.querySelector(`${selector} .hero_heading_image`),
      text: document.querySelectorAll(`${selector} .hero_heading_text`)
    }));

  
    // Set initial states
    rows.forEach(row => {
      // gsap.set(row.container, { overflow: 'hidden' });
      // gsap.set(row.image, { scale: 0.5, opacity:0 });
      // row.text.forEach(text => {
      //   gsap.set(text, { opacity: 0,y:50 });
      // })
    });
  
    // Create the animation timeline
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      }
    });
  
    // rows.forEach((row, index) => {
    //   const stagger = index === 0 
    //     ? loadingDuration 
    //     : `+=${0.5}`;
    //   tl.to(row.image, {
    //     scale: 1,
    //     opacity: 1,
    //     duration: 0.8,
    //   }, stagger);
    // });
    // First animate the containers and images
  
    // Then animate the text elements
    // rows.forEach((row, index) => {
    //   tl.to(row.text, {
    //     opacity: 1,
    //     duration: 1,
    //   }, index === 0 ? '-=1' : '-=0.7'); // Overlap text animations for smoother flow
    // });
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

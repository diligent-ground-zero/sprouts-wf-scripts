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
    const SKIP_ANIM = false// toggle: set to false to preview full loading delay in dev
    this.loadingDuration = SKIP_ANIM ? 0 : sessionStorage.getItem('visited') !== null ? 2.5 : 4.75;

    this.initHeroMarquee();
    this.initHeroBgVideo();
    this.initTrackTextAnimation();
    this.initStackingCards();
    this.initInfiniteLogoLoop();
    if (deviceDetection.isDesktop) {
      this.initHeroAnimation();
    }
  }

  initHeroAnimation() {
    const loadingDuration = this.loadingDuration;
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
    if (!ctaRow) return;
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
  
  initHeroBgVideo() {
    if (!deviceDetection.isDesktop) return;
    const container = document.querySelector('.updated_hero_bg_video');
    if (!container) return;

    const srcWebm = 'https://sprouts.bucket.diligent-studios.com/general/bg_sprouts.webm';
    const srcMp4 = 'https://sprouts.bucket.diligent-studios.com/general/bg_sprouts.mp4';
    const CROSSFADE = 3; // seconds before end to begin crossfade

    const makeVideo = () => {
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.poster = 'https://cdn.prod.website-files.com/6730663af40f98fed8d63f14/69c1e75a9a144d4a4d9d81dc_video_poster.webp';
      v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
      const sWebm = document.createElement('source');
      sWebm.src = srcWebm;
      sWebm.type = 'video/webm';
      v.appendChild(sWebm);
      const sMp4 = document.createElement('source');
      sMp4.src = srcMp4;
      sMp4.type = 'video/mp4';
      v.appendChild(sMp4);
      container.appendChild(v);
      v.load();
      return v;
    };

    const videoA = makeVideo();
    const videoB = makeVideo();

    gsap.set([videoA, videoB], { opacity: 0 });

    let current = videoA;
    let next = videoB;
    let busy = false;

    const crossfade = () => {
      if (busy) return;
      busy = true;
      next.currentTime = 0;
      next.play();
      gsap.to(next, { opacity: 1, duration: CROSSFADE, ease: 'power2.inOut' });
      gsap.to(current, {
        opacity: 0,
        duration: CROSSFADE,
        ease: 'power2.inOut',
        onComplete: () => {
          current.pause();
          [current, next] = [next, current];
          busy = false;
        },
      });
    };

    [videoA, videoB].forEach(v => {
      v.addEventListener('timeupdate', () => {
        if (v !== current || !v.duration) return;
        if (v.currentTime >= v.duration - CROSSFADE) crossfade();
      });
    });

    gsap.set(container, { opacity: 0 });
    gsap.delayedCall(this.marqueeStartDelay - 4, () => {
      videoA.play();
      gsap.set(videoA, { opacity: 1});
      gsap.to(container, {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      });
    });
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

    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    wrap.appendChild(track);

    // Impulse ease (approximates impulse:standard:v1 intensity:50)
    CustomEase.create('impulse', 'M0,0 C0.09,0 0.18,1.08 0.48,1.04 C0.7,1.01 1,1 1,1');

    const totalOriginal = items.length;
    const STEP_INTERVAL = 4; // time between steps (must be > ANIM_DURATION for seamless effect)
    const ANIM_DURATION = 2;
    const SCALE_FULL = 1;
    const SCALE_SMALL = deviceDetection.isDesktop ? 0.75 : 1;
    const FEATURED_SLOT = 1; // 0 = leftmost, 1 = second from left, etc.
    const ACCENT_CLASS = 'is-accent'; // applied to the 2 cards right of featured
    const START_OFFSET = 0; // start N steps into the sequence to hide right-edge whitespace
    const getTrackOffset = () => {
      return 0;
    };

    let currentIndex = START_OFFSET;

    // All cards (originals + clones) needed for scale tracking
    const allCards = Array.from(track.querySelectorAll('.updated_hero_creator_card_wrap'));
    const clones = allCards.slice(totalOriginal);

    const setAccentCards = (baseIndex) => {
      allCards.forEach(c => c.classList.remove(ACCENT_CLASS));
      allCards[baseIndex + 1]?.classList.add(ACCENT_CLASS);
      allCards[baseIndex + 2]?.classList.add(ACCENT_CLASS);
    };

    // Initial scale based on START_OFFSET position
    const initialFeatured = totalOriginal - START_OFFSET + FEATURED_SLOT;
    if (deviceDetection.isDesktop) {
      gsap.set(allCards, { scale: SCALE_SMALL, transformOrigin: 'bottom center' });
      gsap.set(allCards[initialFeatured], { scale: SCALE_FULL });
    }
    setAccentCards(initialFeatured);

    // Hide clones for appear animation (originals at START_OFFSET positions are already in viewport)
    gsap.set(clones, { opacity: 0, y: 40 });

    const measureStepSize = () => {
      const card = track.querySelector('.updated_hero_creator_card_wrap');
      // getComputedStyle reads CSS layout values — unaffected by GSAP scale transforms
      const cardWidth = parseFloat(getComputedStyle(card).width);
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return cardWidth + gap;
    };

    // Capture once — must stay consistent across steps and the seamless reset
    let stepSize = measureStepSize();

    // Start START_OFFSET steps into the sequence to push right-edge whitespace off screen
    gsap.set(track, { x: -(totalOriginal * stepSize) + (START_OFFSET * stepSize) + getTrackOffset() });
    gsap.set(wrap, { opacity: 1 });

    // On resize, recalculate and snap track to the correct position for currentIndex
    new ResizeObserver(() => {
      stepSize = measureStepSize();
      gsap.set(track, { x: -(totalOriginal * stepSize) + (currentIndex * stepSize) + getTrackOffset() });
    }).observe(wrap);

    const step = () => {
      currentIndex++;
      const targetX = -(totalOriginal * stepSize) + (currentIndex * stepSize) + getTrackOffset();

      // Incoming card enters the featured slot; outgoing card leaves it
      const featuredBase = totalOriginal - currentIndex + FEATURED_SLOT;
      const incoming = allCards[featuredBase];
      const outgoing = allCards[featuredBase + 1];
      if (deviceDetection.isDesktop) {
        gsap.to(incoming, { scale: SCALE_FULL, duration: ANIM_DURATION, ease: 'power2.out' });
        gsap.to(outgoing, { scale: SCALE_SMALL, duration: ANIM_DURATION, ease: 'power2.out' });
      }
      setAccentCards(featuredBase);

      gsap.to(track, {
        x: targetX,
        duration: ANIM_DURATION,
        ease: 'impulse',
        onComplete: () => {
          if (currentIndex >= totalOriginal) {
            gsap.set(track, { x: -(totalOriginal * stepSize) + getTrackOffset() });
            // Seamless reset: hand featured state back to initial clone slot
            if (deviceDetection.isDesktop) {
              gsap.set(allCards[FEATURED_SLOT], { scale: SCALE_SMALL });
              gsap.set(allCards[totalOriginal + FEATURED_SLOT], { scale: SCALE_FULL });
            }
            setAccentCards(totalOriginal + FEATURED_SLOT);
            currentIndex = 0;
          }
          gsap.delayedCall(STEP_INTERVAL - ANIM_DURATION, step);
        },
      });
    };

    // Intro sequence → heading rows → bottom wrap → marquee starts
    const headingRows = document.querySelectorAll('.updated_hero_heading_text_inner_wrap');
    const bottomItems = document.querySelectorAll('.update_hero_bottom_wrap > *');

    gsap.set(headingRows, { opacity: 0, y: -40});
    gsap.set(bottomItems, { opacity: 0, y: 20 });

    const introTl = gsap.timeline({ delay: this.loadingDuration });

    // Each heading row wipes in from bottom to top
    introTl.to(headingRows, {
      transformOrigin: 'bottom center',
      scale:1,
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power4.inOut',
      stagger: 0.6,
    });

    // Bottom wrap items stagger in
    introTl.to(bottomItems, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      onComplete: () => {
        if (window.innerWidth < 992) return;
        document.querySelector('nav')?.classList.add('is-complete')
      },
    }, '+=0.1');

    // Marquee cards appear, then stepping begins
    introTl.to(clones, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
      stagger: 0.1,
      onComplete: () => gsap.delayedCall(STEP_INTERVAL, step),
    }, '-=1.2');

    this.marqueeStartDelay = this.loadingDuration + introTl.duration() + STEP_INTERVAL;
  }

  initTrackTextAnimation() {
    const stackingTextSection = document.querySelector('.stacking_text_wrap');
    if (!stackingTextSection) return;
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
    if (!scroller) return;
    const scrollerInner = scroller.querySelector('.logo_scroll_inner')
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  }
}

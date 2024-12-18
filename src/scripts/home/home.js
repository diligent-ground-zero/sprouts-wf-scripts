
import '../../styles/home.css'
import SplitType from 'split-type'
import { horizontalLoop } from '../global/infiniteScrollHelper'
import ScrollTrigger from 'gsap/ScrollTrigger'
import gsap from 'gsap'

export default function() {
  return new HomeScripts();
}

class HomeScripts {
  constructor(){
    gsap.registerPlugin(ScrollTrigger);
    this.initTrackTextAnimation()
    this.initStackingCards()
    this.initInfiniteLogoLoop()
  }

  initTrackTextAnimation() {
      // Target all heading-3 elements within the track-child
  const textElements = document.querySelectorAll('.track-child .heading-3');
  
  // Split text into spans for each heading
  textElements.forEach(element => {
    element.setAttribute('text-split', '');
  });

  // Initialize SplitType with minimal settings
  let typeSplit = new SplitType("[text-split]", {
    types: "words",
    tagName: "span"
  });

  // Create animation for each heading
  textElements.forEach(element => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        // Start animation when element is 40% from the top of the viewport
        start: "top 40%",
        // End animation when element is 20% from the top
        end: "top 20%",
        scrub: 1, // Smooth scrubbing effect
        // markers: true, // Uncomment for debugging
        toggleActions: "play none none reverse"
      }
    });

    tl.from(element.querySelectorAll(".word"), {
      opacity: 0.2,
      duration: 0.2,
      ease: "power2.out",
      stagger: { each: 0.4 }
    });
  });

  // Ensure text is visible
  gsap.set("[text-split]", { opacity: 1 });
  }

  initStackingCards() {
    const cards = document.querySelectorAll(".stacking-card");
    if (!cards.length) return;
    
    cards.forEach((card, index) => {
        let prev = card.previousElementSibling;
        if (!prev) return;
        
        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 65%",
                end: "top top",
                scrub: 1
            }
        }).fromTo(prev, {
            scale: 1,
            filter: "blur(0px)"
        }, {
            scale: .85,
            filter: "blur(8px)"
        }).fromTo(card, {
            boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.02)"
        }, {
            boxShadow: "0px -49px 49px 0px rgba(0, 0, 0, 0.02)"
        });
    });
  }

  initInfiniteLogoLoop(){
    const boxes = gsap.utils.toArray(".splide_slide"),
  loop = horizontalLoop(boxes, { paused: false, speed: 0.5 });
  }

  
}
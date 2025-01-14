import gsap from 'gsap';

export default function () {
  return new CreatorsScripts();
}

class CreatorsScripts {
  constructor() {
    this.animateCards();
  }

  animateCards() {
    const cardItems = gsap.utils.toArray('.projects_cms_item');

    gsap.set(cardItems, {
      opacity: 0,
      y: 50,
    });

    gsap.to(cardItems, {
      opacity: 1,
      y: 0,
      duration: 1.8,
      delay: 0.2,
      ease: 'power2.out',
      stagger: 0.5,
      scrollTrigger: {
        trigger: '.projects_cms_list',
        start: 'top 50%',
        end: 'top 30%',
      },
    });
  }
}

import { deviceDetection } from '../global/deviceDetect';
import gsap from 'gsap';

export class CustomCursor {
  constructor() {
    // Only initialize on desktop devices
    if (!deviceDetection.isDesktop) return;

    // Create cursor element
    this.createCursorElement();
    this.cursor = document.querySelector('.custom-cursor');
    this.links = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    this.hideCursorElements = document.querySelectorAll('[data-hide-cursor]');
    this.isVisible = false;
    this.cursorPos = { x: 0, y: 0 };
    this.targetPos = { x: 0, y: 0 };

    this.render = this.render.bind(this);

    if (!this.cursor) return;

    this.init();
  }

  createCursorElement() {
    if (!document.querySelector('.custom-cursor')) {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      
      const cursorText = document.createElement('span');
      cursorText.className = 'custom-cursor-text';
      cursorText.textContent = 'See More';
      cursor.appendChild(cursorText);
      
      document.body.insertBefore(cursor, document.body.firstChild);
    }
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
      const shouldHideCursor = elementUnderCursor?.hasAttribute('data-hide-cursor') || 
                              elementUnderCursor?.closest('[data-hide-cursor]');
      const hasDetailCursor = elementUnderCursor?.hasAttribute('data-detail-cursor') || 
                             elementUnderCursor?.closest('[data-detail-cursor]');

      // Handle cursor visibility and state
      if (!this.isVisible && !shouldHideCursor) {
        this.isVisible = true;
        gsap.to(this.cursor, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else if (this.isVisible && shouldHideCursor) {
        this.isVisible = false;
        gsap.to(this.cursor, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // Handle detail cursor state
      if (hasDetailCursor && !this.cursor.classList.contains('detail-mode')) {
        this.cursor.classList.add('detail-mode');
        gsap.to(this.cursor, {
          width: 150,
          height: 150,
          backgroundColor: 'var(--swatch--dark)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to('.custom-cursor-text', {
          opacity: 1,
          duration: 0.4,
          delay:0.2,
          ease: 'power2.out',
        });
      } else if (!hasDetailCursor && this.cursor.classList.contains('detail-mode')) {
        this.cursor.classList.remove('detail-mode');
        gsap.to(this.cursor, {
          width: 45,
          height: 45,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to('.custom-cursor-text', {
          opacity:0,
          duration: 0,
          ease: 'power2.out',
        });
      }

      this.targetPos.x = e.clientX;
      this.targetPos.y = e.clientY;
    });

    // Mouse leave handler
    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      gsap.to(this.cursor, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    this.links.forEach((link) => {
      if (!link.hasAttribute('data-hide-cursor')) {
        link.addEventListener('mouseenter', () => {
          gsap.to(this.cursor, {
            width: 135,
            height: 135,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(this.cursor, {
            width: 45,
            height: 45,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      }
    });

    // Start the animation loop
    this.render();
  }

  render() {
    // Smooth interpolation
    const lerp = (start, end, factor) => start + (end - start) * factor;

    this.cursorPos.x = lerp(this.cursorPos.x, this.targetPos.x, 0.1);
    this.cursorPos.y = lerp(this.cursorPos.y, this.targetPos.y, 0.1);

    gsap.set(this.cursor, {
      x: this.cursorPos.x,
      y: this.cursorPos.y,
    });

    requestAnimationFrame(this.render);
  }
}
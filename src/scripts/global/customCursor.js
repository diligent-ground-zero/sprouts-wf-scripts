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
      document.body.insertBefore(cursor, document.body.firstChild);
    }
  }

  init() {
    // Initial cursor setup
    this.cursor.style.opacity = '0';
    
    // Mouse move handler with lerp smoothing
    document.addEventListener('mousemove', (e) => {
      if (!this.isVisible) {
        this.isVisible = true;
        gsap.to(this.cursor, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
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
        ease: 'power2.out'
      });
    });

    // Add hover effect for interactive elements
    this.links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(this.cursor, {
          scale: 3,
          duration: 0.3,
          ease: 'power2.out',
          // background: 'var(--swatch--dark)'
        });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(this.cursor, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          // background: 'var(--swatch--dark)'
        });
      });
    });

    // Start the animation loop
    this.render();
  }

  render() {
    // Smooth interpolation
    const lerp = (start, end, factor) => start + (end - start) * factor;
    
    this.cursorPos.x = lerp(this.cursorPos.x, this.targetPos.x, 0.2);
    this.cursorPos.y = lerp(this.cursorPos.y, this.targetPos.y, 0.2);
    
    gsap.set(this.cursor, {
      x: this.cursorPos.x,
      y: this.cursorPos.y,
      force3D: true
    });
    
    requestAnimationFrame(this.render);
  }
}
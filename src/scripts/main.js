import '../styles/global.css';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import globalScripts from './global/index.js';
import homeScripts from './home/home.js';
import creatorScripts from './creators/creatorScripts.js';

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  
  globalScripts();

  if (window.location.pathname.endsWith('/')) {
    homeScripts();
  }

  if (window.location.pathname.endsWith('/creators')) {
    creatorScripts();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
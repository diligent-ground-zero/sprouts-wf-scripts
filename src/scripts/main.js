import '../styles/global.css';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';
import gsap from 'gsap';
import globalScripts from './global/index.js';
import homeScripts from './home/home.js';
import creatorScripts from './creators/creatorScripts.js';
import teamScripts from './team/teamScripts.js';
import creatorSingleScripts from './creatorsSingle/creatorSingle.js';
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(CustomEase);
  globalScripts();

  if (window.location.pathname.endsWith('/')) {
    homeScripts();
  }

  if (window.location.pathname.endsWith('/creators')) {
    creatorScripts();
  }

  if (/^\/creators\/[^/]+$/.test(window.location.pathname)) {
    creatorSingleScripts();
  }

  if (window.location.pathname.endsWith('/team')) {
    teamScripts();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
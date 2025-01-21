import '../styles/global.css';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';
import gsap from 'gsap';
import globalScripts from './global/index.js';
import homeScripts from './home/home.js';
import creatorScripts from './creators/creatorScripts.js';
import teamScripts from './team/teamScripts.js';
import creatorSingleScripts from './creatorsSingle/creatorSingle.js';
import Flip from 'gsap/Flip';

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(CustomEase);
  gsap.registerPlugin(Flip);
  const globalScriptsInstance = globalScripts();

  if (window.location.pathname.endsWith('/')) {
    homeScripts();
  }

  if (window.location.pathname.endsWith('/creators')) {
    creatorScripts();
  }

  if (/^\/creators\/[^/]+$/.test(window.location.pathname)) {
    creatorSingleScripts(globalScriptsInstance.lenis);
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

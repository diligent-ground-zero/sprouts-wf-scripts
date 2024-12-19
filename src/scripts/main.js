import '../styles/global.css';
import ScrollTrigger from 'gsap/ScrollTrigger'
import gsap from 'gsap'
const init = () => {

  gsap.registerPlugin(ScrollTrigger);

  import('./global/index.js').then((module) => {
    module.default();
  });

  if (window.location.pathname.endsWith('/')) {
    import('./home/home.js').then((module) => {
      module.default();
    });
  }

  if (window.location.pathname.endsWith('/creators')) {
    import('./creators/creatorScripts.js').then((module) => {
      module.default();
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

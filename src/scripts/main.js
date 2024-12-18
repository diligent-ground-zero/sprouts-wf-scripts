import '../styles/global.css';
import * as global from './global/index.js';
import * as home from './home/home.js';

const init = () => {
  global.default();
  
  if (window.location.pathname.endsWith('/')) {
    home.default();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
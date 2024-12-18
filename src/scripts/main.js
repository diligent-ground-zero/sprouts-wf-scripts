import '../styles/global.css';

const init = () => {
  import('./global/index.js').then((module) => {
    module.default();
  });
  // import('./global/index.js').then((module) => {
  //   module.initSwipers();
  //   module.initCustomVideoControls();
  //   module.initHeaderListeners();
  //   module.onMenuOpenListener();
  // });

  if (window.location.pathname.endsWith('/')) {
    import('./home/home.js').then((module) => {
      module.default();
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

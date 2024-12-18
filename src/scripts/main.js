
const init = () => {
  // import('./global/index.js').then((module) => {
  //   module.initSwipers();
  //   module.initCustomVideoControls();
  //   module.initHeaderListeners();
  //   module.onMenuOpenListener();
  // });

  // if (window.location.pathname.includes('linkedin-ads-lab')) {
  //   import('./blog/blog.js').then((module) => {
  //     module.initBlog();
  //   });
  // }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

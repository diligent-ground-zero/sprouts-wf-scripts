import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { deviceDetection } from '../global/deviceDetect';
export default function () {
  return new CreatorSingleScripts();
}

class CreatorSingleScripts {
  constructor() {
    this.checkImagesAndInitDialog();
    this.initSwiper()
  }

  initSwiper() {
    const swiper = new Swiper('.other_creators_carousel_contain', {
      modules: [Navigation],
      spaceBetween: 20,
      slidesPerView: 'auto',
      preventClicks: true,
      loop: true,
      speed:1000,
      resistance: true,
      allowTouchMove: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
          allowTouchMove: false,
        },
        992: {
          slidesPerView: 3,
          allowTouchMove: false,
          centeredSlides: true,
        }
      },
      navigation: {
        nextEl: '.other-creators-buttons-next',
        prevEl: '.other-creators-buttons-prev',
      },
    });

    if ((deviceDetection.isMobile || deviceDetection.isTablet) && window.innerWidth < 767) {
      const swiper = new Swiper('.feed_grid_wrap', {
        direction: 'vertical',
         modules: [Pagination,Navigation],
        spaceBetween: 40,
        loop: true,
        duration: 2000,
        resistance: true,
        pagination: {
          el: '.feed_grid_pagination',
          clickable: true,
        },
      })
    }
  }

  checkImagesAndInitDialog() {
    const desktopImage = document.querySelector('.creators_dialog_form_image_desktop');
    const mobileImage = document.querySelector('.creators_dialog_form_image_mobile');
    
    if (this.areImagesEmpty(desktopImage, mobileImage)) {
      this.hideDialogOpenButton();
    } else {
      this.creatorDemoDialog();
    }
  }

  areImagesEmpty(desktopImage, mobileImage) {
    const isDesktopEmpty = !desktopImage || !desktopImage.getAttribute('src');
    const isMobileEmpty = !mobileImage || !mobileImage.getAttribute('src');
    return isDesktopEmpty && isMobileEmpty;
  }

  creatorDemoDialog() {
    const demoButton = document.querySelector('[data-creator-demos-button]');

    if (demoButton) {
      demoButton.addEventListener('click', () => {
        const modal = document.querySelector('.creators_dialog_wrap').children[0];
        if (modal) {
          modal.showModal();
        }
      });
    }
  }
  hideDialogOpenButton() {
    const demoButton = document.querySelector('[data-creator-demos-button]');
    if (demoButton) {
      demoButton.style.display = 'none';
    }
  }
}

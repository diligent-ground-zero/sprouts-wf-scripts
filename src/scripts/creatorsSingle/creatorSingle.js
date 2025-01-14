
export default function () {
  return new CreatorSingleScripts();
}

class CreatorSingleScripts {
  constructor() {
    this.checkImagesAndInitDialog();
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

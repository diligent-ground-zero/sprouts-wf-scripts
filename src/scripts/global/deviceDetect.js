import MobileDetect from 'mobile-detect';

export class DeviceDetection {
  constructor() {
    this.md = new MobileDetect(window.navigator.userAgent);
    this.isDesktop = !this.md.mobile() && !this.md.tablet();
    this.isMobile = this.md.mobile() && !this.md.tablet();
    this.isTablet = this.md.tablet();
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static getInstance() {
    if (!DeviceDetection.instance) {
      DeviceDetection.instance = new DeviceDetection();
    }
    return DeviceDetection.instance;
  }
}

export const deviceDetection = DeviceDetection.getInstance();

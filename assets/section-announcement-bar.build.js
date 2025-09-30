import { T as Ticker } from "./ticker-2aaf4347.js";
const AnnouncementBar = () => {
  let Timer;
  const globalCssClasses = window.themeCore.utils.cssClasses;
  const selectors = {
    section: ".js-announcement-bar",
    announcementBarCloser: ".js-bar-closer",
    timer: ".js-timer",
    slider: ".js-announcement-bar-slider",
    slideContent: ".js-announcement-bar-slide-content",
    tickerContainer: ".js-announcement-bar-ticker-container"
  };
  const Swiper = window.themeCore.utils.Swiper;
  let section = null;
  let timers = null;
  let slider = null;
  let swiperSlider = null;
  let tickerContainer = null;
  function checkIsBarAllowedToShow() {
    const sessionShowBar = JSON.parse(sessionStorage.getItem("showAnnouncementBar"));
    return sessionShowBar === null;
  }
  function closeBar(event) {
    const announcementBarCloser = event.target.closest(selectors.announcementBarCloser);
    if (!announcementBarCloser) {
      return;
    }
    sessionStorage.setItem("showAnnouncementBar", false);
    section.classList.add(globalCssClasses.hidden);
    window.themeCore.EventBus.emit("announcement-bar:changed", {});
    window.removeEventListener("resize", initSwiperHeight);
  }
  async function initSlider(sliderEl) {
    if (!sliderEl) {
      return;
    }
    const Autoplay = await window.themeCore.utils.getExternalUtil("swiperAutoplay");
    Swiper.use([Autoplay]);
    const autoplaySpeed = sliderEl.getAttribute("data-autoplay-speed");
    const isAutoPlay = sliderEl.getAttribute("data-autoplay") === "true";
    swiperSlider = new Swiper(sliderEl, {
      init: false,
      direction: "vertical",
      slidesPerView: 1,
      arrows: false,
      loop: true,
      navigation: {
        nextEl: ".js-announcement-swiper-button-next",
        prevEl: ".js-announcement-swiper-button-prev"
      },
      on: {
        init: function() {
          let prevEl = document.querySelector(".js-announcement-swiper-button-prev");
          let nextEl = document.querySelector(".js-announcement-swiper-button-next");
          if (prevEl) {
            prevEl.classList.remove("is-hidden");
          }
          if (nextEl) {
            nextEl.classList.remove("is-hidden");
          }
        }
      },
      autoplay: isAutoPlay ? {
        delay: autoplaySpeed,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      } : false
    });
    swiperSlider.on("init", function() {
      initSwiperHeight();
      window.addEventListener("resize", initSwiperHeight);
    });
    swiperSlider.init();
  }
  function initSwiperHeight() {
    if (!swiperSlider || !swiperSlider.initialized) {
      return;
    }
    let swiperContainer = swiperSlider.el;
    let swiperSlides = swiperSlider.slides;
    if (!swiperSlider || !swiperSlider || !swiperSlides.length) {
      return;
    }
    let maxHeight = 0;
    swiperContainer.style.height = 0;
    swiperSlides.forEach((swiperSlide) => {
      let swiperSlideContent = swiperSlide.querySelector(selectors.slideContent);
      if (swiperSlideContent) {
        swiperSlideContent.style.height = "auto";
        if (swiperSlideContent && swiperSlideContent.scrollHeight > maxHeight) {
          maxHeight = swiperSlideContent.scrollHeight;
        }
      }
    });
    swiperContainer.style.height = `${maxHeight}px`;
    swiperSlides.forEach(function(swiperSlide) {
      let swiperSlideContent = swiperSlide.querySelector(selectors.slideContent);
      swiperSlideContent.style.height = "";
    });
  }
  async function init() {
    Timer = window.themeCore.utils.Timer;
    section = document.querySelector(selectors.section);
    timers = section.querySelectorAll(selectors.timer);
    slider = section.querySelector(selectors.slider);
    tickerContainer = section.querySelector(selectors.tickerContainer);
    if (checkIsBarAllowedToShow()) {
      section.addEventListener("click", closeBar);
      window.themeCore.EventBus.emit("announcement-bar:changed", {});
      initSlider(slider);
      Ticker(tickerContainer).init();
      setTimeout(() => {
        timers = section.querySelectorAll(selectors.timer);
        timers.forEach(function(timerEl) {
          Timer(timerEl).init();
        });
      }, 0);
      setTimeout(() => {
        window.themeCore.EventBus.emit("announcement-bar:loaded", {});
      }, 0);
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.AnnouncementBar = window.themeCore.AnnouncementBar || AnnouncementBar();
  window.themeCore.utils.register(window.themeCore.AnnouncementBar, "announcement-bar");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}

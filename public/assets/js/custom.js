(function ($) {
  ("use strict");

  $(".sidebar-button").on("click", function () {
    $(this).toggleClass("active");
  });

  const sidebarButton = document.querySelector(".sidebar-button");

  if (sidebarButton) {
    sidebarButton.addEventListener("click", () => {
      document.querySelector(".main-menu").classList.toggle("show-menu");
    });
  }

  $(".menu-close-btn").on("click", function () {
    $(".main-menu").removeClass("show-menu");
  });

  // sidebar
  $(".right-sidebar-button").on("click", function () {
    $(".right-sidebar-menu").addClass("show-right-menu");
  });
  $(".right-sidebar-close-btn").on("click", function () {
    $(".right-sidebar-menu").removeClass("show-right-menu");
  });

  $(".menu-btn").on("click", function () {
    $(".sidebar-menu").addClass("active");
  });
  $(".sidebar-menu-close").on("click", function () {
    $(".sidebar-menu").removeClass("active");
  });

  jQuery(".dropdown-icon").on("click", function () {
    jQuery(this)
      .toggleClass("active")
      .next("ul, .mega-menu, .mega-menu2")
      .slideToggle();
    jQuery(this)
      .parent()
      .siblings()
      .children("ul, .mega-menu, .mega-menu2")
      .slideUp();
    jQuery(this).parent().siblings().children(".active").removeClass("active");
  });
  jQuery(".dropdown-icon2").on("click", function () {
    jQuery(this).toggleClass("active").next(".submenu-list").slideToggle();
    jQuery(this).parent().siblings().children(".submenu-list").slideUp();
    jQuery(this).parent().siblings().children(".active").removeClass("active");
  });

  // FancyBox Js
  $('[data-fancybox="gallery-01"]').fancybox({
    buttons: ["close"],
    loop: false,
    protect: true,
  });
  $('[data-fancybox="video-player"]').fancybox({
    buttons: ["close"],
    loop: false,
    protect: true,
  });
  $(".video-player").fancybox({
    buttons: ["close"],
    loop: false,
    protect: true,
  });

  // sticky header
  const header = document.querySelector(".header-area");

  window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  //Counter up
  // $(".counter").counterUp({
  //   delay: 10,
  //   time: 1000,
  // });

 

  // Home1 Feature Slider
  var swiper = new Swiper(".home1-feature-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 0,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".process-slider-next",
      prevEl: ".process-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
  // Home1 Project Slider
  var swiper = new Swiper(".home1-project-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 0,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".project-slider-next",
      prevEl: ".project-slider-prev",
    },
    pagination: {
      el: ".swiper-pagination1",
      clickable: true,
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
  // Home1 Testimonial Slider
  var swiper = new Swiper(".home1-testimonial-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 35,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".testimonial-slider-next",
      prevEl: ".testimonial-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 2,
      },
    },
  });
  // Home1 Blog Slider
  var swiper = new Swiper(".home1-blog-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".blog-slider-next",
      prevEl: ".blog-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 3,
      },
    },
  });
  // Home2 Service Slider
  var swiper = new Swiper(".home2-service-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".service-slider-next",
      prevEl: ".service-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
  // Home2 Process Slider
  var swiper = new Swiper(".home2-process-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".service-slider-next",
      prevEl: ".service-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });
  // Home2 Team Slider
  var swiper = new Swiper(".home2-team-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination1",
      clickable: true,
    },
    navigation: {
      nextEl: ".team-slider-next",
      prevEl: ".team-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
  // Home2 Testimonial Slider
  var swiper = new Swiper(".home2-testimonial-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 35,
    effect: "fade", // Use the fade effect
    fadeEffect: {
      crossFade: true, // Enable cross-fade transition
    },
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".testimonial-slider-next",
      prevEl: ".testimonial-slider-prev",
    },
  });
  // Home3 Blog Slider
  var swiper = new Swiper(".home3-blog-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".blog-slider-next",
      prevEl: ".blog-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 2,
      },
    },
  });
  // Home3 Testimonial Slider
  var swiper = new Swiper(".home3-testimonial-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    effect: "fade", // Use the fade effect
    fadeEffect: {
      crossFade: true, // Enable cross-fade transition
    },
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".testimonial-slider-next",
      prevEl: ".testimonial-slider-prev",
    },
  });
  // Home3 Team Slider
  var swiper = new Swiper(".home3-team-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 0,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination1",
      clickable: true,
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      386: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      },
      1400: {
        slidesPerView: 5,
      },
    },
  });
  // Home4 Testimonial Slider
  var swiper = new Swiper(".home4-testimonial-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 35,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".testimonial-slider-next",
      prevEl: ".testimonial-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1400: {
        slidesPerView: 3,
      },
    },
  });
  // Home4 Project Slider
  const sliders = document.querySelectorAll(".home4-project-slider");
  sliders.forEach((slider) => {
    const nextBtn = slider.parentElement.querySelector(".project-slider-next");
    const prevBtn = slider.parentElement.querySelector(".project-slider-prev");

    const swiper = new Swiper(slider, {
      slidesPerView: 1,
      speed: 1500,
      spaceBetween: 35,
      autoplay: {
        delay: 2500, // Autoplay duration in milliseconds
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      breakpoints: {
        280: {
          slidesPerView: 1,
        },
        386: {
          slidesPerView: 1,
        },
        576: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1400: {
          slidesPerView: 2,
        },
      },
    });
    nextBtn.addEventListener("click", () => {
      swiper.slideNext();
    });

    prevBtn.addEventListener("click", () => {
      swiper.slidePrev();
    });
  });
  // Home5 Project Slider
  var swiper = new Swiper(".home5-project-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 24,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    pagination: {
      el: ".progress-pagination",
      type: "progressbar",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      386: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      },
      1400: {
        slidesPerView: 3,
      },
    },
  });
  // Home6 Service Slider
  var swiper = new Swiper(".home6-service-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 0,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".service-slider-next",
      prevEl: ".service-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
  // Home6 Project Slider
  var swiper = new Swiper(".home6-project-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 30,
    autoplay: {
      delay: 2500, // Autoplay duration in milliseconds
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".project-slider-next",
      prevEl: ".project-slider-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: 1,
      },
      386: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 2,
      },
    },
  });
  var swiper = new Swiper(".pf-horizontal-slider", {
    slidesPerView: 1,
    speed: 1500,
    spaceBetween: 25,
    loop: true,
    effect: "fade",
    mousewheel: {
      invert: false,
    },
    navigation: {
      nextEl: ".pf-slider-next",
      prevEl: ".pf-slider-prev",
    },
  });

  //wow js
  jQuery(window).on("load", function () {
   // new WOW().init();
    window.wow = new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: true,
      live: true,
      offset: 80,
    });
    //window.wow.init();
  });

  // niceSelect
  if ($("select").length) {
    $("select").niceSelect();
  }

  //Select wrap
  $(".select-wrap").on("click", function () {
    $(this).addClass("selected").siblings().removeClass("selected");
  });

  //Cart Page Quantity button toggle
  $(".qty-btn").on("click", function (e) {
    e.stopPropagation();
    // Toggle "active" class for the current quantity button and its related elements
    $(this).next(".quantity-area").toggleClass("active");

    // Remove "active" class from other quantity buttons and related elements
    $(".quantity-area")
      .not($(this).next(".quantity-area"))
      .removeClass("active");
  });
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".quantity-area").length) {
      // Remove "active" class from all quantity buttons and related elements
      $(".quantity-area").removeClass("active");
    }
  });

  // Payment Method
  $(function () {
    $(".choose-payment-method ul li").on("click", function () {
      $(".choose-payment-method ul li").removeClass("active"); // Remove active class from all list items
      if ($(this).hasClass("stripe")) {
        $("#StripePayment").show();
        $("#OfflinePayment").hide();
        $(this).addClass("active"); // Add active class to the clicked list item
      } else if ($(this).hasClass("paypal")) {
        $("#OfflinePayment").hide();
        $("#StripePayment").hide();
        $(this).addClass("active"); // Add active class to the clicked list item
      } else if ($(this).hasClass("offline")) {
        $("#OfflinePayment").show();
        $("#StripePayment").hide();
        $(this).addClass("active"); // Add active class to the clicked list item
      } else {
        $("#StripePayment").hide();
        $("#OfflinePayment").hide();
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const text = document.querySelector(".circular-text .text");
    if (text) {
      text.innerHTML = text.innerText
        .split("")
        .map(
          (char, i) =>
            `<span style="transform:rotate(${i * 13}deg)">${char}</span>`
        )
        .join("");
    }
  });
  document.addEventListener("DOMContentLoaded", function () {
    const text = document.querySelector(".circular-text2 .text");
    if (text) {
      text.innerHTML = text.innerText
        .split("")
        .map(
          (char, i) =>
            `<span style="transform:rotate(${i * 13}deg)">${char}</span>`
        )
        .join("");
    }
  });

  //Quantity Increment
  $(".quantity__minus").on("click", function (e) {
    e.preventDefault();
    var input = $(this).siblings(".quantity__input");
    var value = parseInt(input.val(), 10);
    if (value > 1) {
      value--;
    }
    input.val(value.toString().padStart(2, "0"));
  });
  $(".quantity__plus").on("click", function (e) {
    e.preventDefault();
    var input = $(this).siblings(".quantity__input");
    var value = parseInt(input.val(), 10);
    value++;
    input.val(value.toString().padStart(2, "0"));
  });

  // services Images
  $(".service-list li").on("mouseenter", function (e) {
    // // Get the index of the hovered content list item
    var index = $(this).index();
    // Remove the 'active' class from all image list items
    $(".service-img-list li").removeClass("active");
    // Add the 'active' class to the corresponding image list item
    $(".service-img-list li:eq(" + index + ")").addClass("active");
  });
  // process Images
  function setupProcessImageInteraction() {
    const isMobile = window.innerWidth <= 991;

    $(".process-list li").off("mouseenter click"); // Clean old handlers

    if (isMobile) {
      // Mobile: click interaction + scroll
      $(".process-list li").on("click", function () {
        const index = $(this).index();

        // Activate the corresponding image
        $(".process-img-list li").removeClass("active");
        $(".process-img-list li").eq(index).addClass("active");

        // Scroll to .process-img-list
        $("html, body").animate(
          {
            scrollTop: $(".process-img-list").offset().top - 100,
          },
          600
        ); // 600ms for smooth scroll
      });
    } else {
      // Desktop: hover interaction
      $(".process-list li").on("mouseenter", function () {
        const index = $(this).index();

        $(".process-img-list li").removeClass("active");
        $(".process-img-list li").eq(index).addClass("active");
      });
    }
  }
  // Initial setup and on resize
  setupProcessImageInteraction();
  $(window).on("resize", setupProcessImageInteraction);

  // Hover effect for service-list
  $(".service-list li").on("mouseenter", function () {
    var index = $(this).index();

    // Add active class to the corresponding image
    $(".service-card-wrap li").removeClass("show");
    $(".service-card-wrap li").eq(index).addClass("show");

    // Manage .prev class
    $(".service-list li").removeClass("prev");
    if (index > 0) {
      $(".service-list li")
        .eq(index - 1)
        .addClass("prev");
    }
  });

  $(".service-list li").on("mouseleave", function () {
    // Remove active class from all images when mouse leaves
    $(".service-card-wrap li").removeClass("show");
  });

  // Click effect for service-list
  function setupServiceImageInteraction() {
    const isMobile = window.innerWidth <= 991;

    // Remove previous bindings to avoid stacking
    $(".service-list li").off("click");

    $(".service-list li").on("click", function () {
      var index = $(this).index();

      // Update active class on service list
      $(".service-list li").removeClass("active");
      $(this).addClass("active");

      // Update image preview
      $(".service-card-wrap li").removeClass("active");
      $(".service-card-wrap li").eq(index).addClass("active");

      // Manage .prev class
      $(".service-list li").removeClass("prev");
      if (index > 0) {
        $(".service-list li")
          .eq(index - 1)
          .addClass("prev");
      }

      // Extra scroll behavior for mobile
      if (isMobile) {
        $("html, body").animate(
          {
            scrollTop: $(".service-card-wrap").offset().top - 100,
          },
          600
        );
      }
    });
  }
  // Initial setup and on resize
  setupServiceImageInteraction();
  $(window).on("resize", setupServiceImageInteraction);

  // Home1 Map
  $(".address-list li").on("mouseenter", function (e) {
    // // Get the index of the hovered content list item
    var index = $(this).index();
    // Remove the 'active' class from all image list items
    $(".map-list li").removeClass("active");
    // Add the 'active' class to the corresponding image list item
    $(".map-list li:eq(" + index + ")").addClass("active");
  });

  // services Images
  const serviceImgItem = document.querySelectorAll(
    ".sevices-wrap .single-services "
  );
  function followImageCursor(event, serviceImgItem) {
    const contentBox = serviceImgItem.getBoundingClientRect();
    const dx = event.clientX - contentBox.x;
    const dy = event.clientY - contentBox.y;
    serviceImgItem.children[1].style.transform = `translate(${dx}px, ${dy}px)`;
  }

  serviceImgItem.forEach((item, i) => {
    item.addEventListener("mousemove", (event) => {
      setInterval(followImageCursor(event, item), 100);
    });
  });

  // Select all list items
  const listItems = document.querySelectorAll(".indicator-area ul li");

  // Function to add active class on hover
  listItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      // Remove active class from all list items
      listItems.forEach((li) => li.classList.remove("active"));

      // Add active class to the hovered item
      item.classList.add("active");
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const video = document.querySelector(".video-area video");
    const playBtn = document.querySelector(".play-btn");

    if (video && playBtn) {
      // Ensure both elements exist
      playBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent unwanted link behavior

        if (video.paused) {
          video.play();
          playBtn.classList.add("active"); // Add active class
        } else {
          video.pause();
          playBtn.classList.remove("active"); // Remove active class
        }
      });
    }
  });

  // Slick Slider
  $(".slider").slick({
    infinite: true,
    centerMode: false,
    arrows: false,
    dots: false,
    autoplay: false,
    speed: 800,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  //ticking machine
  var percentTime;
  var tick;
  var time = 0.5;
  var progressBarIndex = 0;

  $(".progressBarContainer .progressBar").each(function (index) {
    var progress = "<div class='inProgress inProgress" + index + "'></div>";
    $(this).html(progress);
  });

  function startProgressbar() {
    resetProgressbar();
    percentTime = 0;
    tick = setInterval(interval, 10);
  }

  function interval() {
    if (
      $(
        '.slider .slick-track div[data-slick-index="' + progressBarIndex + '"]'
      ).attr("aria-hidden") === "true"
    ) {
      progressBarIndex = $(
        '.slider .slick-track div[aria-hidden="false"]'
      ).data("slickIndex");
      startProgressbar();
    } else {
      percentTime += 1 / (time + 5);
      $(".inProgress" + progressBarIndex).css({
        width: percentTime + "%",
      });
      if (percentTime >= 100) {
        $(".slider").slick("slickNext");
        progressBarIndex++;
        if (progressBarIndex > 2) {
          progressBarIndex = 0;
        }
        startProgressbar();
      }
    }
  }

  function resetProgressbar() {
    $(".inProgress").css({
      width: 0 + "%",
    });
    clearInterval(tick);
  }
  startProgressbar();

  //Scroll Down Button
  const scrollBtn = document.querySelector("#scroll-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#scroll-section").scrollIntoView({
        behavior: "smooth",
      });
    });
  }
  const scrollBtn2 = document.querySelector("#scroll-btn2");
  if (scrollBtn2) {
    scrollBtn2.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#scroll-section2").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  // Get the height of the section between start and end triggers
  function initScrollAnimation() {
    const scrollSecTitle = document.querySelector(".scroll-sec-vector");
    const scrollSecTitleEnd = document.querySelector(".scroll-sec-vector-end");

    // Check if both elements exist before proceeding
    if (scrollSecTitle && scrollSecTitleEnd) {
      const start = scrollSecTitle.getBoundingClientRect().top;
      const end = scrollSecTitleEnd.getBoundingClientRect().top;
      const distance = end - start;

      const scScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-sec-vector",
          start: "top 30%",
          endTrigger: ".scroll-sec-vector-end",
          end: "top -120%",
          toggleActions: "restart pause reverse pause",
          scrub: 1,
        },
      });

      scScrollTl.to(".scroll-sec-vector", {
        y: distance, // Use the calculated distance
        duration: 10, // Duration can be kept for scrub speed
      });
    }
  }
  function handleResize() {
    if (window.innerWidth >= 991) {
      initScrollAnimation();
    } else {
      if (ScrollTrigger.getById("scScrollTl")) {
        ScrollTrigger.getById("scScrollTl").kill();
      }
    }
  }
  handleResize();
  window.addEventLis;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.matchMedia({
    // Devices wider than 991px
    "(min-width: 992px)": function () {
      gsap.from(".feature-wrapper", {
        scale: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: ".home5-feature-section",
          scrub: true,
          start: "top 80%",
          end: "top 20%",
        },
      });
    },
  });

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.matchMedia({
    // Devices wider than 991px
    "(min-width: 992px)": function () {
      gsap.from(".banner-bottom-img-wrapper", {
        scale: 0.82,
        ease: "none",
        scrollTrigger: {
          trigger: ".home6-banner-bottom-area",
          scrub: true,
          start: "top 80%",
          end: "top 20%",
        },
      });
    },
  });

  let drawLine = gsap.timeline();

  ScrollTrigger.create({
    trigger: "#trigger-route-1",
    animation: drawLine,
    start: "-60% 0",
    end: "120% 100%",
    scrub: 4,
  });
  drawLine.fromTo(
    "#route-1",
    { drawSVG: "0%" },
    { duration: 6, drawSVG: "100%" }
  );

  //Project Info Flow
  const infoflow1TextItem = document.querySelectorAll(
    ".project-info-flow-card"
  );
  function followImageCursor(event, infoflow1TextItem) {
    const contentBox = infoflow1TextItem.getBoundingClientRect();
    const dx = event.clientX - contentBox.x;
    const dy = event.clientY - contentBox.y;
    infoflow1TextItem.children[1].style.transform = `translate(${dx}px, ${dy}px)`;
  }

  infoflow1TextItem.forEach((item, i) => {
    item.addEventListener("mousemove", (event) => {
      setInterval(followImageCursor(event, item), 100);
    });
  });

  if ($("body").not(".is-mobile").hasClass("tt-magic-cursor")) {
    if ($(window).width() > 1024) {
      gsap.config({
        nullTargetWarn: false,
        trialWarn: false,
      });
      $(".magnetic-item").wrap('<div class="magnetic-wrap"></div>');

      if ($("a.magnetic-item").length) {
        $("a.magnetic-item").addClass("not-hide-cursor");
      }

      var $mouse = { x: 0, y: 0 }; // Cursor position
      var $pos = { x: 0, y: 0 }; // Cursor position
      var $ratio = 0.15; // delay follow cursor
      var $active = false;
      var $ball = $("#ball");

      var $ballWidth = 20; // Ball default width
      var $ballHeight = 20; // Ball default height
      var $ballOpacity = 0.5; // Ball default opacity
      var $ballBorderWidth = 2; // Ball default border width

      gsap.set($ball, {
        // scale from middle and style ball
        xPercent: -50,
        yPercent: -50,
        width: $ballWidth,
        height: $ballHeight,
        borderWidth: $ballBorderWidth,
        opacity: $ballOpacity,
      });

      document.addEventListener("mousemove", mouseMove);

      function mouseMove(e) {
        $mouse.x = e.clientX;
        $mouse.y = e.clientY;
      }

      gsap.ticker.add(updatePosition);

      function updatePosition() {
        if (!$active) {
          $pos.x += ($mouse.x - $pos.x) * $ratio;
          $pos.y += ($mouse.y - $pos.y) * $ratio;

          gsap.set($ball, { x: $pos.x, y: $pos.y });
        }
      }

      $(".magnetic-wrap").mousemove(function (e) {
        parallaxCursor(e, this, 2); // magnetic ball = low number is more attractive
        callParallax(e, this);
      });

      function callParallax(e, parent) {
        parallaxIt(e, parent, parent.querySelector(".magnetic-item"), 25); // magnetic area = higher number is more attractive
      }

      function parallaxIt(e, parent, target, movement) {
        var boundingRect = parent.getBoundingClientRect();
        var relX = e.clientX - boundingRect.left;
        var relY = e.clientY - boundingRect.top;

        gsap.to(target, {
          duration: 0.3,
          x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
          y:
            ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
          ease: Power2.easeOut,
        });
      }

      function parallaxCursor(e, parent, movement) {
        var rect = parent.getBoundingClientRect();
        var relX = e.clientX - rect.left;
        var relY = e.clientY - rect.top;
        $pos.x =
          rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
        $pos.y =
          rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
        gsap.to($ball, { duration: 0.3, x: $pos.x, y: $pos.y });
      }

      // Magic cursor behavior
      // ======================

      // Magnetic item hover.
      $(".magnetic-wrap")
        .on("mouseenter mouseover", function (e) {
          $ball.addClass("magnetic-active");
          gsap.to($ball, { duration: 0.3, width: 70, height: 70, opacity: 1 });
          $active = true;
        })
        .on("mouseleave", function (e) {
          $ball.removeClass("magnetic-active");
          gsap.to($ball, {
            duration: 0.3,
            width: $ballWidth,
            height: $ballHeight,
            opacity: $ballOpacity,
          });
          gsap.to(this.querySelector(".magnetic-item"), {
            duration: 0.3,
            x: 0,
            y: 0,
            clearProps: "all",
          });
          $active = false;
        });

      // Alternative cursor style on hover.
      $(
        ".cursor-alter, .tt-main-menu-list > li > a, .tt-main-menu-list > li > .tt-submenu-trigger > a"
      )
        .not(".magnetic-item") // omit from selection.
        .on("mouseenter", function () {
          gsap.to($ball, {
            duration: 0.3,
            borderWidth: 0,
            opacity: 0.2,
            backgroundColor: "#CCC",
            width: "90px",
            height: "90px",
          });
        })
        .on("mouseleave", function () {
          gsap.to($ball, {
            duration: 0.3,
            borderWidth: $ballBorderWidth,
            opacity: $ballOpacity,
            backgroundColor: "transparent",
            width: $ballWidth,
            height: $ballHeight,
            clearProps: "backgroundColor",
          });
        });

      // Cursor view on hover (data attribute "data-cursor="...").
      $("[data-cursor]").each(function () {
        $(this)
          .on("mouseenter", function () {
            $ball
              .addClass("ball-view")
              .append('<div class="ball-view-inner"></div>');
            $(".ball-view-inner").append($(this).attr("data-cursor"));
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -75,
              width: 82,
              height: 82,
              opacity: 1,
              borderWidth: 0,
            });
            gsap.to(".ball-view-inner", {
              duration: 0.3,
              scale: 1,
              autoAlpha: 1,
            });
          })
          .on("mouseleave", function () {
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -50,
              width: $ballWidth,
              height: $ballHeight,
              opacity: $ballOpacity,
              borderWidth: $ballBorderWidth,
            });
            $ball.removeClass("ball-view").find(".ball-view-inner").remove();
          });
        $(this).addClass("not-hide-cursor");
      });

      // Cursor drag on hover (class "cursor-drag"). For Swiper sliders.
      $(".swiper").each(function () {
        if ($(this).parent().attr("data-simulate-touch") === "true") {
          if ($(this).parent().hasClass("cursor-drag")) {
            $(this)
              .on("mouseenter", function () {
                $ball.append('<div class="ball-drag"></div>');
                gsap.to($ball, {
                  duration: 0.3,
                  width: 60,
                  height: 60,
                  opacity: 1,
                });
              })
              .on("mouseleave", function () {
                $ball.find(".ball-drag").remove();
                gsap.to($ball, {
                  duration: 0.3,
                  width: $ballWidth,
                  height: $ballHeight,
                  opacity: $ballOpacity,
                });
              });
            $(this).addClass("not-hide-cursor");

            // Ignore "data-cursor" on hover.
            $(this)
              .find("[data-cursor]")
              .on("mouseenter mouseover", function () {
                $ball.find(".ball-drag").remove();
                return false;
              })
              .on("mouseleave", function () {
                $ball.append('<div class="ball-drag"></div>');
                gsap.to($ball, {
                  duration: 0.3,
                  width: 60,
                  height: 60,
                  opacity: 1,
                });
              });
          }
        }
      });

      // Cursor drag on mouse down / click and hold effect (class "cursor-drag-mouse-down"). For Swiper sliders.
      $(".swiper").each(function () {
        if ($(this).parent().attr("data-simulate-touch") === "true") {
          if ($(this).parent().hasClass("cursor-drag-mouse-down")) {
            $(this)
              .on("mousedown pointerdown", function (e) {
                if (e.which === 1) {
                  // Affects the left mouse button only!
                  gsap.to($ball, {
                    duration: 0.2,
                    width: 60,
                    height: 60,
                    opacity: 1,
                  });
                  $ball.append('<div class="ball-drag"></div>');
                }
              })
              .on("mouseup pointerup", function () {
                $ball.find(".ball-drag").remove();
                if ($(this).find("[data-cursor]:hover").length) {
                } else {
                  gsap.to($ball, {
                    duration: 0.2,
                    width: $ballWidth,
                    height: $ballHeight,
                    opacity: $ballOpacity,
                  });
                }
              })
              .on("mouseleave", function () {
                $ball.find(".ball-drag").remove();
                gsap.to($ball, {
                  duration: 0.2,
                  width: $ballWidth,
                  height: $ballHeight,
                  opacity: $ballOpacity,
                });
              });

            // Ignore "data-cursor" on mousedown.
            $(this)
              .find("[data-cursor]")
              .on("mousedown pointerdown", function () {
                return false;
              });

            // Ignore "data-cursor" on hover.
            $(this)
              .find("[data-cursor]")
              .on("mouseenter mouseover", function () {
                $ball.find(".ball-drag").remove();
                return false;
              });
          }
        }
      });

      // Cursor close on hover.
      $(".cursor-close").each(function () {
        $(this).addClass("ball-close-enabled");
        $(this)
          .on("mouseenter", function () {
            $ball.addClass("ball-close-enabled");
            $ball.append('<div class="ball-close">Close</div>');
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -75,
              width: 80,
              height: 80,
              opacity: 1,
            });
            gsap.from(".ball-close", { duration: 0.3, scale: 0, autoAlpha: 0 });
          })
          .on("mouseleave click", function () {
            $ball.removeClass("ball-close-enabled");
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -50,
              width: $ballWidth,
              height: $ballHeight,
              opacity: $ballOpacity,
            });
            $ball.find(".ball-close").remove();
          });

        // Hover on "cursor-close" inner elements.
        $(
          ".cursor-close a, .cursor-close button, .cursor-close .tt-btn, .cursor-close .hide-cursor"
        )
          .not(".not-hide-cursor") // omit from selection (class "not-hide-cursor" is for global use).
          .on("mouseenter", function () {
            $ball.removeClass("ball-close-enabled");
          })
          .on("mouseleave", function () {
            $ball.addClass("ball-close-enabled");
          });
      });

      // ================================================================
      // Scroll between anchors
      // ================================================================

      $('a[href^="#"]')
        .not('[href$="#"]') // omit from selection
        .not('[href$="#0"]') // omit from selection
        .on("click", function () {
          var target = this.hash;

          // If fixed header position enabled.
          if ($("#tt-header").hasClass("tt-header-fixed")) {
            var $offset = $("#tt-header").height();
          } else {
            var $offset = 0;
          }

          // You can use data attribute (for example: data-offset="100") to set top offset in HTML markup if needed.
          if ($(this).data("offset") != undefined)
            $offset = $(this).data("offset");

          return false;
        });

      // Show/hide magic cursor
      // =======================

      // Hide on hover.
      $(
        "a, button, .tt-btn, .tt-form-control, .tt-form-radio, .tt-form-check, .hide-cursor"
      ) // class "hide-cursor" is for global use.
        .not(".not-hide-cursor") // omit from selection (class "not-hide-cursor" is for global use).
        .not(".cursor-alter") // omit from selection
        .not(".tt-main-menu-list > li > a") // omit from selection
        .not(".tt-main-menu-list > li > .tt-submenu-trigger > a") // omit from selection
        .on("mouseenter", function () {
          gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
        })
        .on("mouseleave", function () {
          gsap.to($ball, { duration: 0.3, scale: 1, opacity: $ballOpacity });
        });

      // Hide on click.
      $("a")
        .not('[target="_blank"]') // omit from selection.
        .not('[href^="#"]') // omit from selection.
        .not('[href^="mailto"]') // omit from selection.
        .not('[href^="tel"]') // omit from selection.
        .not(".lg-trigger") // omit from selection.
        .not(".video-player") // omit from selection.
        .not(".tt-btn-disabled") // omit from selection.
        .on("click", function () {
          gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
        });

      // Show/hide on document leave/enter.
      $(document)
        .on("mouseleave", function () {
          gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
        })
        .on("mouseenter", function () {
          gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
        });

      // Show as the mouse moves.
      $(document).mousemove(function () {
        gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
      });
    }
  }

  // Back To Top
  $(document).ready(function () {
    "use strict";
    var progressPath = document.querySelector(
      ".progress-wrap .progress-circle path"
    );
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "none";
    progressPath.style.strokeDasharray = pathLength + " " + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "stroke-dashoffset 10ms linear";
    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;
    };
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 50;
    var duration = 550;
    jQuery(window).on("scroll", function () {
      if (jQuery(this).scrollTop() > offset) {
        jQuery(".progress-wrap").addClass("active-progress");
      } else {
        jQuery(".progress-wrap").removeClass("active-progress");
      }
    });
    jQuery(".progress-wrap").on("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // BTN Hover
  // $(".btn-hover")
  //   .on("mouseenter", function (e) {
  //     var parentOffset = $(this).offset(),
  //       relX = e.pageX - parentOffset.left,
  //       relY = e.pageY - parentOffset.top;
  //     $(this).find("span").css({ top: 0, left: 0 });
  //     $(this).find("span").css({ top: relY, left: relX });
  //   })
  //   .on("mouseout", function (e) {
  //     var parentOffset = $(this).offset(),
  //       relX = e.pageX - parentOffset.left,
  //       relY = e.pageY - parentOffset.top;
  //     $(this).find("span").css({ top: 0, left: 0 });
  //     $(this).find("span").css({ top: relY, left: relX });
  //   });

  // All Buttons
  let arr1 = gsap.utils.toArray("#btn_wrapper");
  let arr2 = gsap.utils.toArray(".btn_wrapper");
  const all_buttons = arr1.concat(arr2);

  all_buttons.forEach((btn) => {
    if (!btn.classList.contains("banner-btn")) {
      gsap.from(btn, {
        scrollTrigger: {
          trigger: btn,
          start: "top center+=150",
          markers: false,
        },
        opacity: 0,
        y: -70,
        ease: "bounce",
        duration: 1.5,
      });
    }
  });

  let arr3 = gsap.utils.toArray("#bounce_up");
  let arr4 = gsap.utils.toArray(".bounce_up");
  const all_buttons2 = arr3.concat(arr4);

  all_buttons2.forEach((btn) => {
    if (!btn.classList.contains("banner-btn")) {
      gsap.from(btn, {
        scrollTrigger: {
          trigger: btn,
          start: "top center+=450",
          markers: false,
        },
        opacity: 0,
        y: 50,
        ease: "bounce",
        duration: 1.5,
      });
    }
  });

  if ($(".marquee_text").length) {
    $(".marquee_text").marquee({
      direction: "left",
      duration: 55000,
      gap: 50,
      delayBeforeStart: 0,
      duplicated: true,
      startVisible: true,
    });
  }
  if ($(".marquee_text2").length) {
    $(".marquee_text2").marquee({
      direction: "left",
      duration: 25000,
      gap: 50,
      delayBeforeStart: 0,
      duplicated: true,
      startVisible: true,
    });
  }
  
})(jQuery);

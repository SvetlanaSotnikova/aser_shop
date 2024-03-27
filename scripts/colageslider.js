document.addEventListener("DOMContentLoaded", function() {
  var $slider = $(".carousel-collage .slider-collage");
  $slider.slick({
    centerMode: false,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          arrows: false,
          centerMode: false,
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1920,
        settings: {
          arrows: false,
          centerMode: false,
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1400,
        settings: {
          arrows: false,
          centerMode: false,
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: false,
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: false,
          slidesToShow: 1
        }
      }
    ]
  });
  $(".slick-prev").click(function() {
    $slider.slick("slickPrev");
  });

  $(".slick-next").click(function() {
    $slider.slick("slickNext");
  });
});

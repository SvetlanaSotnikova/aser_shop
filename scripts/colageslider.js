
const slider = document.querySelector('.slider-collage');  //new_slider
document.addEventListener("DOMContentLoaded", function() {
    /*const slider = document.querySelector('.slider-collage');*/  //prishlosi
    const prevButton = document.querySelector('.slick-prev');
    const nextButton = document.querySelector('.slick-next');
    const step = 427; 
    // const activeStep = document.querySelector('.aсtive-slider');
    const activeStep = 427;
    let currentIndex = 0; 

    function scrollToCurrentSlide() {
        const currentSlideLeftOffset = currentIndex * activeStep;
        slider.scrollTo({
            left: currentSlideLeftOffset,
            behavior: 'smooth'
        });
    }

    prevButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            slider.children[currentIndex].classList.remove('active-slider');
            currentIndex--;
            slider.children[currentIndex].classList.add('active-slider');
            scrollToCurrentSlide();
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentIndex < slider.children.length - 1) {
            slider.children[currentIndex].classList.remove('active-slider');
            currentIndex++;
            slider.children[currentIndex].classList.add('active-slider');
            scrollToCurrentSlide();
        }
    });

    scrollToCurrentSlide();

    //new_slider
    var functmove = function(event)
    {
        slider.scrollLeft-=event.movementX;
    };

    slider.addEventListener('mousedown',function ()
    {
        document.addEventListener('mousemove',functmove);

        slider.children[currentIndex].classList.remove('active-slider');        
    });
    slider.addEventListener('mouseup',function ()
    {
        document.removeEventListener('mousemove',functmove);

        currentIndex=Math.round(slider.scrollLeft/activeStep);
        slider.children[currentIndex].classList.add('active-slider');
        scrollToCurrentSlide();        
    });
});


// document.addEventListener("DOMContentLoaded", function() {
//     const slider = document.querySelector('.slider-collage');
//     const prevButton = document.querySelector('.slick-prev');
//     const nextButton = document.querySelector('.slick-next');
//     const step = 427; 
//     // const activeStep = document.querySelector('.aсtive-slider');
//     const activeStep = 427;
//     let currentIndex = 0; 

//     function scrollToCurrentSlide() {
//         const currentSlideLeftOffset = currentIndex * activeStep;
//         slider.scrollTo({
//             left: currentSlideLeftOffset,
//             behavior: 'smooth'
//         });
//     }

//     prevButton.addEventListener('click', function() {
//         if (currentIndex > 0) {
//             slider.children[currentIndex].classList.remove('active-slider');
//             currentIndex--;
//             slider.children[currentIndex].classList.add('active-slider');
//             scrollToCurrentSlide();
//         }
//     });

//     nextButton.addEventListener('click', function() {
//         if (currentIndex < slider.children.length - 1) {
//             slider.children[currentIndex].classList.remove('active-slider');
//             currentIndex++;
//             slider.children[currentIndex].classList.add('active-slider');
//             scrollToCurrentSlide();
//         }
//     });

//     scrollToCurrentSlide();
// });

  

// document.addEventListener("DOMContentLoaded", function() {
//   var $slider = $(".carousel-collage .slider-collage");
//   $slider.slick({
//     centerMode: false,
//     slidesToShow: 3,
//     responsive: [
//       {
//         breakpoint: 2560,
//         settings: {
//           arrows: false,
//           centerMode: false,
//           slidesToShow: 3
//         }
//       },
//       {
//         breakpoint: 1920,
//         settings: {
//           arrows: false,
//           centerMode: false,
//           slidesToShow: 3
//         }
//       },
//       {
//         breakpoint: 1400,
//         settings: {
//           arrows: false,
//           centerMode: false,
//           slidesToShow: 3
//         }
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           arrows: false,
//           centerMode: false,
//           slidesToShow: 3
//         }
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           arrows: false,
//           centerMode: false,
//           slidesToShow: 1
//         }
//       }
//     ]
//   });
//   $(".slick-prev").click(function() {
//     $slider.slick("slickPrev");
//   });

//   $(".slick-next").click(function() {
//     $slider.slick("slickNext");
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
    const boxes = document.querySelectorAll('.box');
  
    function checkScroll() {
      boxes.forEach(box => {
        if (isElementInViewport(box)) {
          box.classList.remove('hidden');
        } else {
          box.classList.add('hidden');
        }
      });
    }
  
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    checkScroll();
    window.addEventListener('scroll', checkScroll);
  });
  
(function() {
  console.log('Script Loaded');
  const header = document.querySelector('.header');
  const navBar = document.querySelector('.nav-bar');
  const originalNavOffset = navBar.offsetTop;
  const clearButton = document.querySelector('.clear-button');

  // Set Fixed class to nav bar
  function handleScroll() {
    if (pageYOffset >= originalNavOffset) {
      return header.classList.add('fixed-nav');
    }
    header.classList.remove('fixed-nav');
  }

  window.addEventListener('scroll', handleScroll);
  if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
    window.addEventListener("mousewheel", function (event) {
      // remove default behavior
      event.preventDefault();

      //scroll without smoothing
      var wheelDelta = event.wheelDelta;
      var currentScrollPosition = window.pageYOffset;
      window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
  }

  window.onkeydown = function (e) {
    if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault();
        console.log('Save?');
    }
  }
  if (clearButton) {
    clearButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.target.parentNode.remove();
    })
  }
})();

(function() {
  document.querySelector('.body').classList.remove('no-js');
  const header = document.querySelector('.header');
  const navBar = document.querySelector('.nav-bar');
  const originalNavOffset = navBar.offsetTop;
  const clearButton = document.querySelector('.clear-button');
  const dropdownLink = document.querySelector('.dropdown-link');
  const animate = document.querySelectorAll('.animate');

  // Set Fixed class to nav bar
  function handleFixedNav() {
    if (pageYOffset >= originalNavOffset) {
      return header.classList.add('fixed-nav');
    }
    header.classList.remove('fixed-nav');
  }

  // Set animation Class on animate elements
  function handleAnimation() {
    let viewportHeight = window.innerHeight;
    for (var i = 0; i < animate.length; i += 1) {
      let elementOffset = animate[i].getBoundingClientRect().top;
      if (elementOffset + 100 < viewportHeight) {
        animate[i].classList.add('animate-in')
      }
    }
  }

  function handleScroll() {
    handleFixedNav();
    handleAnimation();
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
  if (dropdownLink) {
    dropdownLink.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('clicked', e.target);
      dropdownLink.parentNode.classList.toggle('closed');
    })
  }

})();

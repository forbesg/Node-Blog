(function() {
  console.log('Script Loaded');
  const header = document.querySelector('.header');
  const navBar = document.querySelector('.nav-bar');
  const originalNavOffset = navBar.offsetTop;
  window.onscroll = () => {
    if (pageYOffset >= originalNavOffset) {
      return header.classList.add('fixed-nav');
    }
    header.classList.remove('fixed-nav');
  }
})();

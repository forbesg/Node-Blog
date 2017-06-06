(function() {
  console.log('Script Loaded');
  const header = document.querySelector('.header');
  window.onscroll = () => {
    if (pageYOffset >= 202) {
      return header.classList.add('fixed-nav');
    }
    header.classList.remove('fixed-nav');
  }
})();

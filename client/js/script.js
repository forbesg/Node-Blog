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
  window.onkeydown = (e) => {
    if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault();
        console.log('Save?');
    }
  }
})();

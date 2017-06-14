(function() {
  console.log('Script Loaded');
  const header = document.querySelector('.header');
  const navBar = document.querySelector('.nav-bar');
  const originalNavOffset = navBar.offsetTop;
  const clearButton = document.querySelector('.clear-button');
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
  if (clearButton) {
    clearButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.target.parentNode.remove();
    })
  }
})();

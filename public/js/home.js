let slideIndex = 1;

function showDivs() {
  let i;
  const x = document.getElementsByClassName('mySlides');
  if (slideIndex > x.length) { slideIndex = 1; }
  if (slideIndex < 1) { slideIndex = x.length; }
  for (i = 0; i < x.length; i += 1) {
    x[i].style.display = 'none';
  }
  x[slideIndex - 1].style.display = 'block';
  slideIndex += 1;
  setTimeout(showDivs, 5000);
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.classList.toggle('joss', window.scrollY > 40);
});

let lastScrollTop = 0;
const navbar = document.querySelector('header');
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document
    .documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    navbar.style.top = '-100%';
  } else {
    navbar.style.top = '0';
  }
  if (scrollTop > 150){
    document.getElementById('componen1').style.animation = "animateblok 2s";
    document.getElementById('componen2').style.animation = "animateblok2 2s";
  }
  lastScrollTop = scrollTop;
});

showDivs(slideIndex);

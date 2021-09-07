'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//////////////////////////

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//button scrolling

btnScrollTo.addEventListener('click', function () {
  // const section1Pos = section1.getBoundingClientRect();
  // console.log(section1Pos)

  //Old school way

  // window.scrollTo(section1Pos.x + window.pageXOffset, section1Pos.y + window.pageYOffset)
  // console.log(window.pageYOffset)

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation

//Not effecient way

// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const  id = el.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//   })
// })

// the correct way of page navigation .. using event delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  e.target.className == 'nav__link' &&
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
});

// Creating tab component

const mainTab = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const content = document.querySelectorAll('.operations__content');

mainTab.addEventListener('click', function (e) {
  if (e.target.classList.contains('operations__tab-container')) return;

  const clickedBtn = e.target.closest('.operations__tab');
  // console.log(clickedBtn);

  //removing classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  content.forEach(c => c.classList.remove('operations__content--active'));

  // adding styled class
  clickedBtn.classList.add('operations__tab--active');

  // showing content
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// nav item fade up implementing

const nav = document.querySelector('.nav');
const handleHover = function (e) {
  const hoverd = e.target;
  if (!hoverd.classList.contains('nav__link')) return;

  const links = hoverd.closest('.nav').querySelectorAll('.nav__link');
  const logo = hoverd.closest('.nav').querySelector('img');
  links.forEach(link => link === hoverd || (link.style.opacity = this));
  logo.style.opacity = this;
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// sticky navbar

// this is not the correct way

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.pageYOffset > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// the correct one

const header = document.querySelector('.header');

const obsCallback = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry);
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
};

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

// revealing section effect

const sections = document.querySelectorAll('.section');
const secObsCallback = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry)
  if(entry.isIntersecting) entry.target.classList.remove('section--hidden')
  console.log(entry)
}

const secObsOptions = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(secObsCallback, secObsOptions);

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images

const images = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  console.log(entry);

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load',function() {
    this.classList.remove('lazy-img');
    observer.unobserver(entry.target);
  })

}


const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15
})

images.forEach(img => imageObserver.observe(img));


// Slider 

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
 
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();


// Practicing

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'Do you like to use our cookie policy <button class="yes-button btn"> Yes<button> <button class="No-button">No </button>';

document.querySelector('.header').append(message);

// message.style.width  = Number.parseFloat(getComputedStyle(message).width, 10) + 100 + "px" ;

message.style.fontWeight = Number(getComputedStyle(message).fontWeight) + 500;
// console.log(message.style.fontWeight);

// document.documentElement.style.setProperty('--color-primary', 'red');

message.style.setProperty('width', '120%');
message.remove();
// if(window.pageYOffset >= 200) {
//   console.log('success')
// }

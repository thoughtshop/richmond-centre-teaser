import 'intersection-observer';
import Rellax from 'rellax';
import forEach from 'lodash/forEach';

const pageReady = () => {
  const sections = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((sections) => {
    forEach(sections, (section) => {
      if (section.isIntersecting) {
        section.target.classList.add('in-viewport');
      }
    });
  }, {
    threshold: 0.4
  });

  forEach(sections, (section) => {
    observer.observe(section);
  });

  const rellax = new Rellax('.rellax');
};

if (
  document.readyState === 'complete'
  || (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  pageReady();
} else {
  document.addEventListener('DOMContentLoaded', pageReady);
}

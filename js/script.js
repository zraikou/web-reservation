
// Main JavaScript for the index.html page
document.addEventListener('DOMContentLoaded', function() {
  // This file contains general functionality for the homepage
  console.log('Homepage loaded');
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Animate elements when they come into view
  const animateElements = document.querySelectorAll('.service-card, .about-image, .about-text, .testimonial');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
});

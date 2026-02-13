/**
 * Lazy Loading Images Script
 * Improves page load performance by loading images only when needed
 */

(function() {
  'use strict';
  
  // Check if browser supports Intersection Observer
  if ('IntersectionObserver' in window) {
    // Use Intersection Observer for modern browsers
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    function loadImage(img) {
      const src = img.dataset.src;
      if (!src) return;
      
      // Create a temporary image to preload
      const tempImg = new Image();
      tempImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
      tempImg.onerror = () => {
        img.classList.add('error');
      };
      tempImg.src = src;
    }
    
    function setupLazyLoading() {
      // Find all images with data-src attribute
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
      
      // Also handle images in markdown content that don't have data-src
      const contentImages = document.querySelectorAll('#markdown-container img:not([data-src])');
      contentImages.forEach(img => {
        if (!img.classList.contains('no-lazy')) {
          // Add lazy loading attribute
          img.loading = 'lazy';
          img.classList.add('lazy-native');
        }
      });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupLazyLoading);
    } else {
      setupLazyLoading();
    }
    
  } else {
    // Fallback for older browsers - use native lazy loading
    document.addEventListener('DOMContentLoaded', () => {
      const images = document.querySelectorAll('#markdown-container img');
      images.forEach(img => {
        img.loading = 'lazy';
      });
    });
  }
  
  // Add fade-in animation when images load
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
      img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease-in;
      }
      img.loaded, img.lazy-native {
        opacity: 1;
      }
      img.error {
        opacity: 0.5;
        filter: grayscale(100%);
      }
    `;
    document.head.appendChild(style);
  });
  
})();

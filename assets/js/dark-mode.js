/**
 * Dark Mode Toggle Script
 * Manages theme switching and persistence
 */

(function() {
  'use strict';
  
  const THEME_KEY = 'theme-preference';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  
  // Get theme preference
  function getThemePreference() {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }
    
    return LIGHT_THEME;
  }
  
  // Set theme
  function setTheme(theme) {
    if (theme === DARK_THEME) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
  }
  
  // Toggle theme
  function toggleTheme() {
    const current = getThemePreference();
    const next = current === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(next);
    
    // Update button aria-label
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', 
        next === DARK_THEME ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }
  
  // Initialize theme on page load (before DOM ready to prevent flash)
  setTheme(getThemePreference());
  
  // Wait for DOM to be ready
  function initThemeToggle() {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 
      getThemePreference() === DARK_THEME ? 'Switch to light mode' : 'Switch to dark mode'
    );
    toggleBtn.innerHTML = `
      <span class="icon sun-icon">☀️</span>
      <span class="icon moon-icon">🌙</span>
    `;
    
    // Add click handler
    toggleBtn.addEventListener('click', toggleTheme);
    
    // Add to page
    document.body.appendChild(toggleBtn);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

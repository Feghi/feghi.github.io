/**
 * PWA Registration Script
 * Registers service worker and handles installation prompt
 */

(function() {
  'use strict';
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registered: ', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60); // Check every hour
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
  
  // Handle install prompt
  let deferredPrompt;
  const installButton = document.createElement('button');
  installButton.className = 'pwa-install-button hidden';
  installButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
    </svg>
    <span>앱 설치</span>
  `;
  
  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button
    showInstallButton();
  });
  
  function showInstallButton() {
    installButton.classList.remove('hidden');
    document.body.appendChild(installButton);
    
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) {
        return;
      }
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      // Clear the saved prompt since it can't be used again
      deferredPrompt = null;
      
      // Hide the install button
      installButton.classList.add('hidden');
    });
  }
  
  // Detect if app is installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installButton.classList.add('hidden');
  });
  
  // Detect if running as PWA
  function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
  }
  
  if (isPWA()) {
    console.log('Running as PWA');
    document.documentElement.classList.add('pwa-mode');
  }
  
  // Add PWA install button styles
  const style = document.createElement('style');
  style.textContent = `
    .pwa-install-button {
      position: fixed;
      bottom: 90px;
      right: 30px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      z-index: 999;
    }
    
    .pwa-install-button:hover {
      background-color: #218838;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
    
    .pwa-install-button:active {
      transform: translateY(0);
    }
    
    .pwa-install-button.hidden {
      display: none;
    }
    
    .pwa-install-button svg {
      flex-shrink: 0;
    }
    
    @media (max-width: 768px) {
      .pwa-install-button {
        bottom: 75px;
        right: 20px;
        padding: 10px 16px;
        font-size: 13px;
      }
      
      .pwa-install-button svg {
        width: 18px;
        height: 18px;
      }
    }
    
    /* Adjust theme toggle position when install button is visible */
    body:has(.pwa-install-button:not(.hidden)) .theme-toggle {
      bottom: 150px;
    }
    
    @media (max-width: 768px) {
      body:has(.pwa-install-button:not(.hidden)) .theme-toggle {
        bottom: 130px;
      }
    }
  `;
  document.head.appendChild(style);
  
})();

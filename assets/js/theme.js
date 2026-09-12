// Run before stylesheets to avoid a flash. Storage is optional (private browsing).
(function () {
  'use strict';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  try { preference = localStorage.getItem('fe-theme'); } catch (_) {}
  if (preference !== 'light' && preference !== 'dark') preference = null;
  function apply() {
    var theme = preference || (media.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    var button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
      button.querySelector('[data-theme-label]').textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
    var comments = document.querySelector('.utterances-frame');
    if (comments) comments.contentWindow.postMessage({type: 'set-theme', theme: 'github-' + theme}, 'https://utteranc.es');
  }
  apply();
  if (media.addEventListener) media.addEventListener('change', apply);
  window.addEventListener('storage', function (event) {
    if (event.key === 'fe-theme' || event.key === null) {
      preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
      apply();
    }
  });
  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var button = document.querySelector('[data-theme-toggle]');
    if (button) button.addEventListener('click', function () {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('fe-theme', preference); } catch (_) {}
      apply();
    });
  });
  window.addEventListener('message', function (event) {
    if (event.origin === 'https://utteranc.es' && event.data && event.data.type === 'resize') apply();
  });
}());

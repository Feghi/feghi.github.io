(function () {
  'use strict';
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-result');
  var wrapper = document.getElementById('search-result-wrapper');
  if (!input || !results || !window.SimpleJekyllSearch) return;
  var search;
  var failed = false;
  function update() {
    var query = input.value.trim();
    wrapper.hidden = !query;
    if (!query) { results.textContent = ''; return; }
    if (search) search.search(query);
    else results.textContent = failed ? 'Search could not load. Please browse Categories or reload the page.' : 'Loading search…';
  }
  // Load first so a query typed before the index arrives is replayed, not lost.
  fetch(document.currentScript.dataset.searchUrl)
    .then(function (response) {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    })
    .then(function (posts) {
      search = window.SimpleJekyllSearch({
        searchInput: input, resultsContainer: results, json: posts,
        searchResultTemplate: '<p><a href="{url}">{title}</a></p>'
      });
      update();
    })
    .catch(function () { failed = true; update(); });
  // The bundled library listens to keyup; input also covers paste and mobile keyboards.
  input.addEventListener('input', update);
}());

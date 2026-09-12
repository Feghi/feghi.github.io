// Progressive enhancement: cards and book statistics are rendered by Jekyll.
(function () {
  'use strict';
  var browser = document.querySelector('[data-archive-browser]');
  if (!browser) return;
  var entries = Array.from(browser.querySelectorAll('[data-entry]'));
  if (!entries.length) return;
  var query = browser.querySelector('[data-archive-query]');
  var year = browser.querySelector('[data-archive-year]');
  var type = browser.querySelector('[data-archive-type]');
  var result = browser.querySelector('[data-result-count]');
  var empty = browser.querySelector('[data-no-results]');
  function normalize(value) { return value.normalize('NFKC').toLocaleLowerCase().trim(); }
  var searchText = entries.map(function (entry) { return normalize(entry.dataset.search); });
  function options(select, values) {
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value; option.textContent = value;
      select.appendChild(option);
    });
  }
  options(year, Array.from(new Set(entries.map(function (entry) { return entry.dataset.year; }))).sort().reverse());
  if (type) options(type, Array.from(new Set(entries.map(function (entry) { return entry.dataset.type; }))).sort());
  function filter() {
    var terms = normalize(query.value).split(/\s+/).filter(Boolean);
    var count = 0;
    entries.forEach(function (entry, index) {
      var matches = (!year.value || entry.dataset.year === year.value) &&
        (!type || !type.value || entry.dataset.type === type.value) &&
        terms.every(function (term) { return searchText[index].includes(term); });
      entry.hidden = !matches;
      if (matches) count++;
    });
    result.textContent = 'Showing ' + count + ' of ' + entries.length + ' entries';
    empty.hidden = count !== 0;
  }
  function restore() {
    var params = new URLSearchParams(window.location.search);
    query.value = params.get('q') || '';
    year.value = params.get('year') || '';
    if (type) type.value = params.get('type') || '';
    filter();
  }
  function update() {
    filter();
    var url = new URL(window.location.href);
    [['q', query.value.trim()], ['year', year.value], ['type', type ? type.value : '']].forEach(function (pair) {
      if (pair[1]) url.searchParams.set(pair[0], pair[1]);
      else url.searchParams.delete(pair[0]);
    });
    // Keep filters bookmarkable without creating a history entry per keystroke.
    window.history.replaceState(null, '', url);
  }
  query.addEventListener('input', update);
  year.addEventListener('change', update);
  if (type) type.addEventListener('change', update);
  browser.querySelector('[data-clear-filters]').addEventListener('click', function () {
    query.value = ''; year.value = ''; if (type) type.value = '';
    update(); query.focus();
  });
  window.addEventListener('popstate', restore);
  browser.querySelector('[data-filters]').hidden = false;
  restore();
}());

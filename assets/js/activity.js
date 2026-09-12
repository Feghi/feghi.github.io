(function () {
  'use strict';
  var panel = document.querySelector('[data-activity]');
  var source = document.getElementById('activity-posts');
  if (!panel || !source) return;
  var posts = JSON.parse(source.textContent);
  var byDate = new Map();
  posts.forEach(function (post) {
    if (!byDate.has(post.date)) byDate.set(post.date, []);
    byDate.get(post.date).push(post);
  });
  var currentYear = Number(panel.dataset.currentYear);
  var years = Array.from(new Set([currentYear].concat(posts.map(function (post) { return Number(post.date.slice(0, 4)); })))).sort(function (a, b) { return b - a; });
  var select = panel.querySelector('[data-activity-year]');
  var grid = panel.querySelector('.heatmap-grid');
  var months = panel.querySelector('.heatmap-months');
  var selection = panel.querySelector('[data-activity-selection]');
  years.forEach(function (year) { select.add(new Option(year, year)); });
  select.value = currentYear;
  function showPosts(date, entries) {
    selection.replaceChildren();
    var heading = document.createElement('h3');
    heading.textContent = date + ' · ' + entries.length + ' posts';
    selection.appendChild(heading);
    var list = document.createElement('ul');
    entries.forEach(function (entry) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = entry.url; link.textContent = entry.title;
      item.appendChild(link); list.appendChild(item);
    });
    selection.appendChild(list); selection.hidden = false;
    selection.querySelector('a').focus({preventScroll: true});
  }
  function render() {
    var year = Number(select.value);
    // UTC arithmetic avoids DST shifts and preserves Jekyll's serialized dates.
    var first = new Date(Date.UTC(year, 0, 1));
    var end = new Date(Date.UTC(year + 1, 0, 1));
    var days = (end - first) / 86400000;
    var offset = first.getUTCDay();
    var weeks = Math.ceil((offset + days) / 7);
    grid.style.setProperty('--weeks', weeks); months.style.setProperty('--weeks', weeks);
    grid.replaceChildren(); months.replaceChildren(); selection.hidden = true;
    var total = 0; var activeDays = 0;
    for (var index = 0; index < offset; index++) {
      var spacer = document.createElement('span');
      spacer.setAttribute('aria-hidden', 'true'); grid.appendChild(spacer);
    }
    for (var day = 0; day < days; day++) {
      var date = new Date(first.getTime() + day * 86400000);
      var key = date.toISOString().slice(0, 10);
      var entries = byDate.get(key) || [];
      total += entries.length;
      if (entries.length) activeDays++;
      if (date.getUTCDate() === 1) {
        var month = document.createElement('span');
        month.textContent = date.toLocaleString('en', {month: 'short', timeZone: 'UTC'});
        month.style.gridColumn = Math.floor((offset + day) / 7) + 1;
        months.appendChild(month);
      }
      var cell = document.createElement(entries.length === 1 ? 'a' : entries.length > 1 ? 'button' : 'span');
      cell.className = 'heatmap-cell'; cell.dataset.date = key;
      cell.dataset.level = Math.min(entries.length, 4);
      cell.title = key + ' · ' + entries.length + (entries.length === 1 ? ' post' : ' posts');
      cell.setAttribute('aria-label', cell.title);
      if (entries.length === 1) cell.href = entries[0].url;
      if (entries.length > 1) {
        cell.type = 'button'; cell.addEventListener('click', showPosts.bind(null, key, entries));
      }
      grid.appendChild(cell);
    }
    panel.querySelector('[data-activity-summary]').textContent = total + (total === 1 ? ' post' : ' posts') + ' across ' + activeDays + (activeDays === 1 ? ' active day in ' : ' active days in ') + year;
  }
  panel.querySelector('.year-picker').hidden = false;
  panel.querySelector('.heatmap-scroll').hidden = false;
  panel.querySelector('.activity-key').hidden = false;
  select.addEventListener('change', render); render();
}());

// Usage: node _checks/compatibility.cjs <baseline-output> [current-output]
// Same content/config, except the old blank origin is now the production URL.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const baseline = path.resolve(process.argv[2]);
const current = path.resolve(process.argv[3] || '_site');
const origin = 'https://feghi.github.io';
function files(root, dir = '') {
  return fs.readdirSync(path.join(root, dir), {withFileTypes: true}).flatMap(entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? files(root, name) : [name];
  });
}
const oldFiles = files(baseline);
const newFiles = new Set(files(current));
assert.deepEqual(oldFiles.filter(file => !newFiles.has(file)), [], 'An existing output route/file disappeared');
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
let articles = 0;
for (const file of oldFiles.filter(file => file.endsWith('.html'))) {
  const before = read(baseline, file);
  const after = read(current, file);
  const article = /<div id="markdown-container"[\s\S]*?(?=<div id="markdown-outline")/;
  if (article.test(before)) {
    assert.equal(after.match(article)?.[0], before.match(article)[0], `Article changed: ${file}`);
    articles++;
  }
  const comment = /<script src="https:\/\/utteranc.es\/client.js"[\s\S]*?<\/script>/;
  if (comment.test(before)) assert.equal(after.match(comment)?.[0], before.match(comment)[0], `Comments changed: ${file}`);
}
for (const file of ['feed.xml', 'search.json']) {
  // Normalize only URL elements and channel timestamps, never item content/dates.
  const normalize = text => file === 'feed.xml' ? text.replace(/<pubDate>.*?<\/pubDate>/, '<pubDate>BUILD_TIME</pubDate>').replace(/<lastBuildDate>.*?<\/lastBuildDate>/, '<lastBuildDate>BUILD_TIME</lastBuildDate>')
    .replace(/(<(?:link|guid)(?:\s[^>]*)?>)([^<]+)(<\/)/g, (_, start, url, end) => start + url.replace(origin, '') + end)
    .replace(/(<atom:link href=")([^"]+)/g, (_, start, url) => start + url.replace(origin, '')).trimEnd() : text;
  assert.equal(normalize(read(current, file)), normalize(read(baseline, file)), `${file} changed`);
}
const sitemapURLs = root => [...read(root, 'sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).sort();
const currentURLs = new Set(sitemapURLs(current));
assert.deepEqual(sitemapURLs(baseline).filter(url => !currentURLs.has(url.startsWith('/') ? origin + url : url)), [], 'An existing sitemap URL disappeared');
const feed = read(current, 'feed.xml');
const feedURLs = [...feed.matchAll(/<(?:link|guid)(?:\s[^>]*)?>([^<]+)<\//g)].map(match => match[1]);
feedURLs.push(...[...feed.matchAll(/<atom:link href="([^"]+)"/g)].map(match => match[1]));
assert.ok(feedURLs.length >= 4, 'RSS URLs missing');
for (const url of [...feedURLs, ...currentURLs]) {
  assert.ok(url.startsWith(origin + '/'), `Non-production URL: ${url}`);
  assert.equal(url.indexOf(origin, origin.length), -1, `Duplicated origin: ${url}`);
}
const pages = ['index.html', ...oldFiles.filter(file => /^page\d+[\\/]index.html$/.test(file))];
for (const file of pages) {
  const oldLinks = [...read(baseline, file).matchAll(/class="title">\s*<a href="([^"]+)"/g)].map(match => match[1]);
  const newLinks = [...read(current, file).matchAll(/class="content-card">\s*<a href="([^"]+)"/g)].map(match => match[1]);
  assert.ok(oldLinks.length, `No baseline posts found: ${file}`);
  assert.deepEqual(newLinks, oldLinks, `Pagination entries changed: ${file}`);
}
console.log(`PASS: ${oldFiles.length} existing files retained; ${articles} article bodies and comment mappings unchanged; RSS/search/sitemap preserved; ${pages.length} pagination pages retain their entries.`);

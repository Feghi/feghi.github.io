# Run with: bundle exec ruby _checks/archive.rb
# Build isolated fixture sites; never write to the real _posts or output directory.
require 'jekyll'
require 'tmpdir'
require 'fileutils'
require 'yaml'
Jekyll::PluginManager.require_from_bundler

ROOT = File.expand_path('..', __dir__)

def assert(condition, message)
  raise message unless condition
end

def write_document(source, folder, name, metadata)
  FileUtils.mkdir_p(File.join(source, folder))
  File.write(File.join(source, folder, name), "#{metadata.to_yaml}---\n\n# Fixture heading\n\nFixture body, not a real archive entry.\n")
end

def fixture_site(populated)
  Dir.mktmpdir('feghi-archive-check-') do |temporary|
    source = File.join(temporary, 'source')
    output = File.join(temporary, 'output')
    FileUtils.mkdir_p(source)
    %w[_layouts _includes _sass _data archive].each { |name| FileUtils.cp_r(File.join(ROOT, name), source) }
    FileUtils.cp(File.join(ROOT, 'index.html'), source)
    FileUtils.mkdir_p(File.join(source, 'assets'))
    FileUtils.cp_r(File.join(ROOT, 'assets/css'), File.join(source, 'assets'))
    if populated
      cases = [
        ['alpha', {'type' => 'book', 'book' => {'title' => 'A <B> & "C"', 'author' => 'Author <script>', 'rating' => 4.5, 'genre' => 'Fiction', 'medium' => 'Paper', 'finished' => '2024-02-29'}}],
        ['zero', {'type' => 'book', 'book' => {'rating' => 0, 'finished' => 'not-a-date'}}],
        ['five', {'type' => 'book', 'book' => {'rating' => 5, 'finished' => '2023-06-01'}}],
        ['legacy', {'tags' => ['독후감']}],
        ['invalid', {'type' => 'book', 'book' => {'rating' => 'unknown'}}],
        ['range', {'type' => 'book', 'book' => {'rating' => 6}}],
        ['override', {'type' => 'recipe', 'tags' => ['독후감']}]
      ]
      cases.each { |name, data| write_document(source, '_posts', "2025-01-01-#{name}.md", data) }
      write_document(source, '_notes', 'public.md', {'type' => 'book', 'date' => '2025-01-01', 'book' => {'rating' => 3, 'finished' => '2022-01-01'}})
      write_document(source, '_notes', 'untyped.md', {'title' => 'Untyped series note', 'date' => '2025-01-01'})
      write_document(source, '_private_notes', 'private.md', {'type' => 'book', 'date' => '2025-01-01', 'book' => {'rating' => 1}})
    end
    Dir.chdir(source) do
      config = Jekyll.configuration(
        'config' => File.join(ROOT, '_config.yml'), 'source' => source, 'destination' => output,
        'baseurl' => '/preview', 'url' => 'https://example.test',
        'collections' => {'notes' => {'output' => true}, 'private_notes' => {'output' => false}}
      )
      Jekyll::Site.new(config).process
    end
    yield output
  end
end

def html(output, route)
  File.read(File.join(output, route, 'index.html'))
end

def stat_values(html)
  html.scan(/<dt>(.*?)<\/dt>\s*<dd>(.*?)<\/dd>/).to_h
end

fixture_site(true) do |output|
  books = html(output, 'archive/books')
  all = html(output, 'archive')
  stats = stat_values(books)
  assert(stats['Total books'] == '7', "Expected seven public books: #{stats}")
  assert(stats['Average rating'] == '3.13', "Zero/decimal ratings must count: #{stats}")
  assert(stats['Rated books'] == '4', 'Missing, invalid, out-of-range ratings must be excluded')
  assert(stats['Reading years'] == '4', 'Finished years must override post years')
  assert(all.scan(/data-entry data-type=/).size == 8, 'Archive must include each public entry once')
  assert(!all.include?('/notes/untyped') && !all.include?('/private_notes/'), 'Untyped series and non-output collections must not leak into Archive')
  assert(books.include?('data-book-year="2025"') && books.include?('data-book-year="2024"'), 'Fallback and completion years must render')
  assert(books.match?(/data-book-year="2025".*?<td>4<\/td>/), 'Missing/invalid completion dates must use post year')
  [0, 3, 4, 5].each do |bucket|
    assert(books.match?(/data-rating-bucket="#{bucket}".*?<td>1<\/td>/), "Wrong rating bucket #{bucket}")
  end
  assert(html(output, 'archive/recipes').scan(/data-entry data-type=/).size == 1, 'Explicit type must override legacy book tag')
  assert(html(output, 'archive/mystery').include?('아직 기록이 없습니다.'), 'Empty category needs a readable state')
  assert(books.include?('href="/preview/alpha"'), 'Card URLs must respect baseurl')
  assert(books.include?('A &lt;B&gt; &amp; &quot;C&quot;'), 'Book titles must be escaped')
  assert(books.include?('Author &lt;script&gt;'), 'Authors must be escaped')
  post = File.read(File.join(output, 'alpha.html'))
  %w[Title Author Rating Genre Medium Finished].each { |field| assert(post.include?("<dt>#{field}</dt>"), "Missing metadata field #{field}") }
  assert(post.include?('4.5 / 5') && post.include?('2024-02-29'), 'Post metadata values must render')
  assert(stat_values(html(output, ''))['Books'] == '7', 'Homepage and Books must count the same public items')
end

fixture_site(false) do |output|
  books = html(output, 'archive/books')
  stats = stat_values(books)
  assert(stats['Total books'] == '0' && stats['Average rating'] == '—', 'Empty stats must avoid division by zero')
  assert(books.include?('아직 기록이 없습니다.') && books.include?('아직 기록된 별점이 없습니다.'), 'Empty archive and rating states must render')
end
puts 'PASS: classification, collections, missing/zero/decimal/invalid ratings, year fallback, metadata escaping, baseurl, counts and empty states.'

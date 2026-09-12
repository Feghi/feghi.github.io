# Run with: bundle exec ruby _checks/portfolio.rb
# Fixture content exists only in temporary sites, never in the real posts/data.
require 'jekyll'
require 'tmpdir'
require 'fileutils'
require 'yaml'
Jekyll::PluginManager.require_from_bundler
ROOT = File.expand_path('..', __dir__)

def assert(condition, message)
  raise message unless condition
end

def build_fixture(empty)
  Dir.mktmpdir('feghi-portfolio-check-') do |temporary|
    source = File.join(temporary, 'source')
    output = File.join(temporary, 'output')
    FileUtils.mkdir_p(source)
    %w[_layouts _includes _sass _data research projects lab].each { |dir| FileUtils.cp_r(File.join(ROOT, dir), source) }
    FileUtils.cp(File.join(ROOT, 'index.html'), source)
    FileUtils.mkdir_p(File.join(source, 'assets'))
    FileUtils.cp_r(File.join(ROOT, 'assets/css'), File.join(source, 'assets'))
    projects = empty ? [] : [
      {'title' => 'Full <project>', 'description' => 'A & B', 'year' => 2026, 'status' => 'Active', 'technologies' => ['Ruby', '<script>'], 'github' => 'https://github.com/example/project', 'demo' => '/demo/', 'image' => '/assets/example.png', 'image_alt' => 'A "preview"'},
      {'title' => 'Minimal'},
      {'title' => 'Unsafe links', 'github' => 'javascript:alert(1)', 'demo' => '//untrusted.test', 'image' => 'data:image/svg+xml,bad'}
    ]
    publications = empty ? [] : [2022, 2025, 2023, 2024].map do |year|
      {'title' => "Paper #{year} <test>", 'venue' => 'A & B', 'year' => year, 'authors' => ['A', 'B'], 'url' => '/papers/example/'}
    end
    research = empty ? {'interests' => [], 'projects' => [], 'teaching' => []} : {
      'introduction' => 'Research <intro>', 'interests' => ['Graphs'],
      'projects' => [{'title' => 'Thesis', 'source_url' => '/thesis/', 'source_label' => 'Read thesis'}],
      'teaching' => [{'title' => 'Programming', 'institution' => 'Test University', 'period' => '2020', 'topics' => ['R', 'Python']}]
    }
    {'projects' => projects, 'publications' => publications, 'research' => research}.each do |name, data|
      File.write(File.join(source, '_data', "#{name}.yml"), data.to_yaml)
    end
    Dir.chdir(source) do
      config = Jekyll.configuration('config' => File.join(ROOT, '_config.yml'), 'source' => source, 'destination' => output, 'baseurl' => '/preview', 'url' => 'https://example.test')
      Jekyll::Site.new(config).process
    end
    yield output
  end
end

def page(output, route)
  File.read(File.join(output, route, 'index.html'))
end

build_fixture(false) do |output|
  projects = page(output, 'projects')
  research = page(output, 'research')
  lab = page(output, 'lab')
  assert(projects.scan(/class="project-card"/).size == 3, 'Every project should render once')
  assert(projects.include?('Full &lt;project&gt;') && projects.include?('A &amp; B'), 'Project text must be escaped')
  assert(projects.include?('href="/preview/demo/"') && projects.include?('src="/preview/assets/example.png"'), 'Local demo/image must respect baseurl')
  assert(projects.include?('alt="A &quot;preview&quot;"'), 'Image alt text must be escaped')
  assert(projects.include?('href="https://github.com/example/project"'), 'External GitHub link must survive')
  assert(!projects.match?(/(?:href|src)="(?:javascript:|data:|\/\/)/), 'Unsafe URL schemes must not render')
  assert(projects.scan(/class="project-image"/).size == 1, 'Missing/rejected images must not produce image elements')
  assert(!projects.include?('href=""'), 'Optional links must not create empty anchors')
  assert(research.scan(/class="publication-year">(\d+)/).flatten == %w[2025 2024 2023 2022], 'Publications must sort newest first')
  assert(research.include?('<details class="more-publications">'), 'Long publication lists need a no-JS disclosure')
  assert(research.include?('href="/preview/papers/example/"') && research.include?('href="/preview/thesis/"'), 'Publication/thesis links must respect baseurl')
  assert(research.include?('Research &lt;intro&gt;') && research.include?('Programming'), 'Research and teaching data must render')
  %w[interests publications research-projects teaching].each { |id| assert(research.include?("id=\"#{id}\""), "Missing research section #{id}") }
  assert(lab.scan(/class="lab-card"/).size == 6, 'Lab must show exactly six requested placeholders')
  lab.scan(/<li class="lab-card">(.*?)<\/li>/).flatten.each { |card| assert(card.include?('Coming soon') && !card.match?(/<(a|button|input)\b/), 'Lab placeholders must not look actionable') }
  %w[research projects lab].each { |route| assert(page(output, route).include?("href=\"/preview/#{route}/\" aria-current=\"page\""), "Wrong active navigation on #{route}") }
end

build_fixture(true) do |output|
  research = page(output, 'research')
  assert(page(output, 'projects').include?('프로젝트 기록을 정리하고 있습니다.'), 'Missing projects need an empty state')
  ['연구 관심사를', '논문 목록을', '연구 프로젝트를', '강의 기록을'].each { |text| assert(research.include?(text), "Missing empty state: #{text}") }
  assert(!research.include?('class="more-publications"'), 'An empty list must not show an empty disclosure')
end
puts 'PASS: portfolio fields, escaping, optional links/images, baseurl, publication ordering, empty states, navigation and six non-actionable Lab placeholders.'

const GITHUB_USERNAME = 'ahskihdus';
const API_BASE = 'https://api.github.com';
const CACHE_KEY = 'gh_portfolio_cache';
const CACHE_TTL = 30 * 60 * 1000;

function getCachedData(key) {
  try {
    const cached = sessionStorage.getItem(`${CACHE_KEY}_${key}`);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(`${CACHE_KEY}_${key}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedData(key, data) {
  try {
    sessionStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch { /* quota exceeded — ignore */ }
}

async function fetchGitHub(endpoint) {
  const cacheKey = endpoint.replace(/[^a-z0-9]/gi, '_');
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });

  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  setCachedData(cacheKey, data);
  return data;
}

async function loadGitHubProfile() {
  try {
    const profile = await fetchGitHub(`/users/${GITHUB_USERNAME}`);
    return profile;
  } catch (err) {
    console.warn('Failed to load GitHub profile:', err);
    return null;
  }
}

async function loadGitHubRepos() {
  try {
    const repos = await fetchGitHub(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
    return repos.filter(r => !r.fork).sort((a, b) =>
      new Date(b.updated_at) - new Date(a.updated_at)
    );
  } catch (err) {
    console.warn('Failed to load GitHub repos:', err);
    return [];
  }
}

async function loadGitHubStats() {
  try {
    const [profile, repos] = await Promise.all([
      loadGitHubProfile(),
      loadGitHubRepos()
    ]);

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    return {
      publicRepos: profile?.public_repos || repos.length,
      followers: profile?.followers || 0,
      following: profile?.following || 0,
      totalStars,
      repos
    };
  } catch (err) {
    console.warn('Failed to load GitHub stats:', err);
    return null;
  }
}

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  SCSS: '#c6538c',
  TypeScript: '#3178c6',
  Shell: '#89e051'
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#8b8b8b';
}

function renderRepoCard(repo) {
  const langColor = getLangColor(repo.language);
  const desc = repo.description || 'No description provided';
  const card = document.createElement('a');
  card.className = 'repo-card';
  card.href = repo.html_url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.innerHTML = `
    <div class="repo-name">
      <span class="repo-icon">&#9733;</span>
      ${repo.name}
    </div>
    <div class="repo-desc">${desc}</div>
    <div class="repo-meta">
      ${repo.language ? `<span><span class="lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ''}
      ${repo.stargazers_count ? `<span>&#9733; ${repo.stargazers_count}</span>` : ''}
      ${repo.forks_count ? `<span>&#9741; ${repo.forks_count}</span>` : ''}
    </div>
  `;
  return card;
}

function createSkeletonCards(container, count) {
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'repo-card';
    skel.innerHTML = `
      <div class="skeleton" style="height:16px;width:60%;margin-bottom:0.5rem"></div>
      <div class="skeleton" style="height:12px;width:100%;margin-bottom:0.25rem"></div>
      <div class="skeleton" style="height:12px;width:80%;margin-bottom:0.75rem"></div>
      <div class="skeleton" style="height:10px;width:40%"></div>
    `;
    container.appendChild(skel);
  }
}

async function initHomeGitHub() {
  const statsContainer = document.getElementById('github-stats');
  const reposContainer = document.getElementById('github-repos');

  if (reposContainer) createSkeletonCards(reposContainer, 4);

  const stats = await loadGitHubStats();
  if (!stats) return;

  if (statsContainer) {
    const statItems = statsContainer.querySelectorAll('.stat-number');
    if (statItems[0]) animateNumber(statItems[0], stats.publicRepos);
    if (statItems[1]) animateNumber(statItems[1], stats.followers);
    if (statItems[2]) animateNumber(statItems[2], stats.totalStars);
    if (statItems[3]) animateNumber(statItems[3], stats.following);
  }

  if (reposContainer && stats.repos) {
    reposContainer.innerHTML = '';
    stats.repos.slice(0, 6).forEach(repo => {
      reposContainer.appendChild(renderRepoCard(repo));
    });
    if (stats.repos.length === 0) {
      reposContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">Repositories loading from GitHub...</p>';
    }
  }
}

async function initProjectsGitHub() {
  const container = document.getElementById('github-repos-projects');
  if (!container) return;

  createSkeletonCards(container, 4);
  const repos = await loadGitHubRepos();
  container.innerHTML = '';

  if (repos.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">Loading repositories from GitHub...</p>';
    return;
  }

  repos.forEach(repo => {
    container.appendChild(renderRepoCard(repo));
  });
}

function animateNumber(el, target) {
  let current = 0;
  const duration = 1200;
  const step = Math.max(1, Math.ceil(target / (duration / 16)));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 16);
}

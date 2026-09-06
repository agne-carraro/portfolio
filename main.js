const USERNAME = "agne-carraro";

const state = {
  repos: [],
};

const listEl = document.getElementById("repo-list");
const statusEl = document.getElementById("status");

async function fetchRepos() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100`
    );

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const data = await res.json();
    state.repos = data
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    render();
  } catch (err) {
    statusEl.textContent =
      "Couldn't load the projects. Check the username in js/main.js, or try again shortly.";
    console.error(err);
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function render() {
  const repos = state.repos;

  if (repos.length === 0) {
    statusEl.hidden = false;
    statusEl.textContent = "No repositories found.";
    listEl.innerHTML = "";
    return;
  }

  statusEl.hidden = true;

  listEl.innerHTML = repos
    .map((repo, i) => {
      const index = String(i + 1).padStart(2, "0");
      const description = repo.description || "No description provided.";
      const stars = repo.stargazers_count;
      const language = repo.language || "—";

      return `
        <li class="ledger__row">
          <span class="ledger__index">${index}</span>
          <div>
            <h2 class="ledger__name">
              <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
            </h2>
            <p class="ledger__description">${description}</p>
            <div class="ledger__meta">
              <span>${language}</span>
              <span>${stars} star${stars === 1 ? "" : "s"}</span>
              <span>Updated ${formatDate(repo.updated_at)}</span>
            </div>
          </div>
        </li>
      `;
    })
    .join("");
}

fetchRepos();
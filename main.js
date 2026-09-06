const USERNAME = "agne-carraro";

const state = {
  repos: [],
};

const LANGUAGE_COLORS = {
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  Python: "#3572A5",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Swift: "#F05138",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  PHP: "#4F5D95",
  Shell: "#89E051",
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
      .filter((repo) => repo.name.toLowerCase() !== "portfolio")
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
    .map((repo) => {
      const description = repo.description || "No description provided.";
      const language = repo.language;
      const dotColor = LANGUAGE_COLORS[language] || "#999999";

      const languageHtml = language
        ? `<span class="ledger__lang">
             <span class="ledger__lang-dot" style="background:${dotColor}"></span>${language}
           </span>`
        : "";

      return `
        <li class="ledger__row">
          <div>
            <h2 class="ledger__name">
              <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
            </h2>
            <p class="ledger__description">${description}</p>
            <div class="ledger__meta">
              ${languageHtml}
              <span>Updated ${formatDate(repo.updated_at)}</span>
            </div>
          </div>
        </li>
      `;
    })
    .join("");
}

fetchRepos();
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM fully loaded");

 
  /* ===================== DOM ELEMENTS ===================== */
  const container = document.getElementById("projects-container");
  const githubBtn = document.getElementById("btn-github");
  const kaggleBtn = document.getElementById("btn-kaggle");


  /* ===================== SCROLL-SYNCED TYPEWRITER ===================== */
  const target = document.getElementById("scroll-type");
  const section = document.getElementById("home");
  const text = "Merhaba, Ayat here!";


 console.log("container:", container);
 console.log("githubBtn:", githubBtn);
 console.log("kaggleBtn:", kaggleBtn);
 console.log("scroll-type target:", target);
 console.log("home section:", section);

  if (!target || !section) {
    console.error("Typewriter elements not found");
  } else {
    target.parentElement.classList.add("typing");

    function updateTypewriter() {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight * 0.2;
      const end = windowHeight * 0.8;

      const progress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, progress));

      const charsToShow = Math.ceil(clamped * text.length);

      target.textContent = text.slice(0, charsToShow);
    }

    updateTypewriter(); // run once
    window.addEventListener("scroll", updateTypewriter);
  }

  /* ===================== CONFIG ===================== */
  const GITHUB_USERNAME = "Ayat-cmd-oss";
  const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

  /* ===================== UI HELPERS ===================== */
  function setLoading(isLoading) {
    container.setAttribute("aria-busy", String(isLoading));
    container.innerHTML = isLoading ? "<p>Loading projects…</p>" : "";
  }

  function showError(message) {
    container.innerHTML = `<p role="alert">${message}</p>`;
  }

  function renderProject({ title, description, link, meta }) {
    const article = document.createElement("article");
    article.innerHTML = `
      <h2>${title}</h2>
      <p>${description}</p>
      ${meta ? `<p><strong>${meta}</strong></p>` : ""}
      <a href="${link}" target="_blank" rel="noopener noreferrer">
        View Project
      </a>
    `;
    container.appendChild(article);
  }

  /* ===================== DATA LOADERS ===================== */

  async function loadGitHubProjects() {
    setLoading(true);

    try {
      const response = await fetch(GITHUB_API_URL);
      if (!response.ok) throw new Error("GitHub request failed");

      const repos = await response.json();
      container.innerHTML = "";

      repos
        .filter(repo => !repo.fork)
        .forEach(repo => {
          renderProject({
            title: repo.name,
            description: repo.description || "No description provided.",
            link: repo.html_url,
            meta: repo.language ? `Language: ${repo.language}` : null
          });
        });

    } catch (error) {
      showError("Unable to load GitHub projects.");
    } finally {
      container.setAttribute("aria-busy", "false");
    }
  }

  async function loadKaggleProjects() {
    setLoading(true);

    try {
      const response = await fetch("kaggle-projects.json");
      if (!response.ok) throw new Error("Kaggle data not found");

      const projects = await response.json();
      container.innerHTML = "";

      projects.forEach(project => {
        renderProject({
          title: project.title,
          description: project.description,
          link: project.link
        });
      });

    } catch (error) {
      showError("Unable to load Kaggle projects.");
    } finally {
      container.setAttribute("aria-busy", "false");
    }
  }

  /* ===================== EVENTS ===================== */
  githubBtn.addEventListener("click", loadGitHubProjects);
  kaggleBtn.addEventListener("click", loadKaggleProjects);

}

);
target.textContent = "Typewriter works!";

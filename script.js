document.addEventListener("DOMContentLoaded", () => {

  // --- MENU ---
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("show"));
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== menuToggle) {
      menu.classList.remove("show");
    }
  });

  // --- TEMA (com persistência no localStorage) ---
  const themeToggle = document.getElementById("themeToggle");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // --- EFEITO DE DIGITAÇÃO (JS — sem hardcode do número de caracteres) ---
  function iniciarTyping() {
    const el = document.getElementById("typing");
    if (!el) return;
    const text = el.textContent.trim();
    if (!text) return;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    let i = 0;
    (function tick() {
      el.textContent = text.slice(0, i++);
      if (i <= text.length) setTimeout(tick, 65);
    })();
  }
  iniciarTyping();

  // --- MATRIX (limitado a 20 FPS para economizar CPU) ---
  const canvas = document.getElementById("matrix-bg");
  const ctx = canvas.getContext("2d");
  const letters = "01";
  const fontSize = 14;
  let drops;
  let resizeTimer;

  function ajustar() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
  }
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(ajustar, 150);
  });
  ajustar();

  let animacaoAtiva = true;
  let lastDrawTime = 0;
  const FRAME_INTERVAL = 1000 / 20;

  function desenhar(timestamp) {
    requestAnimationFrame(desenhar);
    if (!animacaoAtiva || timestamp - lastDrawTime < FRAME_INTERVAL) return;
    lastDrawTime = timestamp;
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2b7cff";
    ctx.font = `${fontSize}px monospace`;
    drops.forEach((y, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, y * fontSize);
      drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
    });
  }
  requestAnimationFrame(desenhar);

  document.addEventListener("visibilitychange", () => {
    animacaoAtiva = !document.hidden;
  });

  // --- NAV ATIVA (marca o link da seção visível) ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav ul a[href^='#']");

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

  sections.forEach(s => navObserver.observe(s));

  // --- VOLTAR AO TOPO ---
  const topBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 300);
  });
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // --- AOS ---
  AOS.init({ duration: 800, once: true });

  // --- PROJETOS GITHUB (com linguagem, estrelas e forks) ---
  async function carregarProjetos() {
    const grid = document.getElementById("projectsGrid");
    const loader = document.getElementById("loader");
    try {
      const res = await fetch("https://api.github.com/users/joaomangini/repos?sort=updated&per_page=6");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos = await res.json();
      loader.remove();
      repos.forEach(repo => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <div class="card-header">
            <h3>${repo.name}</h3>
            ${repo.language ? `<span class="lang-badge">${repo.language}</span>` : ""}
          </div>
          <p>${repo.description || "Sem descrição disponível."}</p>
          <div class="card-footer">
            <span title="Stars">⭐ ${repo.stargazers_count}</span>
            <span title="Forks">🍴 ${repo.forks_count}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
               aria-label="Ver ${repo.name} no GitHub">Ver no GitHub →</a>
          </div>`;
        grid.appendChild(card);
      });
    } catch (err) {
      console.error("Falha ao buscar repositórios:", err);
      loader.innerHTML = "<span>❌ Não foi possível carregar os projetos. Tente novamente mais tarde.</span>";
    }
  }
  carregarProjetos();

  // --- CONTADOR VISITAS ---
  try {
    let visitas = +(localStorage.getItem("visitas_portfolio") || 0) + 1;
    localStorage.setItem("visitas_portfolio", visitas);
    document.getElementById("visitas").textContent = `Visualizações: ${visitas}`;
  } catch {
    document.getElementById("visitas").textContent = "";
  }

  // --- ANO DINÂMICO ---
  document.getElementById("year").textContent = new Date().getFullYear();

  // --- DOWNLOAD CURRÍCULO ---
  document.getElementById("baixarCurriculo").addEventListener("click", () => window.print());

});

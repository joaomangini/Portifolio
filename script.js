// MENU RESPONSIVO
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("show");
});

// TÍTULO DIGITANDO
const text = "👋 Olá — Eu sou o João Leonardo";
const typingEl = document.getElementById("typing");
let i = 0;
function type() {
  if (i < text.length) {
    typingEl.textContent += text.charAt(i);
    i++;
    setTimeout(type, 80);
  }
}
type();

// BOTÃO VOLTAR AO TOPO
const topBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) topBtn.classList.add("show");
  else topBtn.classList.remove("show");
});
topBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ANIMAÇÃO DE ROLAGEM (AOS)
AOS.init({ duration: 800, once: true });

// EFEITO MATRIX
const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const letters = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);
function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#2b7cff";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(draw, 35);

// CARREGAR PROJETOS DO GITHUB
fetch("https://api.github.com/users/joaomangini/repos?sort=updated")
  .then(res => res.json())
  .then(repos => {
    const grid = document.getElementById("projectsGrid");
    const loader = document.getElementById("loader");
    loader.style.display = "none";
    repos.slice(0, 6).forEach(repo => {
      const card = document.createElement("div");
      card.classList.add("project-card");
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "Sem descrição disponível."}</p>
        <a href="${repo.html_url}" target="_blank">Ver no GitHub</a>
      `;
      grid.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("loader").textContent = "Erro ao carregar projetos.";
  });

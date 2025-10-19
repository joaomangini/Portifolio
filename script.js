document.addEventListener("DOMContentLoaded", () => {
  // --- MENU ---
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  menuToggle.addEventListener("click", () => menu.classList.toggle("show"));
  
  // --- Fecha o menu ao clicar em um link (Melhoria Bônus) ---
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("show"));
  });

  // --- EFEITO DE DIGITAÇÃO REMOVIDO ---
  // (Agora é feito com CSS)

  // --- MATRIX SUAVE (Otimizado) ---
  const canvas = document.getElementById("matrix-bg");
  const ctx = canvas.getContext("2d");
  const letters = "01";
  const fontSize = 14;
  let drops;
  
  function ajustar() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
  }
  window.addEventListener("resize", ajustar);
  ajustar();

  let animacaoAtiva = true;

  function desenhar() {
    if (animacaoAtiva) {
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
  }
  desenhar();

  // Pausa a animação se a aba ficar inativa
  document.addEventListener("visibilitychange", () => {
    animacaoAtiva = !document.hidden;
  });


  // --- MODO CLARO / ESCURO ---
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
  });

  // --- VOLTAR AO TOPO ---
  const topBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 300);
  });
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // --- AOS ---
  AOS.init({ duration: 800, once: true });

  // --- PROJETOS GITHUB ---
  async function carregarProjetos() {
    const grid = document.getElementById("projectsGrid");
    const loader = document.getElementById("loader");
    try {
      const res = await fetch("https://api.github.com/users/joaomangini/repos?sort=updated&per_page=6");
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const repos = await res.json();
      loader.remove();
      repos.forEach(repo => {
        const card = document.createElement("div");
        card.className = "project-card";
        
        // --- ESTA É A PARTE ATUALIZADA ---
        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || "Sem descrição disponível."}</p>
          <a href="${repo.html_url}" 
             target="_blank" 
             rel="noopener noreferrer" 
             aria-label="Ver o projeto ${repo.name} no GitHub">
             Ver no GitHub
          </a>`;
        // --- FIM DA PARTE ATUALIZADA ---
          
        grid.appendChild(card);
      });
    } catch(err) {
      console.error("Falha ao buscar repositórios:", err);
      loader.textContent = "❌ Erro ao carregar projetos.";
    }
  }
  carregarProjetos();

  // --- CONTADOR VISITAS ---
  try {
    let visitas = +localStorage.getItem("visitas_portfolio") || 0;
    visitas++;
    localStorage.setItem("visitas_portfolio", visitas);
    document.getElementById("visitas").textContent = `Visualizações: ${visitas}`;
  } catch (e) {
    console.warn("Não foi possível acessar o localStorage (talvez cookies desabilitados).", e);
    document.getElementById("visitas").textContent = ""; // Oculta o contador
  }


  // --- GERAÇÃO DE PDF (Solução com 'Imprimir') ---
  document.getElementById("baixarCurriculo").addEventListener("click", () => {
    window.print(); // Abre a caixa de diálogo de impressão do navegador
  });

});

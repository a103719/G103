import { getDados } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  const nome = localStorage.getItem("nomeUtilizadorVisivel") || "Utilizador";
  const id = localStorage.getItem("idUtilizador") || "anonimo";
  const foto = localStorage.getItem("fotoUtilizador");

  const nomeSpan = document.getElementById("user-name");
  const fotoImg = document.getElementById("user-photo");

  if (nomeSpan) nomeSpan.textContent = nome;
  if (foto && fotoImg) fotoImg.src = foto;

  const estado = getDados();
  const pontos = (estado.pontosUtilizadores || {})[id] || 0;

  const pontosSpan = document.getElementById("pontos-contador");
  if (pontosSpan) {
    pontosSpan.textContent = `${pontos} ponto${pontos === 1 ? "" : "s"}`;
  }

  const barra = document.getElementById("barra-progresso");
  if (barra) {
    const pontosParaNivel = [20, 40, 60, 80];
    barra.innerHTML = "";
    barra.style.display = "flex";
    barra.style.justifyContent = "center";
    barra.style.alignItems = "center";
    barra.style.gap = "8px";

    for (let i = 0; i < 5; i++) {
      const circulo = document.createElement("div");
      circulo.className = "circulo";
      circulo.style.width = "18px";
      circulo.style.height = "18px";
      circulo.style.borderRadius = "50%";
      circulo.style.transition = "background-color 0.3s ease";
      circulo.style.backgroundColor =
        i < 4
          ? (pontos >= pontosParaNivel[i] ? "#0A77BC" : "#dcdcff")
          : "#e3e0ff";
      barra.appendChild(circulo);
    }
  }

  const ocorrencias = (estado.ocorrenciasLista || []).filter(o => o.utilizador === id);
  if (ocorrencias.length > 0) {
    const ultima = ocorrencias.sort((a, b) => new Date(b.data) - new Date(a.data))[0];
    const ultimaTipoEl = document.getElementById("ultima-tipo");
    const pendentesEl = document.getElementById("pendentes-mes");

    if (ultimaTipoEl && pendentesEl) {
      ultimaTipoEl.textContent = ultima.designacao || "—";
      const pendentes = ocorrencias.filter(o =>
        o.estado && o.estado.toLowerCase() === "pendente"
      );
      pendentesEl.textContent = pendentes.length;
    }
  }

  // 📝 Gestão de Auditorias - abre diretamente
 document.getElementById("linkGestaoAuditorias").addEventListener("click", function (e) {
  e.preventDefault(); // Evita comportamento padrão do link

  Toastify({
    text: " 	🔁 A redirecionar para a Gestão de Ocorrências...",
    duration: 2000,
    gravity: "top",
    position: "center",
    style: {
      background: "#0A77BC",
      color: "#fff",
    }
  }).showToast();

  // Abre numa nova aba depois de 2 segundos
  setTimeout(() => {
    window.open("../Back-office/src/html/authentication-login.html", "_blank");
  }, 2000);
});


  // 📊 Indicadores de Auditorias - login do backoffice
  const linkIndicadores = document.getElementById("linkIndicadoresAuditorias");
  if (linkIndicadores) {
    linkIndicadores.addEventListener("click", (event) => {
      event.preventDefault();

      const novaAba = window.open("", "_blank"); // abre a aba logo

      Toastify({
        text: "📊 A redirecionar para login de peritos...",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
          background: "#4CAF50"
        }
      }).showToast();

      setTimeout(() => {
        if (novaAba) {
          novaAba.location.href = "../Back-office/src/html/authentication-login.html";
        }
      }, 2000);
    });
  }

  // 🔓 Logout
  const logoutBtn = document.getElementById("logout-icon");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("idUtilizador");
      localStorage.removeItem("fotoUtilizador");
      localStorage.removeItem("nomeUtilizadorVisivel");
      localStorage.removeItem("tipoUtilizador");
      window.location.href = "login.html";

    });
  }
});

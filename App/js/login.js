// js/login.js
import { getDados, setDados } from './storage.js';

export function loginComEmail() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    mostrarToast("⚠️Preenche os campos email e senha.", "erro");
    return;
  }

  const idInterno = email.trim().toLowerCase(); // usado como chave estável
  const nomeVisivel = email.split('@')[0]; // mostra "teresasousa", "joana.ferreira", etc.
  const foto = "https://lh3.googleusercontent.com/a/default-user=s64-c";

  processarLogin(idInterno, nomeVisivel, foto);
}

export function loginComGoogle(data) {
  const nomeVisivel = data.name || "Utilizador"; // ex: "Teresa Sousa"
  const idInterno = (data.email || nomeVisivel).trim().toLowerCase(); // chave estável
  const foto = data.picture || "https://lh3.googleusercontent.com/a/default-user=s64-c";

  processarLogin(idInterno, nomeVisivel, foto);
}

function processarLogin(idInterno, nomeVisivel, foto) {
  // Guardar dados de sessão
  localStorage.setItem("idUtilizador", idInterno);
  localStorage.setItem("nomeUtilizadorVisivel", nomeVisivel);
  localStorage.setItem("fotoUtilizador", foto);

  const estadoAnterior = getDados(); // estrutura completa atual

  // Garantir que o objeto de pontos existe e inicializar o utilizador se necessário
  const pontosAtualizados = {
    ...estadoAnterior.pontosUtilizadores,
    [idInterno]: estadoAnterior.pontosUtilizadores?.[idInterno] ?? 0
  };

  // Atualizar apenas pontosUtilizadores (sem tocar no resto)
  setDados({
    pontosUtilizadores: pontosAtualizados
  });

  window.location.href = "inicial.html";
}


function mostrarToast(mensagem, tipo = "erro") {
  const toast = document.createElement("div");
  toast.innerText = mensagem;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = tipo === "erro" ? "#f44336" : "#4CAF50";
  toast.style.color = "white";
  toast.style.padding = "15px";
  toast.style.borderRadius = "4px";
  toast.style.zIndex = "1000";
  toast.style.minWidth = "250px";
  toast.style.textAlign = "center";
  toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

import { getDados, setDados } from './storage.js';

let coordenadaLat = null;
let coordenadaLng = null;

// Inicializar mapa e obter localização atual
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    coordenadaLat = pos.coords.latitude;
    coordenadaLng = pos.coords.longitude;

    const mapa = L.map('mapa').setView([coordenadaLat, coordenadaLng], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
    L.marker([coordenadaLat, coordenadaLng]).addTo(mapa);
  });
}

window.adicionarPontos = function(event) {
  console.log("FUNÇÃO EXECUTADA");
  event.preventDefault();

  const tipo = document.querySelector("#tipoOcorrencia").value;
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const fotos = document.getElementById("foto-upload").files;

  if (!tipo || tipo.includes("Selecione") || !titulo || !descricao) {
    window.mostrarToast("⚠️ Preenche todos os campos!", "#FF5252");
    return;
  }

  const nomeUtilizador = localStorage.getItem("idUtilizador") || "Anónimo";

  const dados = getDados();
  if (!dados.ocorrenciasLista) dados.ocorrenciasLista = [];

  const nova = {
    designacao: `ID-${Date.now()}/ ${tipo}`,
    utilizador: nomeUtilizador,
    estado: "Pendente",
    latitude: coordenadaLat,
    longitude: coordenadaLng,
    foto: "", // será preenchida com base64
    titulo,
    descricao,
    data: new Date().toLocaleString()
  };

  function guardarEOk() {
    dados.ocorrenciasLista.push(nova);
    setDados(dados);
    window.mostrarToast("✅ Ocorrência registada com sucesso!");
    document.getElementById("formulario").reset();
    document.getElementById("contador").innerText = "0/180";
    document.getElementById("contador-desc").innerText = "0/360";

   // Espera 1.8 segundos antes de redirecionar
  setTimeout(() => {
    window.location.href = "inicial.html";
  }, 1800);
}

  if (fotos.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      nova.foto = reader.result; // Base64
      guardarEOk();
    };
    reader.readAsDataURL(fotos[0]);
  } else {
    // Se não houver imagem, usar uma imagem base64 simples (avatar ou ícone)
    nova.foto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";
    guardarEOk();
  }
};

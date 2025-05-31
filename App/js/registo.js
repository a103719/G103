import { getDados, setDados } from './storage.js';

// FORA DE QUALQUER FUNÇÃO
let mapa, marcadorLeaflet;
let coordenadasSelecionadas = null;

document.addEventListener("DOMContentLoaded", () => {
  const boundsCampusAzurem = L.latLngBounds(
  [41.4500, -8.2930], // Sudoeste (mais a sul e oeste)
  [41.4555, -8.2855]  // Nordeste (mais a norte e este)
);


  mapa = L.map('mapa', {
    maxBounds: boundsCampusAzurem,
    maxBoundsViscosity: 1.0
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa);

  const centro = boundsCampusAzurem.getCenter();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        if (boundsCampusAzurem.contains(latlng)) {
          mapa.setView(latlng, 18);
        } else {
          mapa.setView(centro, 18);
        }
      },
      () => mapa.setView(centro, 18)
    );
  } else {
    mapa.setView(centro, 18);
  }

  L.rectangle(boundsCampusAzurem, {
    color: "#3388ff",
    weight: 2,
    dashArray: '4',
    fillOpacity: 0.05
  }).addTo(mapa);

  mapa.on('click', function (e) {
    if (!boundsCampusAzurem.contains(e.latlng)) {
      window.mostrarToast("⚠️ Seleciona um local dentro do campus!", "#FF5252");
      return;
    }

    if (marcadorLeaflet) mapa.removeLayer(marcadorLeaflet);
    marcadorLeaflet = L.marker(e.latlng).addTo(mapa);
    coordenadasSelecionadas = e.latlng;
  });
});

window.adicionarPontos = function(event) {
  console.log("FUNÇÃO EXECUTADA");
  event.preventDefault();

  const tipo = document.querySelector("#tipoOcorrencia").value;
  const descricao = document.getElementById("descricao").value.trim();
  const observacoes = document.getElementById("observacoes").value.trim();
  const fotos = document.getElementById("foto-upload").files;
  const titulo = descricao ? descricao.substring(0, 50) : "Sem título";

  if (!tipo || tipo.includes("Selecione") || !descricao) {
    window.mostrarToast("⚠️ Preenche todos os campos obrigatórios!", "#FF5252");
    return;
  }

  if (!coordenadasSelecionadas) {
    window.mostrarToast("⚠️ Seleciona um local no mapa!", "#FF5252");
    return;
  }

  const idInterno = localStorage.getItem("idUtilizador") || "anonimo";
  const nomeVisivel = localStorage.getItem("nomeUtilizadorVisivel") || "Anónimo";

  const dados = getDados();
  dados.ocorrenciasLista = dados.ocorrenciasLista || [];

  const nova = {
    designacao: `ID-${Date.now()}/ ${tipo}`,
    titulo,
    tipo,
    descricao,
    observacoes,
    estado: "Pendente",
    data: new Date().toLocaleString(),
    utilizador: idInterno,
    nomeVisivel: nomeVisivel,
    latitude: coordenadasSelecionadas?.lat || null,
    longitude: coordenadasSelecionadas?.lng || null,
    foto: ""
  };

  function guardarEOk() {
    dados.ocorrenciasLista.push(nova);

    // Atribuir pontos ao utilizador
    dados.pontosUtilizadores = dados.pontosUtilizadores || {};
    dados.pontosUtilizadores[idInterno] = 
      (dados.pontosUtilizadores[idInterno] || 0) + 10;

    setDados(dados);
    window.mostrarToast("✅ Ocorrência registada com sucesso!");
    document.getElementById("formulario").reset();
    document.getElementById("contador").innerText = "0/180";
    document.getElementById("contador-desc").innerText = "0/360";
    document.getElementById("previewContainer").innerHTML = "";

    setTimeout(() => {
      window.location.href = "historico.html";
    }, 1800);
  }

  if (fotos.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      nova.foto = reader.result;
      guardarEOk();
    };
    reader.readAsDataURL(fotos[0]);
  } else {
    nova.foto = "";
    guardarEOk();
  }
};

let uploadedFiles = [];

const fileInput = document.getElementById('foto-upload');
const previewContainer = document.getElementById('previewContainer');

fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  if (files.length > 0) {
    document.querySelector('.upload-box').classList.add('hide-label');
  }

  Array.from(files).forEach(file => {
    if (isValidFile(file)) {
      uploadedFiles.push(file);
      createPreview(file, uploadedFiles.length - 1);
    } else {
      mostrarToast(`Tipo de ficheiro não suportado: ${file.name}`, "erro");
    }
  });
}

function isValidFile(file) {
  const validTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'video/mp4', 'video/mov', 'video/avi', 'video/quicktime',
    'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'
  ];
  return validTypes.includes(file.type);
}

function createPreview(file, index) {
  const previewItem = document.createElement('div');
  previewItem.className = 'preview-item';
  previewItem.dataset.index = index;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '×';
  removeBtn.onclick = () => removeFile(index);

  const fileInfo = document.createElement('div');
  fileInfo.className = 'file-info';
  fileInfo.innerHTML = `
    <strong>${file.name}</strong><br>
    Tamanho: ${formatFileSize(file.size)}
  `;

  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.style.width = "100%";
    img.style.height = "115px";
    img.style.objectFit = "contain";
    previewItem.appendChild(img);
  } else if (file.type.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.muted = true;
    video.style.width = "100%";
    video.style.height = "115px";
    video.style.objectFit = "contain";
    previewItem.appendChild(video);
  } else if (file.type.startsWith('audio/')) {
    const audioPreview = document.createElement('div');
    audioPreview.className = 'audio-preview';

    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(file);
    audio.controls = true;
    audio.style.width = "100%";

    audioPreview.appendChild(audio);
    previewItem.appendChild(audioPreview);
  }

  previewItem.appendChild(removeBtn);
  previewItem.appendChild(fileInfo);
  previewContainer.appendChild(previewItem);
}

function removeFile(index) {
  uploadedFiles.splice(index, 1);
  refreshPreviews();
}

function refreshPreviews() {
  previewContainer.innerHTML = '';

  if (uploadedFiles.length === 0) {
    document.querySelector('.upload-box').classList.remove('hide-label');
  } else {
    document.querySelector('.upload-box').classList.add('hide-label');
  }

  uploadedFiles.forEach((file, index) => {
    createPreview(file, index);
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 500);
  }, 3000);
}

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

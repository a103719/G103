let mapa = null;
let marcador = null;

function abrirMapa(icon) {
  const coordenadasTexto = icon.closest('td').textContent.trim();
  const coordenadas = coordenadasTexto.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);

  if (!coordenadas) {
    alert("⚠️ Não foi possível obter as coordenadas.");
    return;
  }

  const [_, lat, lng] = coordenadas.map(Number);

  const modal = new bootstrap.Modal(document.getElementById('modalLocalizacao'));
  modal.show();

  setTimeout(() => {
    if (!mapa) {
      mapa = L.map('mapaOcorrencia').setView([lat, lng], 18);

      // 🌌 Vista Satélite da Esri
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri &mdash; Fonte: Esri, Earthstar Geographics',
        maxZoom: 20
      }).addTo(mapa);

      marcador = L.marker([lat, lng]).addTo(mapa);
    } else {
      mapa.setView([lat, lng], 18);
      marcador.setLatLng([lat, lng]);
    }
  }, 300);
}


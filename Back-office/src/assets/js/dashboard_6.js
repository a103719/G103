/* dashboard_6.js — mapa de ocorrências + auditorias (filtrado) */
document.addEventListener("DOMContentLoaded", () => {
  const mapaEl = document.getElementById("mapaOcorrencias");
  if (!mapaEl) return;
  const mapa = L.map("mapaOcorrencias").setView([41.451106, -8.293168], 15);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 19 }
  ).addTo(mapa);

  const iconBase = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/";
  const blueIcon = L.icon({
    iconUrl:   iconBase + "marker-icon-blue.png",shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize:     [25, 41], iconAnchor:   [12, 41], popupAnchor:  [1, -34], shadowSize:   [41, 41],
  });
  const redIcon  = L.icon({
    iconUrl:   iconBase + "marker-icon-red.png", shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize:     [25, 41], iconAnchor:   [12, 41], popupAnchor:  [1, -34], shadowSize:   [41, 41],
  });

  const todasOcorr = JSON.parse(localStorage.getItem("ocorrenciasLista")) || [];
  const ocorrPendAnalise = todasOcorr.filter(
    o => o.estado === "Pendente" || o.estado === "Em análise"
  );

  const auditoriasCriadas = (JSON.parse(localStorage.getItem("listaAuditorias")) || [])
    .filter(a => a.estado === "Criado");

  let algumPino = false;

  ocorrPendAnalise.forEach(o => {
    const lat = +o.latitude, lng = +o.longitude;
    if (isNaN(lat) || isNaN(lng)) return;

    L.marker([lat, lng], { icon: redIcon })
      .addTo(mapa)
      .bindPopup(`<strong>${o.designacao}</strong><br>Estado: ${o.estado}`);

    if (!algumPino) { mapa.setView([lat, lng], 16); algumPino = true; }
  });

  auditoriasCriadas.forEach(aud => {
    const idOcorr = aud.ocorrencias.split(",")[0].split("/")[0].trim();
    const oc = todasOcorr.find(o => o.designacao.startsWith(idOcorr));
    if (!oc) return;

    const lat = +oc.latitude, lng = +oc.longitude;
    if (isNaN(lat) || isNaN(lng)) return;

    L.marker([lat, lng], { icon: blueIcon })
      .addTo(mapa)
      .bindPopup(
        `<strong>Auditoria</strong><br>${aud.nome || "—"}<br>` +
        `<em>${aud.ocorrencias}</em><br>` +
        `Data: ${aud.data || "—"}`
      );

    if (!algumPino) { mapa.setView([lat, lng], 16); algumPino = true; }
  });

  if (!algumPino) {
    mapaEl.innerHTML =
      '<p class="text-center mt-4">Sem ocorrências pendentes/em análise nem auditorias criadas com coordenadas.</p>';
    return;
  }

const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <style>
      .legend{
        background:#fff;
        padding:8px 10px;
        border-radius:6px;
        line-height:22px;
        box-shadow:0 0 4px rgba(0,0,0,.2);
        font-size:0.85rem;
      }
      .legend img{
        vertical-align:middle;
        margin-right:6px;
      }
    </style>
    <img src="${iconBase}marker-icon-red.png"  width="14" height="22"> Ocorrência (Pendente / Em&nbsp;análise)<br>
    <img src="${iconBase}marker-icon-blue.png" width="14" height="22"> Auditoria (Criada)
  `;
  return div;
};

legend.addTo(mapa);

});

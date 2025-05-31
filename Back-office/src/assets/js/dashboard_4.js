document.addEventListener("DOMContentLoaded", function () {
    atualizarDashboardOcorrencias();
  });

  function atualizarDashboardOcorrencias() {
    const tbody = document.getElementById("ocorrencias-em-aberto-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const lista = JSON.parse(localStorage.getItem("ocorrenciasLista")) || [];

    lista.forEach(ocorrencia => {
      const estado = ocorrencia.estado?.trim();
      if (estado && estado !== "Resolvido") {
        const designacao = ocorrencia.designacao;

        const badgeClasse = estado === "Pendente"
          ? "bg-primary"
          : estado === "Em análise"
          ? "bg-info text-white"
          : "";

        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${designacao}</td>
          <td>
            <span class="badge rounded-pill ${badgeClasse}">${estado}</span>
          </td>
        `;
        tbody.appendChild(linha);
      }
    });
  }
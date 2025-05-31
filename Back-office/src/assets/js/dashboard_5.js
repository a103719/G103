document.addEventListener("DOMContentLoaded", function () {
    const lista = JSON.parse(localStorage.getItem("peritos")) || [];
    const tabela = document.querySelector("#tabela-dashboard-peritos tbody");
    if (!tabela) return;
  
    const peritosVisiveis = lista.filter(p => p.estado === "disponivel" || p.estado === "em_acao");
    const maxVisiveis = 3;
  
    function renderizarTabela(mostrarTodos = false) {
      tabela.innerHTML = "";
  
      const peritosParaMostrar = mostrarTodos ? peritosVisiveis : peritosVisiveis.slice(0, maxVisiveis);
  
      peritosParaMostrar.forEach(p => {
        const estadoClasse = p.estado === "disponivel"
          ? 'bg-light-success text-success'
          : 'bg-light-danger text-danger';
  
        const estadoTexto = p.estado === "disponivel" ? "Disponível" : "Em ação";
  
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td><div class="d-flex align-items-center"><div><h6 class="mb-1 fw-bolder">${p.id}</h6></div></div></td>
          <td><p class="fs-3 fw-normal mb-0">${p.nome}</p></td>
          <td><p class="fs-3 fw-normal mb-0">${p.area}</p></td>
          <td><span class="badge rounded-pill ${estadoClasse} px-3 py-2 fs-3">${estadoTexto}</span></td>
        `;
        tabela.appendChild(linha);
      });
  
      // Ver mais
      if (!mostrarTodos && peritosVisiveis.length > maxVisiveis) {
        const linhaSeta = document.createElement("tr");
        linhaSeta.classList.add("text-center");
        linhaSeta.innerHTML = `
          <td colspan="4">
            <button id="verMaisPeritos" style="background: none; border: none; cursor: pointer;">
              <iconify-icon icon="mdi:chevron-down" class="fs-4"></iconify-icon>
            </button>
          </td>
        `;
        tabela.appendChild(linhaSeta);
  
        document.getElementById("verMaisPeritos").addEventListener("click", () => {
          renderizarTabela(true);
        });
      }
  
      // Ver menos
      if (mostrarTodos && peritosVisiveis.length > maxVisiveis) {
        const linhaSeta = document.createElement("tr");
        linhaSeta.classList.add("text-center");
        linhaSeta.innerHTML = `
          <td colspan="4">
            <button id="verMenosPeritos" style="background: none; border: none; cursor: pointer;">
              <iconify-icon icon="mdi:chevron-up" class="fs-4"></iconify-icon>
            </button>
          </td>
        `;
        tabela.appendChild(linhaSeta);
  
        document.getElementById("verMenosPeritos").addEventListener("click", () => {
          renderizarTabela(false);
        });
      }
    }
  
    renderizarTabela();
  });
  
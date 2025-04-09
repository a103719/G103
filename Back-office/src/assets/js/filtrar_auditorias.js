let estadoFiltroAtual = "";

document.addEventListener("DOMContentLoaded", function () {
  const itensDropdown = document.querySelectorAll(".dropdown-menu .dropdown-item");

  function aplicarFiltro(estado) {
    estadoFiltroAtual = estado;

    const linhasTabela = document.querySelectorAll("#tabela-auditorias tbody tr");

    linhasTabela.forEach(linha => {
      const badge = linha.querySelector("span[class*='badge']");
      const estadoLinha = badge?.textContent.trim();

      if (!estado || estadoLinha === estado) {
        linha.dataset.match = "true";
      } else {
        linha.dataset.match = "false";
        linha.style.display = "none";
      }
    });

    // Reaplica o limite visível apenas às linhas que passaram o filtro
    if (typeof reaplicarLimiteAuditorias === "function") {
      reaplicarLimiteAuditorias();
    }
  }

  // Aplica filtro ao clicar em item do dropdown
  itensDropdown.forEach(item => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const estadoSelecionado = this.getAttribute("data-estado");
      aplicarFiltro(estadoSelecionado);
    });
  });

  // Disponível globalmente para reaplicar o filtro
  window.aplicarFiltroAtual = () => aplicarFiltro(estadoFiltroAtual);
});

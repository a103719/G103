let estadoFiltroAtual = "";
  
    document.addEventListener("DOMContentLoaded", function () {
      const itensDropdown = document.querySelectorAll(".dropdown-menu .dropdown-item");
  
      function aplicarFiltro(estado) {
        estadoFiltroAtual = estado;
  
        // Atualiza dinamicamente as linhas da tabela
        const linhasTabelaAtualizadas = document.querySelectorAll("table tbody tr");
  
        linhasTabelaAtualizadas.forEach(linha => {
          const badge = linha.querySelector("span[class*='badge']");
          const estadoLinha = badge?.textContent.trim();
  
          if (!estado || estadoLinha === estado) {
            linha.style.display = "";
          } else {
            linha.style.display = "none";
          }
        });
      }
  
      // Dropdown de filtro
      itensDropdown.forEach(item => {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const estadoSelecionado = this.getAttribute("data-estado");
          aplicarFiltro(estadoSelecionado);
        });
      });
  
      // Para ser chamado após atualizações dinâmicas
      window.aplicarFiltroAtual = () => aplicarFiltro(estadoFiltroAtual);
    });
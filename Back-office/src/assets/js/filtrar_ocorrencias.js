document.addEventListener("DOMContentLoaded", function () {
    // Se tiveres um dropdown de filtro para ocorrências, com .dropdown-menu .dropdown-item
    // (semelhante ao que tens em auditorias), seleciona os itens:
    const itensDropdown = document.querySelectorAll(".dropdown-menu .dropdown-item");
  
    // Armazena o último estado selecionado, se precisares manter
    let estadoFiltroAtual = "";
  
    function aplicarFiltro(estado) {
      estadoFiltroAtual = estado;
  
      // Seleciona as linhas da tabela de ocorrências
      const linhasTabela = document.querySelectorAll("#tabela-ocorrencias tbody tr");
  
      linhasTabela.forEach(linha => {
        // Onde estiver a indicação do estado na linha (ex: .estado-ocorrencia), lê o texto
        const badge = linha.querySelector(".estado-ocorrencia");
        const estadoLinha = badge?.textContent.trim();
  
        // Se “estado” for vazio ou corresponder, mostra a linha; senão, esconde
        if (!estado || estadoLinha === estado) {
          linha.style.display = "";
        } else {
          linha.style.display = "none";
        }
      });
    }
  
    itensDropdown.forEach(item => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const estadoSelecionado = this.getAttribute("data-estado");
        aplicarFiltro(estadoSelecionado);
      });
    });
  
  });
  
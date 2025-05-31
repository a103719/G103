
    document.addEventListener("DOMContentLoaded", function () {
      const btnVerMais = document.getElementById("btn-ver-mais");
      const icone = btnVerMais.querySelector("iconify-icon");
      const limiteInicial = 5;
      let expandido = false;
  
      function aplicarLimite() {
        const todasAsLinhas = Array.from(document.querySelectorAll("#tabela-auditorias tbody tr"));
        const linhasVisiveis = todasAsLinhas.filter(tr => tr.dataset.match !== "false");
  
        linhasVisiveis.forEach((linha, index) => {
          linha.style.display = (!expandido && index >= limiteInicial) ? "none" : "";
        });
  
        btnVerMais.style.display = linhasVisiveis.length > limiteInicial ? "inline-block" : "none";
      }
  
      btnVerMais.addEventListener("click", () => {
        expandido = !expandido;
        aplicarLimite();
        icone.setAttribute("icon", expandido ? "mdi:chevron-up" : "mdi:chevron-down");
      });
  
      // Expor função global para chamar após filtro
      window.reaplicarLimiteAuditorias = function () {
        expandido = false;
        aplicarLimite();
        icone.setAttribute("icon", "mdi:chevron-down");
      };
  
      aplicarLimite();
    });
  
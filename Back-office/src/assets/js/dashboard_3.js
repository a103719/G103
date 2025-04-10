document.addEventListener("DOMContentLoaded", function () {
    atualizarTotaisResolvidosBaseadoNoDia();
  });
  
  function atualizarTotaisResolvidosBaseadoNoDia() {
    const lista = JSON.parse(localStorage.getItem("ocorrenciasLista") || "[]");
  
    let totalDia = 0;
  
    // Conta quantas estão com estado "Resolvido"
    lista.forEach(ocorrencia => {
      if (ocorrencia.estado === "Resolvido") {
        totalDia++;
      }
    });
  
    const totalMes = totalDia * 31;
    const totalAno = totalDia * 365;
  
    // Atualiza os valores nas <h4> respetivas (Dia, Mês, Ano)
    const colunas = document.querySelectorAll('#resolvidasPorPeriodo .col-4 h4');
    if (colunas.length === 3) {
      colunas[0].textContent = totalDia;
      colunas[1].textContent = totalMes;
      colunas[2].textContent = totalAno;
    }
  }
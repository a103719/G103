document.addEventListener("DOMContentLoaded", () => {
  atualizarResolvidasMedia7d();
});

function atualizarResolvidasMedia7d() {
  const hist =
    JSON.parse(localStorage.getItem("historicoOcorrenciasPorEstado") || "{}");

  const ultimos7dias = obterDatasConsecutivas(7);     
  let somaResolvido  = 0;

  ultimos7dias.forEach(dia => {
    somaResolvido += (hist[dia]?.resolvido || 0);
  });

  const mediaDia = Math.round(somaResolvido / 7);      
  const projMes  = mediaDia * 31;                     
  const projAno  = mediaDia * 365;

  const h4s = document.querySelectorAll('#resolvidasPorPeriodo .col-4 h4');
  if (h4s.length === 3) {
    h4s[0].textContent = mediaDia;  
    h4s[1].textContent = projMes;
    h4s[2].textContent = projAno;
  }
}

function obterDatasConsecutivas(n) {
  const arr = [];
  const hoje = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    arr.push(d.toISOString().split("T")[0]); 
  }
  return arr;
}

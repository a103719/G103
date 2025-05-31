document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("graficoOcorrencias");
  if (!ctx) return;

  const historico = JSON.parse(localStorage.getItem("historicoOcorrenciasPorEstado") || {});
  const dias = obterUltimosDias(7); // últimos 7 dias (hoje incluído)
  const hoje = dias[dias.length - 1];

  // Valores fixos simulados para os 6 dias anteriores
  const dadosManuais = [
    { pendente: 2, emAnalise: 2, resolvido: 2 },
    { pendente: 1, emAnalise: 3, resolvido: 1 },
    { pendente: 3, emAnalise: 1, resolvido: 2 },
    { pendente: 2, emAnalise: 2, resolvido: 3 },
    { pendente: 0, emAnalise: 2, resolvido: 4 },
    { pendente: 1, emAnalise: 1, resolvido: 2 }
  ];

  // Preenche (ou sobrescreve) os dias anteriores com os dados fixos
  dias.slice(0, -1).forEach((dia, index) => {
    const dados = dadosManuais[index] || { pendente: 0, emAnalise: 0, resolvido: 0 };
    const total = dados.pendente + dados.emAnalise + dados.resolvido;
    historico[dia] = { ...dados, total };
  });

  // Garante que o dia de hoje tem entrada (sem alterar, se já existir)
  if (!historico[hoje]) {
    historico[hoje] = { pendente: 0, emAnalise: 0, resolvido: 0, total: 0 };
  }

  // Atualiza localStorage
  localStorage.setItem("historicoOcorrenciasPorEstado", JSON.stringify(historico));

  const labels = dias.map(formatarData);
  const dadosPendentes = dias.map(d => historico[d]?.pendente || 0);
  const dadosEmAnalise = dias.map(d => historico[d]?.emAnalise || 0);
  const dadosResolvido = dias.map(d => historico[d]?.resolvido || 0);
  const dadosTotal = dias.map(d => historico[d]?.total || 0);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total",
          data: dadosTotal,
          borderColor: "#8e24aa",
          tension: 0.3,
          fill: false
        },
        {
          label: "Pendentes",
          data: dadosPendentes,
          borderColor: "#42a5f5",
          tension: 0.3,
          fill: false
        },
        {
          label: "Em análise",
          data: dadosEmAnalise,
          borderColor: "#29b6f6",
          tension: 0.3,
          fill: false
        },
        {
          label: "Resolvidas",
          data: dadosResolvido,
          borderColor: "#66bb6a",
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { mode: 'index', intersect: false }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
          title: { display: true, text: 'Dia' }
        },
        y: {
          title: { display: true, text: 'Nº de Ocorrências' },
          beginAtZero: true,
          ticks: {
            precision: 0,
            stepSize: 1
          }
        }
      }
    }
  });
});

function obterUltimosDias(n) {
  const dias = [];
  const hoje = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    dias.push(d.toISOString().split("T")[0]);
  }
  return dias;
}

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const elValor = document.getElementById("tmr");
  if (!elValor) return;

  const lista = JSON.parse(localStorage.getItem("ocorrenciasLista")) || [];

  // 1) Filtra só as ocorrências que têm ambos createdAt e resolvedAt
  const deltas = lista
    .filter(o => o.createdAt && o.resolvedAt)
    .map(o => {
      // Se forem strings ISO, converte-as para milissegundos
      const inicio = typeof o.createdAt === "string"
        ? Date.parse(o.createdAt)
        : o.createdAt;
      const fim = typeof o.resolvedAt === "string"
        ? Date.parse(o.resolvedAt)
        : o.resolvedAt;
      return fim - inicio;
    });

  // 2) Se não houver nenhuma, mostra “—”
  if (deltas.length === 0) {
    elValor.textContent = "—";
    return;
  }

  // 3) Calcula a média em ms
  const msMedia = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;

  // 4) Converte ms → horas, minutos, segundos
  const pad = n => String(n).padStart(2, "0");
  const hh = Math.floor(msMedia / 3_600_000);
  const mm = Math.floor((msMedia % 3_600_000) / 60_000);
  const ss = Math.floor((msMedia % 60_000) / 1000);

  elValor.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
});


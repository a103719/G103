import { getDados } from "./storage.js";


// Função que cria o cartão de ocorrência
function criarCartaoOcorrencia(o, modo = "resumo") {
  const estadoNormalizado = o.estado.toLowerCase();
  const estadoClasse = estadoNormalizado === "pendente" ? "pendente"
                      : estadoNormalizado === "análise" ? "analise"
                      : "resolvida";

  return `
    <div style="background-color: #eceeff; border-radius: 12px; padding: 12px;">
      📌 Tipo: ${o.designacao}<br/>
      📍 Latitude: ${o.latitude?.toFixed(5)}, Longitude: ${o.longitude?.toFixed(5)}<br/>
      📅 ${o.data}<br/>
      ${o.foto && modo === "detalhe" ? `
         <p>📝 Descrição: ${o.descricao || o.titulo}</p>
         <p>📎 Observações: ${o.observacoes || "—"}</p> 
         <img src="${o.foto}" alt="Imagem" style="width: 100%; margin-top: 8px; border-radius: 8px;" />` : ""}
      <div class="estado" style="margin-top: 12px;">
        <span class="bolinha ${estadoClasse}"></span> ${o.estado.charAt(0).toUpperCase() + o.estado.slice(1)}
        ${modo === "resumo" ? `<img src="https://img.icons8.com/ios-glyphs/20/000000/search--v1.png"
          alt="lupa" style="margin-left:8px; cursor:pointer;" onclick='verDetalhe("${o.designacao}")'/>` : ""}
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const utilizador = localStorage.getItem("idUtilizador") || "Manuel Silva";
  const dados = getDados();
  const todas = dados.ocorrenciasLista || [];

  // Filtra e ordena por data decrescente
  window.minhas = todas
    .filter(o => o.utilizador === utilizador)
    .sort((a, b) => new Date(b.data) - new Date(a.data)); // <- Aqui é onde se ordena

  window.container = document.getElementById("lista-ocorrencias");

  function mostrar(ocorrenciasParaMostrar, titulo = "Histórico de Ocorrências") {
    container.innerHTML = "";

    if (ocorrenciasParaMostrar.length === 0) {
      container.innerHTML = "<p style='text-align:center;'>Sem ocorrências registadas.</p>";
      return;
    }

    document.querySelector("h1").textContent = titulo;

    if (titulo !== "Histórico de Ocorrências") {
      const btnVoltar = document.createElement("button");
      btnVoltar.textContent = "← Ver todas";
      btnVoltar.className = "btn-voltar";
      btnVoltar.onclick = () => mostrar(window.minhas, "Histórico de Ocorrências");
      container.appendChild(btnVoltar);
    }

    ocorrenciasParaMostrar.forEach(o => {
      const div = document.createElement("div");
      div.className = "input-wrapper";
      div.innerHTML = criarCartaoOcorrencia(o, "resumo");
      container.appendChild(div);
    });
  }

  window.mostrar = mostrar;
  mostrar(window.minhas);
});

window.verDetalhe = (designacaoAlvo) => {
  const ocorrencia = window.minhas.find(o => o.designacao === designacaoAlvo);
  if (!ocorrencia) return;

  window.container.innerHTML = "";
  document.querySelector("h1").textContent = "Detalhe da Ocorrência";

  const div = document.createElement("div");
  div.className = "input-wrapper";
  div.innerHTML = criarCartaoOcorrencia(ocorrencia, "detalhe") + `
    <button onclick="voltarAoHistorico()" class="btn-voltar" style="margin-top: 12px;">← Voltar ao histórico</button>
  `;
  window.container.appendChild(div);
};

window.voltarAoHistorico = () => {
  if (typeof window.mostrar === "function") {
    window.mostrar(window.minhas);
  }
};

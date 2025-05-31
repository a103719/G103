// gestao_ocorrencias.js
function occKey(txt) {
  const i = txt.indexOf('/');
  return (i !== -1 ? txt.slice(i + 1) : txt).trim();
}

document.addEventListener("DOMContentLoaded", function () {
  const btnAprovar = document.getElementById("btn-aprovar");
  const btnRecusar = document.getElementById("btn-recusar");
  const btnSalvar  = document.getElementById("btn-salvar");

  const observacoes  = document.getElementById("input-observacoes");
  const estadoSelect = document.querySelector("select.estado-select");

  let linhaSelecionada = null;

  const estadosGuardados      = JSON.parse(localStorage.getItem("ocorrenciasEstados")      || "{}");
  const observacoesGuardadas  = JSON.parse(localStorage.getItem("ocorrenciasObservacoes")  || "{}");
  const segurancasGuardados   = JSON.parse(localStorage.getItem("ocorrenciasSegurancas")   || "{}");

  window.addEventListener("ocorrenciasRenderizadas", () => {
    const designacao = tr.cells[0].textContent.trim();

    if (estadosGuardados[designacao]) {
      const novoEstado = estadosGuardados[designacao];
      const badge = tr.querySelector(".estado-ocorrencia");
      badge.textContent = novoEstado;
      badge.className = "badge rounded-pill estado-ocorrencia";
      if (novoEstado === "Pendente") {
        badge.classList.add("bg-primary");
      } else if (novoEstado === "Em análise") {
        badge.classList.add("bg-info", "text-white");
      } else if (novoEstado === "Resolvido") {
        badge.classList.add("bg-success");
      }
    }

    if (observacoesGuardadas[designacao]) {
      tr.setAttribute("data-observacoes", observacoesGuardadas[designacao]);
    }

    if (segurancasGuardados[designacao]) {
      tr.setAttribute("data-seguranca", segurancasGuardados[designacao]);
    }
    sincronizarOcorrenciasNaStorage();
  });

  window.mostrarDetalhes = function (icon) {
    const linha = icon.closest("tr");
    linhaSelecionada = linha;

    const idDesc      = linha.cells[0].textContent.trim();
    const designacao   = occKey(idDesc); 
    const utilizador   = linha.cells[1].textContent.trim();
    const localizacao  = linha.cells[2].textContent.trim();
    const foto         = linha.dataset.foto;              
    const imgEl        = document.getElementById("fotoOcorrencia");
    imgEl.src = foto || "../assets/images/products/Carro-mal-estacionado.jpg";

    document.querySelector(".campo-designacao").textContent = designacao;
    document.querySelector(".campo-nome").textContent       = utilizador;
    document.querySelector(".campo-localizacao").textContent= localizacao;

     // Vai buscar o array de ocorrências ao localStorage
    const ocorrencias = JSON.parse(localStorage.getItem("ocorrenciasLista") || "[]");
    
// Procura o objeto correto (pelo designacao e utilizador)
    const obj = ocorrencias.find(o =>
        o.designacao === idDesc &&
        o.utilizador === utilizador
    );

    // Vai buscar a descrição (ou string vazia se não existir)
    const descricao = obj && obj.descricao ? obj.descricao : "";
    
    // Meter na textarea
    const textareaDesc = document.getElementById("descricaoOcorrencia");
    textareaDesc.value = descricao;

    const badge       = linha.querySelector(".estado-ocorrencia");
    const estadoAtual = badge?.textContent.trim();
    if (estadoAtual) estadoSelect.value = estadoAtual;

    observacoes.value = linha.getAttribute("data-observacoes") || "";
    const segurancaAtual  = linha.getAttribute("data-seguranca") || "";
    const listaSegurancas = segurancaAtual.split(";");

    atualizarCheckboxesPeritos();

    setTimeout(() => {
      const checkboxes = document.querySelectorAll(".seguranca-checkbox");
      checkboxes.forEach(cb => {
        cb.checked = listaSegurancas.includes(cb.value);
      });
    }, 10);

    if (estadoAtual === "Pendente") {
      btnAprovar.style.display = "";
      btnRecusar.style.display = "";
      bloquearEdicao();
    } else if (estadoAtual === "Em análise") {
      btnAprovar.style.display = "none";
      btnRecusar.style.display = "none";
      desbloquearEdicao();
    } else {
      btnAprovar.style.display = "none";
      btnRecusar.style.display = "none";
      bloquearEdicao();
    }
    const fotoDataUrl = linha.dataset.foto;

    if (fotoDataUrl) {
      imgEl.src = fotoDataUrl;
    } else {
      imgEl.src = "../assets/images/products/Carro-mal-estacionado.jpg"; 
    }

    document.getElementById("cartao-detalhes").style.display = "block";
  };

  function desbloquearEdicao() {
    document.querySelectorAll(".campo-editavel").forEach(el => el.disabled = false);
    document.querySelectorAll(".seguranca-checkbox").forEach(el => el.disabled = false);
    observacoes.disabled = false;
    btnSalvar.disabled = false;
  }

  function bloquearEdicao() {
    document.querySelectorAll(".campo-editavel").forEach(el => el.disabled = true);
    document.querySelectorAll(".seguranca-checkbox").forEach(el => el.disabled = true);
    observacoes.disabled = true;
    btnSalvar.disabled = true;
  }

  if (btnAprovar) {
    btnAprovar.addEventListener("click", function () {
      desbloquearEdicao();
      btnAprovar.style.display = "none";
      btnRecusar.style.display = "none";
    });
  }

if (btnRecusar) {
  btnRecusar.addEventListener("click", () => {
    if (!linhaSelecionada) return;

    // 1) Lê os dois valores chave-únicos
    const designacaoFull = linhaSelecionada.cells[0].textContent.trim();
    const utilizadorFull = linhaSelecionada.cells[1].textContent.trim();

    // 2) Remove da lista principal
    let lista = JSON.parse(localStorage.getItem("ocorrenciasLista") || "[]");
    lista = lista.filter(o => !(o.designacao === designacaoFull && o.utilizador === utilizadorFull));
    localStorage.setItem("ocorrenciasLista", JSON.stringify(lista));

    // 3) Remove dos mapas auxiliares
    ["ocorrenciasEstados", "ocorrenciasObservacoes", "ocorrenciasSegurancas"].forEach(key => {
      const mapa = JSON.parse(localStorage.getItem(key) || "{}");
      if (mapa[designacaoFull] != null) {
        delete mapa[designacaoFull];
        localStorage.setItem(key, JSON.stringify(mapa));
      }
    });

    // 4) Subtrair 10 pontos ao utilizador corretamente em 'pontosUtilizadores'
    const state = JSON.parse(localStorage.getItem("eyesEverywhereState") || "{}");
    if (state.pontosUtilizadores && state.pontosUtilizadores[utilizadorFull] != null) {
      state.pontosUtilizadores[utilizadorFull] -= 10;
      if (state.pontosUtilizadores[utilizadorFull] < 0) state.pontosUtilizadores[utilizadorFull] = 0;
      localStorage.setItem("eyesEverywhereState", JSON.stringify(state));
    }

    // 5) Limpa UI
    linhaSelecionada.remove();
    linhaSelecionada = null;
    document.getElementById("cartao-detalhes").style.display = "none";

    // 6) Atualiza renderizadores
    window.dispatchEvent(new Event("ocorrenciasAtualizadas"));
  });
}




  btnSalvar.addEventListener("click", function () {
    if (!linhaSelecionada) return;

    const designacao = linhaSelecionada.cells[0].textContent.trim();
    const utilizador = linhaSelecionada.cells[1].textContent.trim(); 
    const novoEstado = estadoSelect.value;
    const novaObs    = observacoes.value.trim();
    const segurancasSelecionados = Array.from(document.querySelectorAll(".seguranca-checkbox"))
      .filter(cb => cb.checked)
      .map(cb => cb.value)
      .join(";");

    const badge = linhaSelecionada.querySelector(".estado-ocorrencia");
    if (badge) {
      badge.textContent = novoEstado;
      badge.className   = "badge rounded-pill estado-ocorrencia";

      const hoje      = new Date().toISOString().split("T")[0];
      const historico = JSON.parse(localStorage.getItem("historicoOcorrenciasPorEstado") || "{}");

      if (!historico[hoje]) {
        historico[hoje] = { pendente: 0, emAnalise: 0, resolvido: 0 };
      }

      if (novoEstado === "Pendente") {
        badge.classList.add("bg-primary");
        historico[hoje].pendente += 1;
      } else if (novoEstado === "Em análise") {
        badge.classList.add("bg-info", "text-white");
        historico[hoje].emAnalise += 1;
      } else if (novoEstado === "Resolvido") {
        badge.classList.add("bg-success");
        historico[hoje].resolvido += 1;

        localStorage.setItem("novaAuditoriaCriada", "true");

        const auditoriasPendentes = JSON.parse(localStorage.getItem("auditoriasPendentes") || "[]");
        if (!auditoriasPendentes.includes(designacao)) {
          auditoriasPendentes.push(designacao);
          localStorage.setItem("auditoriasPendentes", JSON.stringify(auditoriasPendentes));
        }
      }

      historico[hoje].total =
        historico[hoje].pendente +
        historico[hoje].emAnalise +
        historico[hoje].resolvido;

      localStorage.setItem("historicoOcorrenciasPorEstado", JSON.stringify(historico));
    }

    linhaSelecionada.setAttribute("data-observacoes", novaObs);
    linhaSelecionada.setAttribute("data-seguranca", segurancasSelecionados);

    estadosGuardados[designacao] = novoEstado;

    const observacoesGuardadasAtualizadas = JSON.parse(localStorage.getItem("ocorrenciasObservacoes") || "{}");
    observacoesGuardadasAtualizadas[designacao] = novaObs;
    localStorage.setItem("ocorrenciasObservacoes", JSON.stringify(observacoesGuardadasAtualizadas));

    const segurancasGuardadosAtualizados = JSON.parse(localStorage.getItem("ocorrenciasSegurancas") || "{}");
    segurancasGuardadosAtualizados[designacao] = segurancasSelecionados;
    localStorage.setItem("ocorrenciasSegurancas", JSON.stringify(segurancasGuardadosAtualizados));

    localStorage.setItem("ocorrenciasEstados", JSON.stringify(estadosGuardados));

    const listaOcorrenciasAtual = JSON.parse(localStorage.getItem("ocorrenciasLista") || "[]");

    const localizacaoTexto  = linhaSelecionada.cells[2]?.textContent?.trim();
    const coordenadasMatch  = localizacaoTexto?.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    let latitude = null, longitude = null;

    if (coordenadasMatch) {
      latitude  = Number(coordenadasMatch[1]);
      longitude = Number(coordenadasMatch[2]);
    }

    const idxExist = listaOcorrenciasAtual.findIndex(o => o.designacao === designacao);
    const agora    = Date.now();

    let novoItem;
    if (idxExist !== -1) {
      novoItem = { ...listaOcorrenciasAtual[idxExist] };          // cópia
    } else {
      novoItem = {
        designacao,
        createdAt: agora,
        firstResponseAt: null,
        resolvedAt: null,
      };
    }

    novoItem.utilizador  = utilizador;
    novoItem.estado      = novoEstado;
    novoItem.latitude    = latitude;
    novoItem.longitude   = longitude;
    novoItem.segurancas  = segurancasSelecionados;
    novoItem.foto        = linhaSelecionada.dataset.foto || "";

    if (novoEstado === "Em análise" && !novoItem.firstResponseAt) {
      novoItem.firstResponseAt = agora;
    }
    if (novoEstado === "Resolvido" && !novoItem.resolvedAt) {
      novoItem.resolvedAt = agora;
    }

    if (idxExist !== -1) {
      listaOcorrenciasAtual[idxExist] = novoItem;
    } else {
      listaOcorrenciasAtual.push(novoItem);
    }

    localStorage.setItem("ocorrenciasLista", JSON.stringify(listaOcorrenciasAtual));
    console.log("Ocorrências atualizadas:", listaOcorrenciasAtual);
    window.dispatchEvent(new Event("ocorrenciasAtualizadas"));

    const notificacao = {
      titulo: "Ocorrência atualizada",
      mensagem: `A ocorrência "${designacao}" foi marcada como ${novoEstado}.`,
      tipo: novoEstado === "Resolvido" ? "success" : "info"
    };
    localStorage.setItem("notificacaoPorMostrar", JSON.stringify(notificacao));

    bloquearEdicao();
    document.getElementById("cartao-detalhes").style.display = "none";
  });



  function atualizarCheckboxesPeritos() {
    const container = document.getElementById("lista-peritos-checkboxes");
    if (!container) return;

    container.innerHTML = "";

    const listaDePeritos = JSON.parse(localStorage.getItem("peritos")) || [];
    const segurancasDisponiveis = listaDePeritos.filter(perito => {
      return perito.area === "Segurança" && perito.estado !== "indisponivel";
    });

    segurancasDisponiveis.forEach(perito => {
      const div = document.createElement("div");
      div.className = "form-check col-md-6";
      div.innerHTML = `
        <input class="form-check-input seguranca-checkbox campo-editavel" type="checkbox" value="${perito.nome}" disabled>
        <label class="form-check-label">${perito.nome}</label>
      `;
      container.appendChild(div);
    });
  }

  atualizarCheckboxesPeritos();
  
  (function sincronizarOcorrenciasNaStorage() {
  const linhas = document.querySelectorAll("tbody tr");
  const ocorrencias = [];

  linhas.forEach(tr => {
    const designacao = tr.cells[0]?.textContent?.trim();
    const utilizador = tr.cells[1]?.textContent?.trim() || "—"; 
    const badge      = tr.querySelector(".estado-ocorrencia");
    const estado     = badge?.textContent?.trim();
    const localizacaoTexto = tr.cells[2]?.textContent?.trim();
    const coordenadasMatch = localizacaoTexto?.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    const foto = tr.dataset.foto || "";
    let latitude = null, longitude = null;

    if (coordenadasMatch) {
      latitude  = parseFloat(coordenadasMatch[1]);
      longitude = parseFloat(coordenadasMatch[2]);
    }

    // Só processa se já existir designação e estado
    if (designacao && estado) {
      // Pega a lista antiga (legado) para tentar resgatar timestamps e descrição
      const listaPrev = JSON.parse(localStorage.getItem("ocorrenciasLista") || "[]");
      const prev = listaPrev.find(o =>
        o.designacao === designacao &&
        o.utilizador === utilizador
      );

      ocorrencias.push({
        designacao,
        utilizador,
        estado,
        latitude,
        longitude,
        segurancas: tr.getAttribute("data-seguranca") || "",
        foto,
        // recupera a descrição que havia em `prev.descricao`, se existir:
        descricao: prev?.descricao || "",
        // agora sim, define createdAt corretamente:
        createdAt:       prev?.createdAt       || Date.now(),
        firstResponseAt: prev?.firstResponseAt || null,
        resolvedAt:      prev?.resolvedAt      || null
      });
    }
  });

  // Finalmente grava a lista reconstruída
  localStorage.setItem("ocorrenciasLista", JSON.stringify(ocorrencias));
})();

  
});

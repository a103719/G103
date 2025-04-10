// gestao_ocorrencias.js

document.addEventListener("DOMContentLoaded", function () {
  const btnAprovar = document.getElementById("btn-aprovar");
  const btnRecusar = document.getElementById("btn-recusar");
  const btnSalvar = document.getElementById("btn-salvar");

  const observacoes = document.getElementById("input-observacoes");
  const estadoSelect = document.querySelector("select.estado-select");

  let linhaSelecionada = null;

  const estadosGuardados = JSON.parse(localStorage.getItem("ocorrenciasEstados") || "{}");
  const observacoesGuardadas = JSON.parse(localStorage.getItem("ocorrenciasObservacoes") || "{}");
  const segurancasGuardados = JSON.parse(localStorage.getItem("ocorrenciasSegurancas") || "{}");

  document.querySelectorAll("tbody tr").forEach(tr => {
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
  });

  window.mostrarDetalhes = function (icon) {
    const linha = icon.closest("tr");
    linhaSelecionada = linha;

    const designacao = linha.cells[0].textContent.trim();
    const utilizador = linha.cells[1].textContent.trim();
    const localizacao = linha.cells[2].textContent.trim();

    document.querySelector(".campo-designacao").textContent = designacao;
    document.querySelector(".campo-nome").textContent = utilizador;
    document.querySelector(".campo-localizacao").textContent = localizacao;

    const badge = linha.querySelector(".estado-ocorrencia");
    const estadoAtual = badge?.textContent.trim();
    if (estadoAtual) estadoSelect.value = estadoAtual;

    observacoes.value = linha.getAttribute("data-observacoes") || "";
    const segurancaAtual = linha.getAttribute("data-seguranca") || "";
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
    btnRecusar.addEventListener("click", function () {
      document.getElementById("cartao-detalhes").style.display = "none";
    });
  }

  btnSalvar.addEventListener("click", function () {
    if (!linhaSelecionada) return;

    const designacao = linhaSelecionada.cells[0].textContent.trim();
    const novoEstado = estadoSelect.value;
    const novaObs = observacoes.value.trim();
    const segurancasSelecionados = Array.from(document.querySelectorAll(".seguranca-checkbox"))
      .filter(cb => cb.checked)
      .map(cb => cb.value)
      .join(";");

    const badge = linhaSelecionada.querySelector(".estado-ocorrencia");
    if (badge) {
      badge.textContent = novoEstado;
      badge.className = "badge rounded-pill estado-ocorrencia";
      if (novoEstado === "Pendente") {
        badge.classList.add("bg-primary");
      } else if (novoEstado === "Em análise") {
        badge.classList.add("bg-info", "text-white");
      } else if (novoEstado === "Resolvido") {
        badge.classList.add("bg-success");
        localStorage.setItem("novaAuditoriaCriada", "true");
        const auditoriasPendentes = JSON.parse(localStorage.getItem("auditoriasPendentes") || "[]");
        if (!auditoriasPendentes.includes(designacao)) {
          auditoriasPendentes.push(designacao);
          localStorage.setItem("auditoriasPendentes", JSON.stringify(auditoriasPendentes));
        }
      }
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

    // Atualizar lista geral de ocorrências (usada na dashboard)
    const listaOcorrenciasAtual = JSON.parse(localStorage.getItem("ocorrenciasLista")) || [];
    const novoItem = { designacao, estado: novoEstado };

    const index = listaOcorrenciasAtual.findIndex(o => o.designacao === designacao);
    if (index !== -1) {
      listaOcorrenciasAtual[index] = novoItem;
    } else {
      listaOcorrenciasAtual.push(novoItem);
    }
    localStorage.setItem("ocorrenciasLista", JSON.stringify(listaOcorrenciasAtual));
    const notificacao = {
      titulo: "Ocorrência atualizada",
      mensagem: `A ocorrência "${designacao}" foi marcada como ${novoEstado}.`,
      tipo: novoEstado === "Resolvido" ? "success" : "info"
    };
    
    localStorage.setItem("notificacaoPorMostrar", JSON.stringify(notificacao));
    
    bloquearEdicao();
    document.getElementById("cartao-detalhes").style.display = "none";
  });

  document.getElementById("btn-reset-localstorage").addEventListener("click", function () {
    if (confirm("Tens a certeza que queres limpar todos os dados guardados localmente?")) {
      localStorage.removeItem("ocorrenciasEstados");
      localStorage.removeItem("auditoriasPendentes");
      localStorage.removeItem("auditorias");
      localStorage.removeItem("ocorrenciasLista");
      localStorage.removeItem("ocorrenciasObservacoes");
      localStorage.removeItem("ocorrenciasSegurancas");
      location.reload();
    }
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
  // Garante que ocorenciasLista está preenchido no início
(function sincronizarOcorrenciasNaStorage() {
  const linhas = document.querySelectorAll("tbody tr");
  const ocorrencias = [];

  linhas.forEach(tr => {
    const designacao = tr.cells[0]?.textContent?.trim();
    const badge = tr.querySelector(".estado-ocorrencia");
    const estado = badge?.textContent?.trim();

    if (designacao && estado) {
      ocorrencias.push({ designacao, estado });
    }
  });

  localStorage.setItem("ocorrenciasLista", JSON.stringify(ocorrencias));
})();

});

// gestao_ocorrencias.js

document.addEventListener("DOMContentLoaded", function () {
  const btnAprovar = document.getElementById("btn-aprovar");
  const btnRecusar = document.getElementById("btn-recusar");
  const btnSalvar = document.getElementById("btn-salvar");

  const camposEditaveis = document.querySelectorAll(".campo-editavel");
  const checkboxesSeguranca = document.querySelectorAll(".seguranca-checkbox");
  const observacoes = document.getElementById("input-observacoes");
  const estadoSelect = document.querySelector("select.estado-select");

  let linhaSelecionada = null;

  // Carregar estados do localStorage ao iniciar
  const estadosGuardados = JSON.parse(localStorage.getItem("ocorrenciasEstados") || "{}");

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
    checkboxesSeguranca.forEach(cb => {
      cb.checked = listaSegurancas.includes(cb.value);
    });

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
    camposEditaveis.forEach(el => el.disabled = false);
    checkboxesSeguranca.forEach(el => el.disabled = false);
    observacoes.disabled = false;
    btnSalvar.disabled = false;
  }

  function bloquearEdicao() {
    camposEditaveis.forEach(el => el.disabled = true);
    checkboxesSeguranca.forEach(el => el.disabled = true);
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

    const novoEstado = estadoSelect.value;
    const novaObs = observacoes.value.trim();
    const segurancasSelecionados = Array.from(checkboxesSeguranca)
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

        // Se resolvido, adicionar à lista de auditorias pendentes
        const designacao = linhaSelecionada.cells[0].textContent.trim();
        const auditoriasPendentes = JSON.parse(localStorage.getItem("auditoriasPendentes") || "[]");
        if (!auditoriasPendentes.includes(designacao)) {
          auditoriasPendentes.push(designacao);
          localStorage.setItem("auditoriasPendentes", JSON.stringify(auditoriasPendentes));
        }
      }
    }

    linhaSelecionada.setAttribute("data-observacoes", novaObs);
    linhaSelecionada.setAttribute("data-seguranca", segurancasSelecionados);

    // Atualizar localStorage com novo estado
    const designacao = linhaSelecionada.cells[0].textContent.trim();
    estadosGuardados[designacao] = novoEstado;
    localStorage.setItem("ocorrenciasEstados", JSON.stringify(estadosGuardados));

    bloquearEdicao();
    document.getElementById("cartao-detalhes").style.display = "none";
  });
  document.getElementById("btn-reset-localstorage").addEventListener("click", function () {
    if (confirm("Tens a certeza que queres limpar todos os dados guardados localmente?")) {
      localStorage.removeItem("ocorrenciasEstados");
      localStorage.removeItem("auditoriasPendentes");
      localStorage.removeItem("auditorias");
      location.reload(); // Atualiza a página para refletir o reset
    }
  });
  
});

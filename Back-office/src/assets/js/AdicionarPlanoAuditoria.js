let linhaEmEdicao = null;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPlanoAuditoria");
  const botaoSubmit = document.getElementById("btn-submit-plano");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomePlano = document.getElementById("input-nome-plano").value.trim();
    const dataAuditoria = document.getElementById("input-data-auditoria").value;
    const ocorrencias = Array.from(document.querySelectorAll("#ocorrencias-relacionadas .badge"))
      .map(span => span.textContent.trim());
    const materiais = document.getElementById("input-materiais").value.trim();
    const duracao = document.getElementById("input-duracao").value.trim();
    const descricao = document.getElementById("input-descricao").value.trim();

    const checkboxes = document.querySelectorAll('#checkbox-peritos input[type="checkbox"]');
    const peritosSelecionados = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value)
      .join(" / ");

    if (!nomePlano || !dataAuditoria || ocorrencias.length === 0 || !peritosSelecionados) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const ocorrenciasTexto = ocorrencias.join(", ");

    if (linhaEmEdicao) {
      linhaEmEdicao.children[0].textContent = nomePlano;
      linhaEmEdicao.children[1].textContent = ocorrenciasTexto;
      linhaEmEdicao.children[2].textContent = dataAuditoria;
      linhaEmEdicao.children[3].textContent = peritosSelecionados;
      linhaEmEdicao.setAttribute("data-materiais", materiais);
      linhaEmEdicao.setAttribute("data-duracao", duracao);
      linhaEmEdicao.setAttribute("data-descricao", descricao);
      linhaEmEdicao.children[4].innerHTML = '<span class="badge bg-success">Criado</span>';
      linhaEmEdicao.children[5].innerHTML = `
        <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark"
          onclick="editarPlano(this)" title="Editar"></iconify-icon>
      `;
      linhaEmEdicao = null;
    } else {
      const novaLinha = document.createElement("tr");
      novaLinha.setAttribute("data-materiais", materiais);
      novaLinha.setAttribute("data-duracao", duracao);
      novaLinha.setAttribute("data-descricao", descricao);

      novaLinha.innerHTML = `
        <td>${nomePlano}</td>
        <td>${ocorrenciasTexto}</td>
        <td>${dataAuditoria}</td>
        <td>${peritosSelecionados}</td>
        <td><span class="badge bg-success">Criado</span></td>
        <td>
          <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark"
            onclick="editarPlano(this)" title="Editar"></iconify-icon>
        </td>
      `;

      document.querySelector("tbody").appendChild(novaLinha);
    }

    form.reset();
    fecharFormulario();
  });
});

function mostrarFormulario(icone = null) {
  document.getElementById("formularioPlano").style.display = "block";
  const botao = document.getElementById("btn-submit-plano");

  if (icone) {
    const linha = icone.closest("tr");
    linhaEmEdicao = linha;

    const nome = linha.children[0].textContent.trim();
    const data = linha.children[2].textContent.trim();
    const peritos = linha.children[3].textContent.trim();
    const materiais = linha.getAttribute("data-materiais") || "";
    const duracao = linha.getAttribute("data-duracao") || "";
    const descricao = linha.getAttribute("data-descricao") || "";
    const estado = linha.children[4].textContent.trim();
    const ocorrenciasArray = linha.children[1].textContent.split(",").map(o => o.trim());

    document.getElementById("input-nome-plano").value = nome !== "—" ? nome : "";
    document.getElementById("input-data-auditoria").value = data !== "—" ? data : "";
    document.getElementById("input-materiais").value = materiais;
    document.getElementById("input-duracao").value = duracao;
    document.getElementById("input-descricao").value = descricao;

    const divOcorrencias = document.getElementById("ocorrencias-relacionadas");
    divOcorrencias.innerHTML = ocorrenciasArray
      .map(o => `<span class="badge bg-primary me-1">${o}</span>`)
      .join("");

    const peritosArray = peritos.split(" / ").map(p => p.trim());
    document.querySelectorAll('#checkbox-peritos input[type="checkbox"]').forEach(cb => {
      cb.checked = peritosArray.includes(cb.value);
    });

    botao.textContent = (estado === "Por Criar") ? "Criar Plano" : "Atualizar";
  } else {
    botao.textContent = "Criar Plano";
  }

  document.getElementById("input-nome-plano").focus();
}

function fecharFormulario() {
  document.getElementById("formularioPlano").style.display = "none";
  document.getElementById("formPlanoAuditoria").reset();
  document.querySelectorAll('#checkbox-peritos input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById("ocorrencias-relacionadas").innerHTML = "";
  document.getElementById("btn-submit-plano").textContent = "Criar Plano";
  linhaEmEdicao = null;
}

function editarPlano(icone) {
  mostrarFormulario(icone);
}

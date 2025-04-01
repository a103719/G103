document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPlanoAuditoria");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomePlano = document.getElementById("input-nome-plano").value.trim();
    const dataAuditoria = document.getElementById("input-data-auditoria").value;
    const ocorrencia = document.getElementById("ocorrencia").selectedOptions[0]?.text;
    const perito = document.getElementById("select-perito").selectedOptions[0]?.text;

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!nomePlano || !dataAuditoria || !ocorrencia || !perito) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Criar nova linha da tabela
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `
      <td>${nomePlano}</td>
      <td>${ocorrencia}</td>
      <td>${dataAuditoria}</td>
      <td>${perito}</td>
      <td><span class="badge bg-success">Criado</span></td>
      <td>
        <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer" title="Editar"></iconify-icon>
      </td>
    `;

    // Adicionar à tabela
    const tabela = document.querySelector(".table tbody");
    tabela.appendChild(novaLinha);

    // Limpar o formulário
    form.reset();
  });
});

// Mostrar o formulário ao clicar nos ícones de "Criar" ou "Editar"
function mostrarFormulario() {
  document.getElementById("formularioPlano").style.display = "block";
  document.getElementById("input-nome-plano").focus();
}

// Evento de submissão do formulário
document.getElementById("formPlanoAuditoria").addEventListener("submit", function (e) {
  e.preventDefault();

  const ocorrencia = document.getElementById("ocorrencia").selectedOptions[0].text;
  const nomePlano = document.getElementById("input-nome-plano").value;
  const dataAuditoria = document.getElementById("input-data-auditoria").value;
  const peritoSelect = document.getElementById("select-perito");
  const perito = peritoSelect.options[peritoSelect.selectedIndex].text;

  // Criar nova linha da tabela
  const novaLinha = document.createElement("tr");
  novaLinha.innerHTML = `
    <td>${nomePlano}</td>
    <td>${ocorrencia}</td>
    <td>${dataAuditoria}</td>
    <td>${perito}</td>
    <td><span class="badge bg-success">Criado</span></td>
    <td>
      <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark" onclick="mostrarFormulario()"></iconify-icon>
    </td>
  `;

  document.querySelector("tbody").appendChild(novaLinha);

  // Esconde o formulário e limpa-o
  document.getElementById("formularioPlano").style.display = "none";
  document.getElementById("formPlanoAuditoria").reset();
});

function fecharFormulario() {
  document.getElementById("formularioPlano").style.display = "none";
  document.getElementById("formPlanoAuditoria").reset();
}



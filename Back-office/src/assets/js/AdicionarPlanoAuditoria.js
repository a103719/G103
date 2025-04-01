let linhaEmEdicao = null;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPlanoAuditoria");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomePlano = document.getElementById("input-nome-plano").value.trim();
    const dataAuditoria = document.getElementById("input-data-auditoria").value;
    const ocorrencia = document.getElementById("ocorrencia").selectedOptions[0]?.text;

    const checkboxes = document.querySelectorAll('#checkbox-peritos input[type="checkbox"]');
    const peritosSelecionados = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value)
      .join(" / ");

    if (!nomePlano || !dataAuditoria || !ocorrencia || !peritosSelecionados) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (linhaEmEdicao) {
      linhaEmEdicao.children[0].textContent = nomePlano;
      linhaEmEdicao.children[1].textContent = ocorrencia;
      linhaEmEdicao.children[2].textContent = dataAuditoria;
      linhaEmEdicao.children[3].textContent = peritosSelecionados;
      linhaEmEdicao.children[4].innerHTML = '<span class="badge bg-success">Criado</span>';
      linhaEmEdicao.children[5].innerHTML = `
        <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark" onclick="editarPlano(this)" title="Editar"></iconify-icon>
      `;
      linhaEmEdicao = null;
    } else {
      // Verifica se já existe uma linha "Por Criar" com a mesma ocorrência
      const linhas = document.querySelectorAll("tbody tr");
      let linhaExistente = null;
      linhas.forEach(linha => {
        const ocorr = linha.children[1]?.textContent?.trim();
        const estado = linha.children[4]?.textContent?.trim();
        if (ocorr === ocorrencia && estado === "Por Criar") {
          linhaExistente = linha;
        }
      });

      if (linhaExistente) {
        linhaExistente.children[0].textContent = nomePlano;
        linhaExistente.children[2].textContent = dataAuditoria;
        linhaExistente.children[3].textContent = peritosSelecionados;
        linhaExistente.children[4].innerHTML = '<span class="badge bg-success">Criado</span>';
        linhaExistente.children[5].innerHTML = `
          <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark" onclick="editarPlano(this)" title="Editar"></iconify-icon>
        `;
      } else {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
          <td>${nomePlano}</td>
          <td>${ocorrencia}</td>
          <td>${dataAuditoria}</td>
          <td>${peritosSelecionados}</td>
          <td><span class="badge bg-success">Criado</span></td>
          <td>
            <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark" onclick="editarPlano(this)" title="Editar"></iconify-icon>
          </td>
        `;
        document.querySelector("tbody").appendChild(novaLinha);
      }
    }

    form.reset();
    fecharFormulario();
  });
});

function mostrarFormulario() {
  document.getElementById("formularioPlano").style.display = "block";
  document.getElementById("input-nome-plano").focus();
}

function fecharFormulario() {
  document.getElementById("formularioPlano").style.display = "none";
  document.getElementById("formPlanoAuditoria").reset();
  document.querySelectorAll('#checkbox-peritos input[type="checkbox"]').forEach(cb => cb.checked = false);
  linhaEmEdicao = null;
}

function editarPlano(icone) {
  const linha = icone.closest("tr");
  const nomePlano = linha.children[0].textContent.trim();
  const ocorrencia = linha.children[1].textContent.trim();
  const data = linha.children[2].textContent.trim();
  const peritos = linha.children[3].textContent.trim().split(" / ").map(p => p.trim());

  document.getElementById("input-nome-plano").value = nomePlano !== "—" ? nomePlano : "";
  document.getElementById("input-data-auditoria").value = data !== "—" ? formatarDataParaInput(data) : "";

  const selectOcorrencia = document.getElementById("ocorrencia");
  for (let i = 0; i < selectOcorrencia.options.length; i++) {
    if (selectOcorrencia.options[i].text === ocorrencia) {
      selectOcorrencia.selectedIndex = i;
      break;
    }
  }

  document.querySelectorAll('#checkbox-peritos input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = peritos.includes(checkbox.value);
  });

  linhaEmEdicao = linha;
  mostrarFormulario();
}

function formatarDataParaInput(dataTexto) {
  const partes = dataTexto.split("/");
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dataTexto;
}

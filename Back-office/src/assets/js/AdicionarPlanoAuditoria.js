document.getElementById("formPlanoAuditoria").addEventListener("submit", function (e) {
    e.preventDefault(); // Impede o reload da página
  
    // Recolher os dados do formulário
    const nomePlano = document.getElementById("input-nome-plano").value;
    const dataAuditoria = document.getElementById("input-data-auditoria").value;
    const peritoSelect = document.getElementById("select-perito");
    const perito = peritoSelect.options[peritoSelect.selectedIndex].text;
  
    // Criar nova linha da tabela
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <div>
            <h6 class="mb-1 fw-bolder">${nomePlano}</h6>
          </div>
        </div>
      </td>
      <td><p class="fs-3 fw-normal mb-0">${dataAuditoria}</p></td>
      <td><p class="fs-3 fw-normal mb-0">${perito}</p></td>
      <td>
        <class="text-white bg-danger rounded-circle p-6 d-flex align-items-center justify-content-center">
                                <iconify-icon icon="mingcute:delete-3-line" class="nav-small-cap-icon fs-6"></iconify-icon>
                                <class="text-white bg-danger rounded-circle p-6 d-flex align-items-center justify-content-center">
                                <iconify-icon icon="bx:edit" class="nav-small-cap-icon fs-6"></iconify-icon>
        </div>
      </td>
    `;
  
    // Adicionar nova linha à tabela
    document.getElementById("lista-auditorias").appendChild(novaLinha);
  
    // Limpar formulário
    document.getElementById("formPlanoAuditoria").reset();
  });
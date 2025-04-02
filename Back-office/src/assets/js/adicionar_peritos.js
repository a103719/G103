document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const tabelaBody = document.querySelector("table tbody");
    let proximoID = tabelaBody.rows.length + 1;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      // Recolher os valores dos inputs
      const nome = document.getElementById("nome").value.trim();
      const area = document.getElementById("area").value.trim();
  
      if (nome === "" || area === "") {
        alert("Por favor, preencha pelo menos o Nome e a Área/Especialidade.");
        return;
      }
  
      // Criar nova linha na tabela
      const novaLinha = document.createElement("tr");
  
      novaLinha.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <div><h6 class="mb-1 fw-bolder">${proximoID}</h6></div>
          </div>
        </td>
        <td><p class="fs-3 fw-normal mb-0">${nome}</p></td>
        <td><p class="fs-3 fw-normal mb-0">${area}</p></td>
        <td>
          <div class="cursor-pointer btn-remover">
            <iconify-icon icon="mingcute:delete-3-line" class="nav-small-cap-icon fs-4"></iconify-icon>
          </div>
        </td>
      `;
  
      tabelaBody.appendChild(novaLinha);
      proximoID++;
  
      // Limpar os campos do formulário
      form.reset();
    });
  
    // Evento delegação para remover peritos da lista
    tabelaBody.addEventListener("click", function (e) {
      if (e.target.closest(".btn-remover")) {
        e.target.closest("tr").remove();
      }
    });
  });
  
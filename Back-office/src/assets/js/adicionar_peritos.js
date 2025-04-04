document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const tabelaBody = document.querySelector("#tabela-peritos");
  let proximoID = tabelaBody.rows.length + 1;

  const estados = {
    disponivel: { label: 'Disponível', class: 'bg-success-subtle text-success' },
    em_acao: { label: 'Em ação', class: 'bg-warning-subtle text-warning' },
    indisponivel: { label: 'Indisponível', class: 'bg-danger-subtle text-danger' }
  };

  function guardarEstado(id, estado) {
    localStorage.setItem(`estado_perito_${id}`, estado);
  }

  function obterEstado(id) {
    return localStorage.getItem(`estado_perito_${id}`) || 'disponivel';
  }

  function criarDropdownEstado(id, estadoAtual) {
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm w-auto'; // Base visual
    atualizarEstiloEstado(select, estadoAtual);
    select.dataset.id = id;

    for (const key in estados) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = estados[key].label;
      if (key === estadoAtual) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', () => {
      const novoEstado = select.value;
      guardarEstado(id, novoEstado);
      atualizarEstiloEstado(select, novoEstado);
    });

    return select;
  }

  function atualizarEstiloEstado(select, estado) {
    // Remove estilos anteriores
    select.classList.remove('bg-success-subtle', 'text-success', 'bg-warning-subtle', 'text-warning', 'bg-danger-subtle', 'text-danger');
    // Aplica o estilo atual
    select.classList.add(...estados[estado].class.split(' '));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const area = document.getElementById("area").value.trim();

    if (nome === "" || area === "") {
      alert("Por favor, preencha pelo menos o Nome e a Área/Especialidade.");
      return;
    }

    const estadoInicial = "disponivel";
    guardarEstado(proximoID, estadoInicial);

    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
      <td><div class="d-flex align-items-center"><div><h6 class="mb-1 fw-bolder">${proximoID}</h6></div></div></td>
      <td><p class="fs-3 fw-normal mb-0">${nome}</p></td>
      <td><p class="fs-3 fw-normal mb-0">${area}</p></td>
      <td></td>
      <td>
        <div class="cursor-pointer btn-remover" title="Remover perito">
          <iconify-icon icon="mingcute:delete-3-line" class="nav-small-cap-icon fs-4"></iconify-icon>
        </div>
      </td>
    `;

    const dropdown = criarDropdownEstado(proximoID, estadoInicial);
    novaLinha.children[3].appendChild(dropdown);

    tabelaBody.appendChild(novaLinha);
    proximoID++;

    form.reset();
  });

  tabelaBody.addEventListener("click", function (e) {
    if (e.target.closest(".btn-remover")) {
      const tr = e.target.closest("tr");
      const id = tr.querySelector("h6").textContent;
      localStorage.removeItem(`estado_perito_${id}`);
      tr.remove();
    }
  });

  // Aplica estilo aos dropdowns já existentes (caso a página seja recarregada)
  document.querySelectorAll("select[data-id]").forEach(select => {
    const id = select.dataset.id;
    const estadoGuardado = obterEstado(id);
    select.value = estadoGuardado;
    atualizarEstiloEstado(select, estadoGuardado);
  });
});

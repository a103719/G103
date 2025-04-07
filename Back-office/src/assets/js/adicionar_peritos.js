document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const tabelaBody = document.querySelector("#tabela-peritos");
  let listaDePeritos = JSON.parse(localStorage.getItem("peritos")) || [];
  let proximoID = listaDePeritos.length > 0 ? Math.max(...listaDePeritos.map(p => p.id)) + 1 : 1;

  const estados = {
    disponivel: { label: 'Disponível', class: 'bg-success-subtle text-success' },
    em_acao: { label: 'Em ação', class: 'bg-warning-subtle text-warning' },
    indisponivel: { label: 'Indisponível', class: 'bg-danger-subtle text-danger' }
  };

  function guardarLista() {
    localStorage.setItem("peritos", JSON.stringify(listaDePeritos));
    atualizarDashboard(); // Atualiza dashboard, se aplicável
  }

  function criarDropdownEstado(id, estadoAtual) {
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm w-auto';
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
      const perito = listaDePeritos.find(p => p.id == id);
      if (perito) {
        perito.estado = novoEstado;
        guardarLista();
        atualizarEstiloEstado(select, novoEstado);
      }
    });

    return select;
  }

  function atualizarEstiloEstado(select, estado) {
    select.classList.remove(
      'bg-success-subtle', 'text-success',
      'bg-warning-subtle', 'text-warning',
      'bg-danger-subtle', 'text-danger'
    );
    select.classList.add(...estados[estado].class.split(' '));
  }

  function renderTabela() {
    tabelaBody.innerHTML = "";
    listaDePeritos.forEach(perito => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td><div class="d-flex align-items-center"><div><h6 class="mb-1 fw-bolder">${perito.id}</h6></div></div></td>
        <td><p class="fs-3 fw-normal mb-0">${perito.nome}</p></td>
        <td><p class="fs-3 fw-normal mb-0">${perito.area}</p></td>
        <td></td>
        <td>
          <div class="cursor-pointer btn-remover" title="Remover perito">
            <iconify-icon icon="mingcute:delete-3-line" class="nav-small-cap-icon fs-4"></iconify-icon>
          </div>
        </td>
      `;
      const dropdown = criarDropdownEstado(perito.id, perito.estado);
      linha.children[3].appendChild(dropdown);
      tabelaBody.appendChild(linha);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const area = document.getElementById("area").value.trim();

    if (nome === "" || area === "") {
      alert("Por favor, preencha pelo menos o Nome e a Área/Especialidade.");
      return;
    }

    const novoPerito = {
      id: proximoID,
      nome: nome,
      area: area,
      estado: "disponivel"
    };

    listaDePeritos.push(novoPerito);
    guardarLista();
    renderTabela();
    proximoID++;
    form.reset();
  });

  tabelaBody.addEventListener("click", function (e) {
    if (e.target.closest(".btn-remover")) {
      const tr = e.target.closest("tr");
      const id = parseInt(tr.querySelector("h6").textContent);
      listaDePeritos = listaDePeritos.filter(p => p.id !== id);
      guardarLista();
      renderTabela();
    }
  });

  renderTabela();
  function atualizarCheckboxesSeguranca() {
    const container = document.getElementById("checkboxes-seguranca"); // Garante que este ID existe na página de ocorrências
    if (!container) return;
  
    container.innerHTML = ""; // Limpa os checkboxes anteriores
  
    listaDePeritos.forEach(p => {
      const div = document.createElement("div");
      div.className = "form-check";
  
      div.innerHTML = `
        <input class="form-check-input seguranca-checkbox" type="checkbox" value="${p.nome}" id="seg-${p.id}">
        <label class="form-check-label" for="seg-${p.id}">${p.nome}</label>
      `;
  
      container.appendChild(div);
    });
  }
  

  // OPCIONAL: atualiza a secção da dashboard com os peritos disponíveis/em ação
  function atualizarDashboard() {
    const tabelaDashboard = document.querySelector("#tabela-dashboard-peritos tbody");
    if (!tabelaDashboard) return;

    tabelaDashboard.innerHTML = "";

    listaDePeritos.forEach(p => {
      if (p.estado === "disponivel" || p.estado === "em_acao") {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${p.id}</td>
          <td>${p.nome}</td>
          <td>${p.area}</td>
          <td><span class="badge ${p.estado === 'disponivel' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}">${estados[p.estado].label}</span></td>
        `;
        tabelaDashboard.appendChild(linha);
      }
    });
  }

  atualizarDashboard();
});

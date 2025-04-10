// AdicionarPlanoAuditoria.js

let linhaEmEdicao = null;
let materiaisSelecionadosAuditoria = [];

const materiais = [
  { id: 1, nome: "Cone de sinalização", stock: 30, unidade: "un" },
  { id: 2, nome: "Semáforo portátil", stock: 5, unidade: "un" },
  { id: 3, nome: "Extintor CO2", stock: 10, unidade: "un" }
];
const stockGuardado = JSON.parse(localStorage.getItem("materiaisStock"));
if (stockGuardado) {
  stockGuardado.forEach((m, i) => {
    if (materiais[i]) materiais[i].stock = m.stock;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  preencherCheckboxPeritosDisponiveis();
  const form = document.getElementById("formPlanoAuditoria");
  const botaoSubmit = document.getElementById("btn-submit-plano");
  const listaMateriais = document.getElementById("materiaisSelecionados");

  preencherSelectMateriais();
  carregarAuditoriasDaStorage();
  carregarAuditoriasPendentes();

  document.getElementById("selectMaterial").addEventListener("change", () => {
    const mat = materiais.find(m => m.id == selectMaterial.value);
    if (mat) {
      document.getElementById("stockDisponivel").textContent = `Stock disponível: ${mat.stock} ${mat.unidade}`;
    }
  });

  document.getElementById("adicionarMaterial").addEventListener("click", () => {
    const matId = parseInt(document.getElementById("selectMaterial").value);
    const qtd = parseInt(document.getElementById("quantidadeMaterial").value);
    const mat = materiais.find(m => m.id === matId);

    if (!mat || isNaN(qtd) || qtd <= 0) return;
    if (qtd > mat.stock) {
      alert(`Stock insuficiente! Só existem ${mat.stock} ${mat.unidade}.`);
      return;
    }

    mat.stock -= qtd;
    atualizarTextoSelect(matId);
    localStorage.setItem("materiaisStock", JSON.stringify(materiais));
    document.getElementById("stockDisponivel").textContent = `Stock disponível: ${mat.stock} ${mat.unidade}`;

    const materialSelecionado = {
      id: mat.id,
      nome: mat.nome,
      qtd: qtd,
      unidade: mat.unidade
    };

    materiaisSelecionadosAuditoria.push(materialSelecionado);

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${mat.nome} - ${qtd} ${mat.unidade}`;
    listaMateriais.appendChild(li);

    document.getElementById("quantidadeMaterial").value = "";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomePlano = document.getElementById("input-nome-plano").value.trim();
    const dataAuditoria = document.getElementById("input-data-auditoria").value;
    const ocorrencias = Array.from(document.querySelectorAll("#ocorrencias-relacionadas span"))
      .map(span => span.textContent.trim());
    const duracao = document.getElementById("input-duracao").value.trim();
    const descricao = document.getElementById("input-descricao").value.trim();

    const checkboxes = document.querySelectorAll('#checkbox-peritos input[type="checkbox"]');
    const peritosSelecionados = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value)
      .join(" / ");

    if (!nomePlano || !dataAuditoria || ocorrencias.length === 0 || !peritosSelecionados) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const ocorrenciasTexto = ocorrencias.join(", ");
    const materiaisJSON = JSON.stringify(materiaisSelecionadosAuditoria);
    const materiaisTexto = materiaisSelecionadosAuditoria.length > 0
      ? materiaisSelecionadosAuditoria.map(m => `${m.nome} (${m.qtd} ${m.unidade})`).join(", ")
      : "—";

    const novaLinha = linhaEmEdicao || document.createElement("tr");
    novaLinha.setAttribute("data-materiais", materiaisJSON);
    novaLinha.setAttribute("data-duracao", duracao);
    novaLinha.setAttribute("data-descricao", descricao);
    novaLinha.innerHTML = `
  <td>${nomePlano}</td>
  <td>${ocorrenciasTexto}</td>
  <td>${dataAuditoria}</td>
  <td>${peritosSelecionados}</td>
  <td>${materiaisTexto}</td>
  <td><span class="badge bg-success">Criado</span></td>
  <td>
    <iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark"
      onclick="editarPlano(this)" title="Editar"></iconify-icon>
    <iconify-icon icon="mdi:close" class="cursor-pointer  ms-2"
      onclick="eliminarLinha(this)" title="Eliminar"></iconify-icon>
  </td>
`;



    if (!linhaEmEdicao) {
      document.querySelector("tbody").appendChild(novaLinha);
    }

    guardarAuditoriasNaStorage();
    localStorage.setItem("novaAuditoriaCriada", "true");
    fecharFormulario();
    form.reset();
    materiaisSelecionadosAuditoria = [];
    listaMateriais.innerHTML = "";
    document.getElementById("stockDisponivel").textContent = "";
  });
});

function mostrarFormulario(icone = null) {
  preencherCheckboxPeritosDisponiveis();
  document.getElementById("formularioPlano").style.display = "block";
  const botao = document.getElementById("btn-submit-plano");
  const listaMateriais = document.getElementById("materiaisSelecionados");

  if (icone) {
    const linha = icone.closest("tr");
    linhaEmEdicao = linha;

    const nome = linha.children[0].textContent.trim();
    const data = linha.children[2].textContent.trim();
    const peritos = linha.children[3].textContent.trim();
    const materiaisJSON = linha.getAttribute("data-materiais") || "[]";
    const duracao = linha.getAttribute("data-duracao") || "";
    const descricao = linha.getAttribute("data-descricao") || "";
    const ocorrenciasArray = linha.children[1].textContent.split(",").map(o => o.trim());

    document.getElementById("input-nome-plano").value = nome !== "—" ? nome : "";
    document.getElementById("input-data-auditoria").value = formatarDataParaInput(data);
    document.getElementById("input-duracao").value = duracao;
    document.getElementById("input-descricao").value = descricao;

    const divOcorrencias = document.getElementById("ocorrencias-relacionadas");
    divOcorrencias.innerHTML = ocorrenciasArray.map(o => `<span class="me-2">${o}</span>`).join("");

    const peritosArray = peritos.split(" / ").map(p => p.trim());
    document.querySelectorAll('#checkbox-peritos input[type="checkbox"]').forEach(cb => {
      cb.checked = peritosArray.includes(cb.value);
    });

    materiaisSelecionadosAuditoria = JSON.parse(materiaisJSON);
    listaMateriais.innerHTML = "";
    materiaisSelecionadosAuditoria.forEach(mat => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = `${mat.nome} - ${mat.qtd} ${mat.unidade}`;
      listaMateriais.appendChild(li);
    });

    botao.textContent = "Atualizar Plano";
  } else {
    botao.textContent = "Criar Plano";
    materiaisSelecionadosAuditoria = [];
    document.getElementById("materiaisSelecionados").innerHTML = "";
  }

  document.getElementById("input-nome-plano").focus();
}

function fecharFormulario() {
  document.getElementById("formularioPlano").style.display = "none";
  document.getElementById("formPlanoAuditoria").reset();
  document.querySelectorAll('#checkbox-peritos input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById("ocorrencias-relacionadas").innerHTML = "";
  document.getElementById("materiaisSelecionados").innerHTML = "";
  document.getElementById("stockDisponivel").textContent = "";
  materiaisSelecionadosAuditoria = [];
  document.getElementById("btn-submit-plano").textContent = "Criar Plano";
  linhaEmEdicao = null;
}

function editarPlano(icone) {
  mostrarFormulario(icone);
}

function formatarDataParaInput(dataStr) {
  return dataStr; 
}


function preencherSelectMateriais() {
  const selectMaterial = document.getElementById("selectMaterial");
  if (!selectMaterial) return;
  selectMaterial.innerHTML = `<option disabled selected>Selecione um material</option>`;
  materiais.forEach(mat => {
    const option = document.createElement("option");
    option.value = mat.id;
    option.textContent = `${mat.nome} (Stock: ${mat.stock} ${mat.unidade})`;
    selectMaterial.appendChild(option);
  });
}

function atualizarTextoSelect(matId) {
  const mat = materiais.find(m => m.id === matId);
  if (!mat) return;
  const option = document.querySelector(`#selectMaterial option[value='${matId}']`);
  if (option) {
    option.textContent = `${mat.nome} (Stock: ${mat.stock} ${mat.unidade})`;
  }
}

function carregarAuditoriasPendentes() {
  const ocorrenciasPendentes = JSON.parse(localStorage.getItem("auditoriasPendentes")) || [];
  const auditoriasGuardadas = JSON.parse(localStorage.getItem("listaAuditorias")) || [];

  ocorrenciasPendentes.forEach(designacao => {
    const novaLinha = document.createElement("tr");
    novaLinha.setAttribute("data-materiais", "[]");
    novaLinha.setAttribute("data-duracao", "");
    novaLinha.setAttribute("data-descricao", "");

    novaLinha.innerHTML = `
  <td><em>—</em></td>
  <td>${designacao}</td>
  <td><em>—</em></td>
  <td><em>—</em></td>
  <td><em>—</em></td>
  <td><span class="badge bg-warning text-dark">Por Criar</span></td>
  <td>
    <div class="d-flex align-items-center gap-2">
      <iconify-icon icon="gg:add-r" class="fs-5 cursor-pointer text-dark" onclick="mostrarFormulario(this)" title="Criar Plano"></iconify-icon>
      <iconify-icon icon="mdi:close" class="cursor-pointer  ms-2" onclick="eliminarLinha(this)" title="Eliminar"></iconify-icon>
    </div>
  </td>
`;



    document.querySelector("tbody").appendChild(novaLinha);

    // Adicionar também à lista de auditorias guardadas
    auditoriasGuardadas.push({
      nome: "—",
      ocorrencias: designacao,
      data: "—",
      peritos: "—",
      materiais: "—",
      estado: "Por Criar",
      materiaisJSON: "[]",
      duracao: "",
      descricao: ""
    });
  });

  // Atualizar localStorage
  localStorage.setItem("listaAuditorias", JSON.stringify(auditoriasGuardadas));
  localStorage.removeItem("auditoriasPendentes");
}


function guardarAuditoriasNaStorage() {
  const linhas = document.querySelectorAll("tbody tr");
  const auditorias = [];

  linhas.forEach(linha => {
    const nome = linha.children[0].textContent.trim();
    const ocorrencias = linha.children[1].textContent.trim();
    const data = linha.children[2].textContent.trim();
    const peritos = linha.children[3].textContent.trim();
    const materiais = linha.children[4].textContent.trim();
    const estado = linha.children[5].textContent.trim();
    const materiaisJSON = linha.getAttribute("data-materiais") || "[]";
    const duracao = linha.getAttribute("data-duracao") || "";
    const descricao = linha.getAttribute("data-descricao") || "";

    auditorias.push({ nome, ocorrencias, data, peritos, materiais, estado, materiaisJSON, duracao, descricao });
  });

  localStorage.setItem("listaAuditorias", JSON.stringify(auditorias));
}

function carregarAuditoriasDaStorage() {
  const auditorias = JSON.parse(localStorage.getItem("listaAuditorias")) || [];
  auditorias.forEach(a => {
    const linha = document.createElement("tr");
    linha.setAttribute("data-materiais", a.materiaisJSON);
    linha.setAttribute("data-duracao", a.duracao);
    linha.setAttribute("data-descricao", a.descricao);

    const badgeClass = a.estado === "Criado" ? "bg-success" : "bg-warning text-dark";

    linha.innerHTML = `
  <td>${a.nome}</td>
  <td>${a.ocorrencias}</td>
  <td>${a.data}</td>
  <td>${a.peritos}</td>
  <td>${a.materiais}</td>
  <td><span class="badge ${badgeClass}">${a.estado}</span></td>
  <td>
    ${
      a.estado === "Por Criar"
        ? `<a href="#formPlanoAuditoria" title="Criar Plano">
             <iconify-icon icon="gg:add-r" class="fs-5 cursor-pointer text-dark" onclick="mostrarFormulario(this)"></iconify-icon>
           </a>`
        : `<iconify-icon icon="bx:edit" class="fs-6 cursor-pointer text-dark" onclick="editarPlano(this)" title="Editar"></iconify-icon>`
    }
     <iconify-icon icon="mdi:close" class="cursor-pointer ms-2" onclick="eliminarLinha(this)" title="Eliminar"></iconify-icon>
  </td>
`;



    document.querySelector("tbody").appendChild(linha);
  });
}

function preencherCheckboxPeritosDisponiveis() {
  const container = document.getElementById("checkbox-peritos");
  if (!container) return;

  container.innerHTML = ""; // Limpa os checkboxes antigos

  const listaPeritos = JSON.parse(localStorage.getItem("peritos")) || [];
  const peritosDisponiveis = listaPeritos.filter(p => p.estado !== "indisponivel");

  peritosDisponiveis.forEach((perito, index) => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${perito.nome}" id="perito${index}">
      <label class="form-check-label" for="perito${index}">${perito.nome}</label>
    `;

    col.appendChild(div);
    container.appendChild(col);
  });
}

function eliminarLinha(icone) {
  const linha = icone.closest("tr");

  // 1. Recuperar materiais da auditoria
  const materiaisJSON = linha.getAttribute("data-materiais") || "[]";
  const materiaisUsados = JSON.parse(materiaisJSON);

  // 2. Repor o stock dos materiais
  materiaisUsados.forEach(uso => {
    const materialOriginal = materiais.find(m => m.id === uso.id);
    if (materialOriginal) {
      materialOriginal.stock += uso.qtd;
    }
  });

  // 3. Guardar o novo stock no localStorage
  localStorage.setItem("materiaisStock", JSON.stringify(materiais));

  // 4. Remover a linha da tabela
  linha.remove();

  // 5. Atualizar lista de auditorias
  guardarAuditoriasNaStorage();
}





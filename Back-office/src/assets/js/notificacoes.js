// notificacoes.js
const LS_KEY_NOTIFICACOES = "backofficeNotificacoes";
const LIMITE_INICIAL      = 3;           // nº de itens visíveis antes de “Ver mais”
let   expandido           = false;       // estado do botão

document.addEventListener("DOMContentLoaded", () => {
  renderizarNotificacoes();              // 1ª render
});

/* ---------------  API LocalStorage  --------------- */
function obterNotificacoes()  { return JSON.parse(localStorage.getItem(LS_KEY_NOTIFICACOES)) || []; }
function guardarNotificacoes(l){ localStorage.setItem(LS_KEY_NOTIFICACOES, JSON.stringify(l)); }

function criarNotificacao(t, m, tipo="info"){
  const lista = obterNotificacoes();
  lista.unshift({ id: Date.now(), titulo:t, mensagem:m, tipo, data: new Date().toISOString() });
  guardarNotificacoes(lista);
  renderizarNotificacoes();
}

function eliminarNotificacao(id){
  guardarNotificacoes(obterNotificacoes().filter(n => n.id!==id));
  renderizarNotificacoes();
}
function limparNotificacoes(){
  localStorage.removeItem(LS_KEY_NOTIFICACOES);
  renderizarNotificacoes();
}

function renderizarNotificacoes(){
  const lista     = obterNotificacoes();
  const badge     = document.getElementById("badgeNotificacoes");
  const dropdown  = document.getElementById("listaNotificacoes");
  if(!badge || !dropdown) return;

 
  dropdown.innerHTML = `
      <li class="dropdown-header fw-bold">Notificações</li>
      ${ lista.length === 0
          ? `<li class="p-2 text-center text-muted">Sem notificações.</li>`
          : lista.map(renderItem).join("") }
      <li class="p-2 text-center d-none" id="liVerMais">
        <!-- botão APENAS com a seta -->
        <button id="btnVerMaisNotif" class="btn p-0 border-0 bg-transparent">
          <iconify-icon icon="mdi:chevron-down"></iconify-icon>
        </button>
      </li>
      <li class="p-2 text-center">
        <button class="btn btn-outline-secondary w-100" id="btnLimparNotificacoes">
          Limpar Tudo
        </button>
      </li>`;

  /* -------- listeners dos botões -------- */
  dropdown.querySelectorAll("button[data-id]")
          .forEach(btn => btn.addEventListener("click", () => eliminarNotificacao(+btn.dataset.id)));
  dropdown.querySelector("#btnLimparNotificacoes")
          .addEventListener("click", limparNotificacoes);

  /* -------- paginação -------- */
  aplicarLimiteNotificacoes();
  badge.classList.toggle("d-none", lista.length===0);
}

function renderItem(n){
  const cor = {success:"bg-light-success",warning:"bg-light-warning",
               error:"bg-light-danger"}[n.tipo] || "bg-light-primary";
  return `
    <li class="item-notificacao">
      <div class="d-flex align-items-start p-2 border-bottom">
        <div class="flex-shrink-0 me-2">
          <div class="rounded-circle ${cor}" style="width:36px;height:36px"></div>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between">
            <h6 class="mb-1">${n.titulo}</h6>
            <small>${new Date(n.data).toLocaleString()}</small>
          </div>
          <p class="mb-1">${n.mensagem}</p>
          <button class="btn btn-sm btn-outline-danger" data-id="${n.id}">Eliminar</button>
        </div>
      </div>
    </li>`;
}

function aplicarLimiteNotificacoes(){
  const itens   = Array.from(document.querySelectorAll("#listaNotificacoes .item-notificacao"));
  const verMais = document.getElementById("liVerMais");
  const btn     = document.getElementById("btnVerMaisNotif");
  const icone   = btn?.querySelector("iconify-icon");

  /* mostra / esconde conforme o estado */
  itens.forEach( (li,i) => li.classList.toggle("d-none", !expandido && i>=LIMITE_INICIAL) );

  if(itens.length > LIMITE_INICIAL){
    verMais.classList.remove("d-none");
    btn.onclick = () =>{
      expandido = !expandido;
      aplicarLimiteNotificacoes();
      icone.setAttribute("icon", expandido ? "mdi:chevron-up" : "mdi:chevron-down");
    };
  }else{
    verMais.classList.add("d-none");
  }
}

/* -------- expor funções globais -------- */
window.criarNotificacao  = criarNotificacao;
window.limparNotificacoes = limparNotificacoes;

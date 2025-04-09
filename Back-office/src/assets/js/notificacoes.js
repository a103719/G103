// notificacoes.js

// Chave a usar no localStorage para guardar as notificações
const LS_KEY_NOTIFICACOES = "backofficeNotificacoes";

/**
 * Assim que a página carrega, renderizamos as notificações existentes
 * (caso haja o badge e a lista criados em HTML).
 */
document.addEventListener("DOMContentLoaded", function () {
  renderizarNotificacoes();
});

/**
 * Lê do localStorage o array de notificações.
 */
function obterNotificacoes() {
  return JSON.parse(localStorage.getItem(LS_KEY_NOTIFICACOES)) || [];
}

/**
 * Guarda a lista de notificações no localStorage.
 */
function guardarNotificacoes(lista) {
  localStorage.setItem(LS_KEY_NOTIFICACOES, JSON.stringify(lista));
}

/**
 * Cria uma nova notificação, guarda e atualiza a interface.
 * @param {String} titulo   - Título ou assunto
 * @param {String} mensagem - Conteúdo principal
 * @param {String} tipo     - (opcional) 'info', 'success', 'warning', 'error'
 */
function criarNotificacao(titulo, mensagem, tipo = "info") {
  const lista = obterNotificacoes();
  
  // Construímos o objeto notificação
  const novaNotificacao = {
    id: Date.now(),
    titulo,
    mensagem,
    tipo,
    lida: false,
    data: new Date().toISOString()
  };

  // Adicionamos ao início do array
  lista.unshift(novaNotificacao);
  guardarNotificacoes(lista);

  // Renderizamos para atualizar o badge e a lista
  renderizarNotificacoes();
}

/**
 * Marca uma notificação como lida e atualiza.
 * @param {Number} id  - ID da notificação (timestamp)
 */
function marcarNotificacaoComoLida(id) {
  const lista = obterNotificacoes();
  const idx = lista.findIndex(n => n.id === id);
  if (idx !== -1) {
    lista[idx].lida = true;
    guardarNotificacoes(lista);
    renderizarNotificacoes();
  }
}

/**
 * Elimina uma notificação específica e atualiza a lista.
 * @param {Number} id
 */
function eliminarNotificacao(id) {
  let lista = obterNotificacoes();
  lista = lista.filter(n => n.id !== id);
  guardarNotificacoes(lista);
  renderizarNotificacoes();
}

/**
 * Limpa todas as notificações (opção "Limpar Tudo").
 */
function limparNotificacoes() {
  localStorage.removeItem(LS_KEY_NOTIFICACOES);
  renderizarNotificacoes();
}

/**
 * Renderiza o badge e a lista <ul> das notificações num dropdown.
 */
function renderizarNotificacoes() {
  const lista = obterNotificacoes();

  // Pegamos os elementos da página
  const badge = document.getElementById("badgeNotificacoes");
  const dropdown = document.getElementById("listaNotificacoes");

  // Se não houver esses elementos no HTML, não faz nada
  if (!badge || !dropdown) return;

  // Contar quantas não lidas
  const naoLidas = lista.filter(n => !n.lida).length;

  // Se não houver não lidas, esconde a bolinha; senão, mostra número
  if (naoLidas === 0) {
    badge.classList.add("d-none");
  } else {
    badge.classList.remove("d-none");
    badge.textContent = naoLidas;
  }

  // Limpar o menu dropdown (caso já tenha itens)
  dropdown.innerHTML = "";

  // Cabeçalho de "Notificações"
  const cabecalho = document.createElement("li");
  cabecalho.className = "dropdown-header fw-bold";
  cabecalho.textContent = "Notificações";
  dropdown.appendChild(cabecalho);

  // Se não existir nenhuma notificação, diz "Sem notificações."
  if (lista.length === 0) {
    const liVazio = document.createElement("li");
    liVazio.className = "p-2 text-center text-muted";
    liVazio.textContent = "Sem notificações.";
    dropdown.appendChild(liVazio);
    return;
  }

  // Para cada notificação, cria um <li> correspondente
  lista.forEach(notif => {
    const li = document.createElement("li");
    let tipoClasse = "";

    switch (notif.tipo) {
      case "success":
        tipoClasse = "bg-light-success";
        break;
      case "warning":
        tipoClasse = "bg-light-warning";
        break;
      case "error":
        tipoClasse = "bg-light-danger";
        break;
      default:
        tipoClasse = "bg-light-primary";
        break;
    }

    li.innerHTML = `
      <div class="d-flex align-items-start p-2 border-bottom ${notif.lida ? 'opacity-50' : ''}">
        <div class="flex-shrink-0 me-2">
          <div class="rounded-circle ${tipoClasse}" style="width: 36px; height: 36px;"></div>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between">
            <h6 class="mb-1">${notif.titulo}</h6>
            <small>${new Date(notif.data).toLocaleString()}</small>
          </div>
          <p class="mb-1">${notif.mensagem}</p>
          <div class="d-flex gap-2">
            ${
              notif.lida
                ? `<small class="text-muted">[Já lida]</small>`
                : `<button class="btn btn-sm btn-outline-success" data-id="${notif.id}" data-acao="ler">Marcar como lida</button>`
            }
            <button class="btn btn-sm btn-outline-danger" data-id="${notif.id}" data-acao="remover">Eliminar</button>
          </div>
        </div>
      </div>
    `;

    dropdown.appendChild(li);
  });

  // Botão para limpar tudo no final
  const liLimpar = document.createElement("li");
  liLimpar.className = "p-2 text-center";
  liLimpar.innerHTML = `
    <button class="btn btn-outline-secondary w-100" id="btnLimparNotificacoes">
      Limpar Tudo
    </button>
  `;
  dropdown.appendChild(liLimpar);

  // Escutar cliques para "Marcar como lida", "Eliminar" e "Limpar Tudo"
  dropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id") || 0);
      const acao = this.getAttribute("data-acao");

      if (acao === "ler" && id) marcarNotificacaoComoLida(id);
      if (acao === "remover" && id) eliminarNotificacao(id);
    });
  });

  const btnLimpar = document.getElementById("btnLimparNotificacoes");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", function () {
      if (confirm("Tens a certeza que pretendes apagar todas as notificações?")) {
        limparNotificacoes();
      }
    });
  }
}

// Expor as funções no escopo global, caso precises chamá-las de outro script
window.criarNotificacao = criarNotificacao;
window.limparNotificacoes = limparNotificacoes;

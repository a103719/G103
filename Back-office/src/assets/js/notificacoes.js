// notificacoes.js

// Chave a usar no LocalStorage para guardar as notificações
const LS_KEY_NOTIFICACOES = "backofficeNotificacoes";

// Ao carregar a página, renderiza notificações existentes
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
 * @param {String} titulo
 * @param {String} mensagem
 * @param {String} tipo (ex: "info", "success", "warning", "error")
 */
function criarNotificacao(titulo, mensagem, tipo = "info") {
  const lista = obterNotificacoes();

  const novaNotificacao = {
    id: Date.now(),
    titulo,
    mensagem,
    tipo,
    data: new Date().toISOString()
  };

  lista.unshift(novaNotificacao);
  guardarNotificacoes(lista);
  renderizarNotificacoes();
}

/**
 * Elimina uma notificação específica.
 */
function eliminarNotificacao(id) {
  let lista = obterNotificacoes();
  lista = lista.filter(n => n.id !== id);
  guardarNotificacoes(lista);
  renderizarNotificacoes();
}

/**
 * Limpa todas as notificações.
 */
function limparNotificacoes() {
  localStorage.removeItem(LS_KEY_NOTIFICACOES);
  renderizarNotificacoes();
}

/**
 * Renderiza as notificações no badge e na dropdown.
 */
function renderizarNotificacoes() {
  const lista = obterNotificacoes();

  const badge = document.getElementById("badgeNotificacoes");
  const dropdown = document.getElementById("listaNotificacoes");

  if (!badge || !dropdown) return;

  // Mostra ou esconde badge conforme existam notificações
  if (lista.length === 0) {
    badge.classList.add("d-none");
  } else {
    badge.classList.remove("d-none");
    badge.textContent = "●"; // apenas o círculo
  }

  dropdown.innerHTML = "";

  const cabecalho = document.createElement("li");
  cabecalho.className = "dropdown-header fw-bold";
  cabecalho.textContent = "Notificações";
  dropdown.appendChild(cabecalho);

  if (lista.length === 0) {
    const liVazio = document.createElement("li");
    liVazio.className = "p-2 text-center text-muted";
    liVazio.textContent = "Sem notificações.";
    dropdown.appendChild(liVazio);
    return;
  }

  lista.forEach(notif => {
    const li = document.createElement("li");

    let tipoClasse = "";
    switch (notif.tipo) {
      case "success": tipoClasse = "bg-light-success"; break;
      case "warning": tipoClasse = "bg-light-warning"; break;
      case "error":   tipoClasse = "bg-light-danger";  break;
      default:        tipoClasse = "bg-light-primary"; break;
    }

    li.innerHTML = `
      <div class="d-flex align-items-start p-2 border-bottom">
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
            <button class="btn btn-sm btn-outline-danger" data-id="${notif.id}" data-acao="remover">Eliminar</button>
          </div>
        </div>
      </div>
    `;

    dropdown.appendChild(li);
  });

  const liLimpar = document.createElement("li");
  liLimpar.className = "p-2 text-center";
  liLimpar.innerHTML = `
    <button class="btn btn-outline-secondary w-100" id="btnLimparNotificacoes">
      Limpar Tudo
    </button>
  `;
  dropdown.appendChild(liLimpar);

  dropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id") || 0);
      const acao = this.getAttribute("data-acao");

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

// Expor funções globalmente
window.criarNotificacao = criarNotificacao;
window.limparNotificacoes = limparNotificacoes;

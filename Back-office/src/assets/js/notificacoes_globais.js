document.addEventListener("DOMContentLoaded", function () {
    // Verifica se há notificação pendente
    const noti = localStorage.getItem("notificacaoPorMostrar");
  
    if (noti) {
      try {
        const obj = JSON.parse(noti);
        if (obj?.titulo && obj?.mensagem && obj?.tipo) {
          criarNotificacao(obj.titulo, obj.mensagem, obj.tipo);
        }
      } catch (e) {
        console.warn("Erro ao processar notificação global:", e);
      }
      // Remove após mostrar
      localStorage.removeItem("notificacaoPorMostrar");
    }
  
    // Outras notificações globais que não precisam de dados dinâmicos
    if (localStorage.getItem("novoPeritoAdicionado") === "true") {
      criarNotificacao("Novo Perito", "Um novo perito foi adicionado ao sistema.", "info");
      localStorage.removeItem("novoPeritoAdicionado");
    }
  
    if (localStorage.getItem("novaAuditoriaCriada") === "true") {
        criarNotificacao(
          "Nova Auditoria",
          "Uma nova auditoria foi criada com sucesso.",
          "success"
        );
        localStorage.removeItem("novaAuditoriaCriada");
      }      
  });
  
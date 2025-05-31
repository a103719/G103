// js/storage.js
// Gestão do localStorage com foco em eyesEverywhereState e cópia opcional de ocorrenciasLista

/**
 * Obtém os dados armazenados localmente de eyesEverywhereState.
 * Se não houver dados ou estiverem corrompidos, retorna uma estrutura base segura.
 */
export function getDados() {
  try {
    const dados = JSON.parse(localStorage.getItem("eyesEverywhereState"));

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      throw new Error("Formato inválido em eyesEverywhereState");
    }

    if (!Array.isArray(dados.ocorrenciasLista)) {
      dados.ocorrenciasLista = [];
    }

    if (typeof dados.pontosUtilizadores !== "object" || dados.pontosUtilizadores === null) {
      dados.pontosUtilizadores = {};
    }

    return dados;
  } catch (e) {
    console.error("Erro ao ler dados do localStorage:", e);
    return {
      ocorrenciasLista: [],
      pontosUtilizadores: {}
    };
  }
}

/**
 * Atualiza os dados no localStorage sem apagar outras propriedades de eyesEverywhereState.
 * Mantém os dados existentes (ex: pontosUtilizadores, peritos, etc.) intactos.
 */
export function setDados(dadosNovos) {
  try {
    const dadosExistentes = JSON.parse(localStorage.getItem("eyesEverywhereState")) || {};

    const dadosAtualizados = {
      ...dadosExistentes,
      ...dadosNovos
    };

    // 1. Atualiza primeiro a estrutura principal
    localStorage.setItem("eyesEverywhereState", JSON.stringify(dadosAtualizados));

    // 2. (Opcional) Atualiza a cópia redundante fora da estrutura, se necessário
    if (Array.isArray(dadosAtualizados.ocorrenciasLista)) {
      localStorage.setItem("ocorrenciasLista", JSON.stringify(dadosAtualizados.ocorrenciasLista));
    }

  } catch (e) {
    console.error("Erro ao guardar dados no localStorage:", e);
  }
}

/**
 * Carrega dados iniciais de um ficheiro JSON externo,
 * apenas se não houver ocorrências gravadas localmente.
 */
export function carregarInicialJSON() {
  fetch("../Dados/eyesEverywhere_backup.json")
    .then(response => response.json())
    .then(data => {
      const lista = Array.isArray(data.ocorrenciasLista) ? data.ocorrenciasLista : [];

      let estadoAtual = {};
      try {
        estadoAtual = JSON.parse(localStorage.getItem("eyesEverywhereState") || "{}");
      } catch (e) {
        estadoAtual = {};
      }

      if (!Array.isArray(estadoAtual.ocorrenciasLista) || estadoAtual.ocorrenciasLista.length === 0) {
        estadoAtual.ocorrenciasLista = lista;

        // Atualiza primeiro a estrutura principal
        localStorage.setItem("eyesEverywhereState", JSON.stringify(estadoAtual));

        // Atualiza cópia externa por compatibilidade
        localStorage.setItem("ocorrenciasLista", JSON.stringify(lista));

        console.log("✔️ Dados iniciais carregados do backup JSON.");
      }
    })
    .catch(e => console.error("Erro ao carregar dados iniciais:", e));
}

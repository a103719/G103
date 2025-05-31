import { adicionarPlano, listarPlanos } from './storage/planosAuditoriaStorage.js';

document.addEventListener("DOMContentLoaded", () => {
  const planos = listarPlanos();
  planos.forEach(plano => {
    adicionarPlanoNaTabela(plano); // função que desenha na UI
  });

  document.getElementById("formPlanoAuditoria").addEventListener("submit", e => {
    e.preventDefault();

    const novoPlano = {
      nome: document.getElementById("input-nome-plano").value.trim(),
      data: document.getElementById("input-data-auditoria").value,
      materiais: document.getElementById("input-materiais").value.trim(),
      duracao: document.getElementById("input-duracao").value.trim(),
      descricao: document.getElementById("input-descricao").value.trim(),
      ocorrencias: Array.from(document.querySelectorAll("#ocorrencias-relacionadas .badge"))
        .map(span => span.textContent.trim()),
      peritos: Array.from(document.querySelectorAll('#checkbox-peritos input[type="checkbox"]:checked'))
        .map(cb => cb.value)
    };

    adicionarPlano(novoPlano);
    adicionarPlanoNaTabela(novoPlano);
    e.target.reset();
  });
});

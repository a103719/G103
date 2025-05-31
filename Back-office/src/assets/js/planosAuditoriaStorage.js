import { guardarDados, obterDados } from './storage.js';

const CHAVE_PLANOS = 'planosAuditoria';

export function adicionarPlano(plano) {
  const planos = obterDados(CHAVE_PLANOS);
  planos.push(plano);
  guardarDados(CHAVE_PLANOS, planos);
}

export function listarPlanos() {
  return obterDados(CHAVE_PLANOS);
}

export function atualizarPlano(index, novoPlano) {
  const planos = obterDados(CHAVE_PLANOS);
  planos[index] = novoPlano;
  guardarDados(CHAVE_PLANOS, planos);
}

export function removerPlano(index) {
  const planos = obterDados(CHAVE_PLANOS);
  planos.splice(index, 1);
  guardarDados(CHAVE_PLANOS, planos);
}

// assets/js/storage/storage.js

export function guardarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  
  export function obterDados(chave) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  }
  
  export function limparDados(chave) {
    localStorage.removeItem(chave);
  }
  
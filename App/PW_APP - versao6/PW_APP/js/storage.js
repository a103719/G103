// js/storage.js
// gestão do localStorage
// O localStorage é um armazenamento local do navegador que permite armazenar dados em pares chave-valor.
// Os dados armazenados no localStorage persistem mesmo após o fechamento do navegador.
// O localStorage é limitado a 5MB por domínio, o que é suficiente para armazenar dados simples.    
export function getDados() {
  const dados = localStorage.getItem("eyesEverywhere");
  return dados ? JSON.parse(dados) : { ocorrenciasLista: [] };
}
export function setDados(dados) {
  localStorage.setItem("eyesEverywhere", JSON.stringify(dados));
}

export function carregarInicialJSON() {
  fetch("js/eyesEverywhere_backup (12).json")
    .then(r => r.json())
    .then(data => {
      if (!localStorage.getItem("eyesEverywhere")) {
        localStorage.setItem("eyesEverywhere", JSON.stringify(data));
      }
    });
}

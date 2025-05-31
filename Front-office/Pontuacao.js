const pontosSpan = document.getElementById('pontos-atuais');

// Se já existem pontos guardados no localStorage, usa-os. Caso contrário, começa com 0.
let pontos = localStorage.getItem('pontos') 
  ? parseInt(localStorage.getItem('pontos')) 
  : 0;

const produtos = [
  { nome: "10 Senhas Cantina UMINHO", custo: 100 },
  { nome: "10 viagens dos Autocarros da AAUMINHO", custo: 200 },
  { nome: "Pulseira Enterro da Gata'25", custo: 500 }
];

// MOSTRAR MENSAGEM DE RECOMPENSA
window.mostrarToast = function(mensagem, tipo = 'sucesso') {
  const toast = document.createElement('div');
  
  toast.textContent = mensagem;
  
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '15px 25px';
  toast.style.borderRadius = '10px';
  toast.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
  toast.style.zIndex = '9999';
  
  // Definir cores com base no tipo de mensagem
  if (tipo === 'sucesso') {
    toast.style.backgroundColor = '#10bc69';
    toast.style.color = '#fff';
  } else if (tipo === 'erro') {
    toast.style.backgroundColor = '#ff3860';
    toast.style.color = '#fff';
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

function atualizarPontos() {
  pontosSpan.textContent = pontos;
  localStorage.setItem('pontos', pontos);
}

function tentarTrocar(index) {
  const produto = produtos[index];

  if (pontos >= produto.custo) {
    pontos -= produto.custo;
    atualizarPontos();
    window.mostrarToast("🎉 Recompensa adquirida! Verifica no portal académico.", "sucesso");
  } else {
    window.mostrarToast("⚠️Não tens pontos suficientes para trocar pela bonificação.", "erro");
    alert("pontos insuficientes");
  }
}

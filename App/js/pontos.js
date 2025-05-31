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

function atualizarPontos() {
  pontosSpan.textContent = pontos;
  localStorage.setItem('pontos', pontos);

  // Atualiza o número no centro do gráfico
  const textoDonut = document.querySelector(".donut-text");
  if (textoDonut) {
    textoDonut.textContent = `${pontos}/150`;
  }

  // Atualiza o preenchimento da circunferência (stroke-dasharray)
  const donutFill = document.querySelector(".donut-fill");
  if (donutFill) {
    const percentagem = Math.min((pontos / 150) * 100, 100); // max 100%
    donutFill.setAttribute("stroke-dasharray", `${percentagem} ${100 - percentagem}`);
  }
}


function tentarTrocar(index) {
  const produto = produtos[index];

  if (pontos >= produto.custo) {
    pontos -= produto.custo;
    atualizarPontos();

    // MOSTRAR MENSAGEM DE RECOMPENSA
    const mensagem = document.createElement('div');
    mensagem.textContent = "🎉 Recompensa adquirida! Verifica no portal académico.";
    mensagem.style.position = 'fixed';
    mensagem.style.bottom = '30px';
    mensagem.style.left = '50%';
    mensagem.style.transform = 'translateX(-50%)';
    mensagem.style.backgroundColor = '#10bc69';
    mensagem.style.color = '#fff';
    mensagem.style.padding = '15px 25px';
    mensagem.style.borderRadius = '10px';
    mensagem.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    mensagem.style.zIndex = '9999';
    document.body.appendChild(mensagem);

    setTimeout(() => {
      mensagem.remove();
    }, 3000);
  } else {
    alert(`Não tens pontos suficientes para trocar pela bonificação: ${produto.nome}.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('.produto button');
  botoes.forEach((botao, index) => {
    botao.addEventListener('click', () => tentarTrocar(index)); // CORRIGIDO: passa o index certo
  });

  atualizarPontos();
  function confirmarRedirecionamento() {
  const confirmado = confirm("Vais ser redirecionado para o site oficial para trocar os teus pontos. Continuar?");
  if (confirmado) {
    window.location.href = "../WebSite/Pontuacao.html";
  }
}

});

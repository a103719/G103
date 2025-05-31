function mostrarDetalhes() {
    const card = document.getElementById('cartao-detalhes');
    if (card) {
      card.style.display = 'block';
      window.scrollTo({ top: card.offsetTop - 100, behavior: 'smooth' });
    }
  }
  
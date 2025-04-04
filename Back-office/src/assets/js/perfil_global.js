document.addEventListener("DOMContentLoaded", function () {
    const nomeGuardado = localStorage.getItem("nome");
    const imagemGuardada = localStorage.getItem("imagemPerfil");
  
    // Atualizar todos os elementos com classe .perfil-nome
    if (nomeGuardado) {
      const nomeElementos = document.querySelectorAll(".perfil-nome");
      nomeElementos.forEach(el => el.textContent = nomeGuardado);
    }
  
    // Atualizar todos os elementos com classe .perfil-imagem
    if (imagemGuardada) {
      const imagemElementos = document.querySelectorAll(".perfil-imagem");
      imagemElementos.forEach(img => img.src = imagemGuardada);
    }
  });
  
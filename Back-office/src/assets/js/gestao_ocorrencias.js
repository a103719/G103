document.addEventListener("DOMContentLoaded", function () {
    const btnAprovar = document.getElementById("btn-aprovar");
    const btnRecusar = document.getElementById("btn-recusar");
  
    const camposEditaveis = document.querySelectorAll(".campo-editavel");
    const radiosSeguranca = document.querySelectorAll('input[name="seguranca"]');
    const observacoes = document.getElementById("input-observacoes");
    const estadoOcorrencia = document.querySelector(".estado-ocorrencia"); // span ou select com o estado
  
    function desbloquearEdicao() {
      camposEditaveis.forEach(el => el.disabled = false);
      radiosSeguranca.forEach(el => el.disabled = false);
      observacoes.disabled = false;
    }
  
    function bloquearEdicao() {
      camposEditaveis.forEach(el => el.disabled = true);
      radiosSeguranca.forEach(el => el.disabled = true);
      observacoes.disabled = true;
    }
  
    // Verifica se a ocorrência está pendente
    const isPendente = estadoOcorrencia?.textContent?.trim() === "Pendente" ||
                       estadoOcorrencia?.value === "Pendente";
  
    if (isPendente) {
      bloquearEdicao(); // Bloqueia no início apenas se for pendente
  
      btnAprovar.addEventListener("click", function () {
        desbloquearEdicao();
        btnAprovar.style.display = "none";
        btnRecusar.style.display = "none";
      });
  
      btnRecusar.addEventListener("click", function () {
        fecharDetalhes();
        document.getElementById("cartao-detalhes").style.display = "none";
      });
    } else {
      // Se não for pendente, deixa tudo desbloqueado desde início
      desbloquearEdicao();
      btnAprovar.style.display = "none";
      btnRecusar.style.display = "none";
    }
  });
  
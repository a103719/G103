document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("perfilForm");
    const btnEditar = document.getElementById("btnEditar");
    const btnContainer = document.querySelector(".d-flex.gap-3");
    const nomeTopo = document.getElementById("nomeTopo");
    const nomeInput = document.getElementById("nome");
    const fotoInput = document.getElementById("foto");
  
    const imagemPerfil = document.getElementById("fotoPerfil");
    const imagemTopo = document.getElementById("fotoTopo");
  
    const campos = form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input[type='date']");
  
    // Repor dados guardados
    campos.forEach(input => {
      const valor = localStorage.getItem(input.id);
      if (valor) input.value = valor;
    });
  
    const nomeGuardado = localStorage.getItem("nome");
    if (nomeGuardado && nomeTopo) nomeTopo.textContent = nomeGuardado;
  
    const imagemGuardada = localStorage.getItem("imagemPerfil");
    if (imagemGuardada) {
      if (imagemPerfil) imagemPerfil.src = imagemGuardada;
      if (imagemTopo) imagemTopo.src = imagemGuardada;
    }
  
    // 🖼️ Guardar imagem assim que o utilizador selecionar
    fotoInput.addEventListener("change", function () {
      const file = fotoInput.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageData = e.target.result;
          localStorage.setItem("imagemPerfil", imageData);
  
          if (imagemPerfil) imagemPerfil.src = imageData;
          if (imagemTopo) imagemTopo.src = imageData;
        };
        reader.readAsDataURL(file);
      }
    });
  
    btnEditar.addEventListener("click", function () {
      campos.forEach(input => input.disabled = false);
      fotoInput.disabled = false;
  
      if (!document.getElementById("btnGuardar")) {
        const btnGuardar = document.createElement("button");
        btnGuardar.type = "submit";
        btnGuardar.id = "btnGuardar";
        btnGuardar.className = "btn btn-success";
        btnGuardar.innerText = "Guardar Alterações";
        btnContainer.appendChild(btnGuardar);
  
        btnGuardar.addEventListener("click", function (e) {
          e.preventDefault();
  
          campos.forEach(input => {
            localStorage.setItem(input.id, input.value);
            input.disabled = true;
          });
  
          // Atualizar nome no topo
          if (nomeInput && nomeInput.value.trim() !== "") {
            nomeTopo.textContent = nomeInput.value.trim();
          }
  
          fotoInput.disabled = true;
          btnGuardar.remove();
        });
      }
    });
  });
  
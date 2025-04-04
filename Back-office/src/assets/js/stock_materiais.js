// Lista de materiais simulada com stock atual
    const materiais = [
      { id: 1, nome: "Cone de sinalização", stock: 30, unidade: "un" },
      { id: 2, nome: "Semáforo portátil", stock: 5, unidade: "un" },
      { id: 3, nome: "Extintor CO2", stock: 10, unidade: "un" }
    ];
    
    // Preenche o select
    const selectMaterial = document.getElementById("selectMaterial");
    materiais.forEach(mat => {
      const option = document.createElement("option");
      option.value = mat.id;
      option.textContent = `${mat.nome} (Stock: ${mat.stock} ${mat.unidade})`;
      selectMaterial.appendChild(option);
    });
    
    // Atualiza info do stock ao selecionar
    selectMaterial.addEventListener("change", () => {
      const mat = materiais.find(m => m.id == selectMaterial.value);
      document.getElementById("stockDisponivel").textContent = `Stock disponível: ${mat.stock} ${mat.unidade}`;
    });
    
    // Adicionar material à lista
    const listaMateriais = document.getElementById("materiaisSelecionados");
    document.getElementById("adicionarMaterial").addEventListener("click", () => {
      const matId = parseInt(selectMaterial.value);
      const qtd = parseInt(document.getElementById("quantidadeMaterial").value);
      const mat = materiais.find(m => m.id === matId);
    
      if (!mat || isNaN(qtd) || qtd <= 0) return;
    
      if (qtd > mat.stock) {
        alert(`Stock insuficiente! Só existem ${mat.stock} ${mat.unidade}.`);
        return;
      }
    
      mat.stock -= qtd;
      selectMaterial.querySelector(`option[value='${matId}']`).textContent = `${mat.nome} (Stock: ${mat.stock} ${mat.unidade})`;
      document.getElementById("stockDisponivel").textContent = `Stock disponível: ${mat.stock} ${mat.unidade}`;
    
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `${mat.nome} - ${qtd} ${mat.unidade}`;
      listaMateriais.appendChild(li);
    
      document.getElementById("quantidadeMaterial").value = "";
    });
    
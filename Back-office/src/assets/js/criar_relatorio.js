// exportar_estado.js
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('btnExportarJSON')
    ?.addEventListener('click', () => {
      const blob = new Blob(
        [JSON.stringify(EyesStore.read(), null, 2)],
        { type: 'application/json' });

      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'),
        { href:url, download:'eyesEverywhere_backup.json' }).click();
      URL.revokeObjectURL(url);
    });

  const btnImp   = document.getElementById('btnImportarJSON');
  const inputImp = document.getElementById('inputImportJSON');

  btnImp?.addEventListener('click', () => inputImp.click());

  inputImp?.addEventListener('change', async () => {
    const file = inputImp.files[0];
    if (!file) return;

    try {
      const texto = await file.text();
      const json  = JSON.parse(texto);

      /* 1. substitui completamente o estado */
      EyesStore.write(json);

      /* 2. repõe chaves-legado (variáveis antigas) */
      if (typeof EyesStore.restoreLegacyKeys === 'function') {
        EyesStore.restoreLegacyKeys();
      }

      /* 3. avisa e refresca UI */
      alert('Importação concluída! A página será recarregada.');
      location.reload();

    } catch (e) {
      alert('Ficheiro inválido ou JSON mal-formado.');
      console.error(e);
    }
    inputImp.value = '';               // limpa o input
  });
});

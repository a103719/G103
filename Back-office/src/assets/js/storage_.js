
(() => {

  const KEY          = "eyesEverywhereState";
  const LEGACY_KEYS  = [
    "peritos", "ocorrenciasLista", "ocorrenciasSegurancas",
    "ocorrenciasEstados", "listaAuditorias", "auditoriasPendentes",
    "materiaisStock", "historicoOcorrenciasPorEstado",
    "backofficeNotificacoes"
  ];

  /* ------------ Migração inicial (run-once) ---------------- */
  (function migrateOnce() {
    if (localStorage.getItem(KEY)) return;          
    const obj = {};
    LEGACY_KEYS.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) obj[k] = JSON.parse(v);
    });
    if (Object.keys(obj).length) {
      localStorage.setItem(KEY, JSON.stringify(obj));
      LEGACY_KEYS.forEach(k => localStorage.removeItem(k));
      console.info("[EyesStore] Migração concluída.");
    }
  })();

  const EyesStore = {

    KEY,

    read() {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    },

    write(update) {
      const prev = EyesStore.read();
      const next = typeof update === "function"
        ? update(structuredClone(prev))
        : update;

      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("state-updated"));
    },

    onChange(cb) {
      window.addEventListener("storage", e => {
        if (e.key === KEY) cb(JSON.parse(e.newValue || "{}"));
      });
      window.addEventListener("state-updated", () => cb(EyesStore.read()));
    }
  };


  (function legacyBridge() {
    const originalSet = localStorage.setItem;
    localStorage.setItem = function (k, val) {
      originalSet.apply(this, arguments);              

      if (LEGACY_KEYS.includes(k) && k !== KEY) {
        try {
          const current = EyesStore.read();
          current[k] = JSON.parse(val);
          originalSet.call(this, KEY, JSON.stringify(current));
          window.dispatchEvent(new Event("state-updated"));
        } catch {/* ignore */}
      }
    };
  })();

  window.EyesStore = EyesStore;
  function restoreLegacyKeys() {
    const state = EyesStore.read();
    LEGACY_KEYS.forEach(k => {
      if (k === KEY) return;
      if (state[k] !== undefined)
        localStorage.setItem(k, JSON.stringify(state[k]));
      else
        localStorage.removeItem(k);
    });
  }
  
  window.EyesStore = { ...EyesStore, restoreLegacyKeys };
  
})();

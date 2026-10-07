const STORAGE_KEY = "highContrast";
const CLASS_NAME = "high-contrast";

/** Disparado sempre que contraste ou fonte mudam, para sincronizar os botões. */
export const EVENTO_ACESSIBILIDADE = "acessibilidade:atualizada";

export function notificarAcessibilidade(): void {
  window.dispatchEvent(new Event(EVENTO_ACESSIBILIDADE));
}

export function isAltoContrasteAtivo(): boolean {
  return document.documentElement.classList.contains(CLASS_NAME);
}

export function aplicarAltoContraste(ativo: boolean): void {
  document.documentElement.classList.toggle(CLASS_NAME, ativo);
  localStorage.setItem(STORAGE_KEY, ativo ? "enabled" : "disabled");
  notificarAcessibilidade();
}

export function restaurarAltoContraste(): boolean {
  const ativo = localStorage.getItem(STORAGE_KEY) === "enabled";
  document.documentElement.classList.toggle(CLASS_NAME, ativo);
  return ativo;
}

export function toggleAltoContraste(): boolean {
  const ativo = !isAltoContrasteAtivo();
  aplicarAltoContraste(ativo);
  return ativo;
}

import {
  aplicarAltoContraste,
  notificarAcessibilidade,
} from "@/lib/altoContraste";

export {
  EVENTO_ACESSIBILIDADE,
  isAltoContrasteAtivo,
  restaurarAltoContraste,
  toggleAltoContraste,
} from "@/lib/altoContraste";

const FONT_KEY = "a11yFontScale";
const FONT_MIN = 100;
const FONT_MAX = 150;
const FONT_STEP = 10;
const FONT_PADRAO = 100;

export function lerEscalaFonte(): number {
  const bruto = Number(localStorage.getItem(FONT_KEY));
  if (!Number.isFinite(bruto)) return FONT_PADRAO;
  return Math.min(FONT_MAX, Math.max(FONT_MIN, bruto));
}

export function aplicarEscalaFonte(escala: number): number {
  const limitada = Math.min(FONT_MAX, Math.max(FONT_MIN, escala));
  document.documentElement.style.setProperty("--a11y-font-size", `${limitada}%`);
  localStorage.setItem(FONT_KEY, String(limitada));
  notificarAcessibilidade();
  return limitada;
}

export function restaurarFonte(): number {
  const escala = lerEscalaFonte();
  document.documentElement.style.setProperty("--a11y-font-size", `${escala}%`);
  return escala;
}

export function aumentarFonte(): number {
  return aplicarEscalaFonte(lerEscalaFonte() + FONT_STEP);
}

export function diminuirFonte(): number {
  return aplicarEscalaFonte(lerEscalaFonte() - FONT_STEP);
}

export function resetarAcessibilidade(): void {
  aplicarAltoContraste(false);
  aplicarEscalaFonte(FONT_PADRAO);
}

export function podeAumentarFonte(escala = lerEscalaFonte()): boolean {
  return escala < FONT_MAX;
}

export function podeDiminuirFonte(escala = lerEscalaFonte()): boolean {
  return escala > FONT_MIN;
}

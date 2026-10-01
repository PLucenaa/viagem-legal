// Máscaras de campo aplicadas enquanto o usuário digita. Os valores são
// enviados ao backend já formatados (ex.: "000.000.000-00"), que é como
// aparecem na autorização impressa.

export function soDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** 000.000.000-00 */
export function mascaraCpf(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

/** (00) 0000-0000 ou (00) 00000-0000 */
export function mascaraTelefone(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  // Celular tem 9 dígitos depois do DDD; fixo, 8.
  const corte = numero.length > 8 ? 5 : 4;
  return numero.length > corte
    ? `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`
    : `(${ddd}) ${numero}`;
}

/** 00000-000 */
export function mascaraCep(valor: string): string {
  const d = soDigitos(valor).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/** Duas letras maiúsculas (ex.: RR). */
export function mascaraUf(valor: string): string {
  return valor.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
}

/** Só números (ex.: quantidade de dias). */
export function mascaraNumero(valor: string): string {
  return soDigitos(valor);
}

/** VL-AAAA-000000 — o prefixo "VL-" é colocado automaticamente. */
export function mascaraProtocolo(valor: string): string {
  const d = soDigitos(valor).slice(0, 10);
  if (d.length === 0) return "";
  return d.length > 4 ? `VL-${d.slice(0, 4)}-${d.slice(4)}` : `VL-${d}`;
}

/** Valida os dígitos verificadores do CPF. */
export function cpfValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (base: string) => {
    const soma = [...base].reduce(
      (acc, n, i) => acc + Number(n) * (base.length + 1 - i),
      0,
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return (
    digito(d.slice(0, 9)) === Number(d[9]) &&
    digito(d.slice(0, 10)) === Number(d[10])
  );
}

export function telefoneValido(valor: string): boolean {
  const n = soDigitos(valor).length;
  return n === 10 || n === 11;
}

export function cepValido(valor: string): boolean {
  return soDigitos(valor).length === 8;
}

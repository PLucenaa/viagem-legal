// Consulta de CEP via ViaCEP (base dos Correios, API pública sem custo).
// https://viacep.com.br

export interface EnderecoPorCep {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function buscarCep(cep: string): Promise<EnderecoPorCep | null> {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      logradouro: data.logradouro ?? "",
      bairro: data.bairro ?? "",
      localidade: data.localidade ?? "",
      uf: data.uf ?? "",
    };
  } catch {
    return null;
  }
}

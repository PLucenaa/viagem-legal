// Urgência de um pedido pela data da viagem — critério de prioridade da
// fila: quem viaja antes precisa da autorização antes.

export type NivelUrgencia = "passou" | "critica" | "alta" | "normal";

export interface Urgencia {
  nivel: NivelUrgencia;
  /** Ex.: "Viagem amanhã", "Viagem em 5 dias", "Viagem em 12/11". */
  texto: string;
  dias: number;
}

function inicioDoDia(data: Date): number {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate()).getTime();
}

/** @param dataIda yyyy-MM-dd (data local, sem fuso) */
export function urgenciaDaViagem(dataIda: string | null, hoje = new Date()): Urgencia | null {
  if (!dataIda) return null;
  const [ano, mes, dia] = dataIda.split("-").map(Number);
  const viagem = new Date(ano, mes - 1, dia);
  const dias = Math.round((inicioDoDia(viagem) - inicioDoDia(hoje)) / 86_400_000);

  if (dias < 0) return { nivel: "passou", texto: "Data da viagem já passou", dias };
  if (dias === 0) return { nivel: "critica", texto: "Viagem hoje", dias };
  if (dias === 1) return { nivel: "critica", texto: "Viagem amanhã", dias };
  if (dias <= 3) return { nivel: "critica", texto: `Viagem em ${dias} dias`, dias };
  if (dias <= 7) return { nivel: "alta", texto: `Viagem em ${dias} dias`, dias };
  const data = viagem.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return { nivel: "normal", texto: `Viagem em ${data}`, dias };
}

/** "hoje", "ontem", "há 3 dias" — há quanto tempo o pedido chegou. */
export function haQuantoTempo(instante: string, agora = new Date()): string {
  const dias = Math.round((inicioDoDia(agora) - inicioDoDia(new Date(instante))) / 86_400_000);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  return `há ${dias} dias`;
}

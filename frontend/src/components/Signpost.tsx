import { cn } from "@/lib/utils";
import type { CaminhoTriagem } from "@/lib/types";

interface Braco {
  caminho: CaminhoTriagem;
  rotacao: number;
  y: number;
  /** Comprimento do braço (sem a ponta), dimensionado pro texto do ativo. */
  comprimento: number;
  ladoDireito: boolean;
  label: string;
  cor: string;
  fontSize: number;
}

const BRACOS: Braco[] = [
  {
    caminho: "DISPENSA",
    rotacao: -8,
    y: 92,
    comprimento: 186,
    ladoDireito: true,
    label: "Dispensada",
    cor: "var(--color-rio)",
    fontSize: 26,
  },
  {
    caminho: "EXTRAJUDICIAL",
    rotacao: 7,
    y: 170,
    comprimento: 216,
    ladoDireito: false,
    label: "Extrajudicial",
    cor: "var(--color-lavrado)",
    fontSize: 26,
  },
  {
    caminho: "UNIDADE_COMPETENTE",
    rotacao: -5,
    y: 248,
    comprimento: 236,
    ladoDireito: true,
    label: "Unidade competente",
    cor: "var(--color-estrada)",
    fontSize: 22,
  },
];

const POST_X = 262;

interface SignpostProps {
  /** Quando definido, apaga os outros braços e realça só o caminho decidido. */
  ativo?: CaminhoTriagem | null;
  className?: string;
}

export function Signpost({ ativo, className }: SignpostProps) {
  // O braço ativo é desenhado por último, por cima dos outros.
  const ordenados = [...BRACOS].sort(
    (a, b) => Number(a.caminho === ativo) - Number(b.caminho === ativo),
  );
  const rotuloAtivo = BRACOS.find((b) => b.caminho === ativo)?.label;

  return (
    <svg
      viewBox="0 30 540 310"
      className={cn("w-full max-w-sm", className)}
      role="img"
      aria-label={
        rotuloAtivo
          ? `Placa de sinalização apontando para: ${rotuloAtivo}`
          : "Placa de sinalização com os três caminhos possíveis: dispensada, extrajudicial ou unidade competente"
      }
    >
      <defs>
        <filter id="placa-sombra" x="-10%" y="-30%" width="120%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="var(--color-ink)" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* poste */}
      <rect x={POST_X - 9} y="56" width="18" height="266" rx="4" fill="var(--color-ink)" />
      <ellipse cx={POST_X} cy="324" rx="52" ry="10" fill="var(--color-ink)" opacity="0.15" />

      {ordenados.map((b) => {
        const realcado = ativo != null && ativo === b.caminho;
        const apagado = ativo != null && !realcado;
        const largura = realcado ? 44 : 34;
        const ponta = realcado ? 30 : 24;
        const aba = realcado ? 11 : 9;
        const pontaX = b.ladoDireito ? b.comprimento : -b.comprimento;
        const cor = apagado ? "var(--color-tepui)" : b.cor;
        // Texto escuro sobre o dourado (contraste); claro sobre os demais.
        const corTexto =
          !apagado && b.caminho === "EXTRAJUDICIAL"
            ? "var(--color-ink)"
            : "var(--color-paper)";
        return (
          <g
            key={b.caminho}
            transform={`translate(${POST_X} ${b.y}) rotate(${b.rotacao})`}
            opacity={apagado ? 0.2 : 1}
          >
            <g
              className={cn(realcado && "placa-balanca")}
              style={{ transformOrigin: b.ladoDireito ? "0% 50%" : "100% 50%" }}
              filter={realcado ? "url(#placa-sombra)" : undefined}
            >
              <rect
                x={b.ladoDireito ? 0 : -b.comprimento}
                y={-largura / 2}
                width={b.comprimento}
                height={largura}
                rx="6"
                fill={cor}
              />
              <polygon
                points={
                  b.ladoDireito
                    ? `${pontaX},${-largura / 2 - aba} ${pontaX + ponta},0 ${pontaX},${largura / 2 + aba}`
                    : `${pontaX},${-largura / 2 - aba} ${pontaX - ponta},0 ${pontaX},${largura / 2 + aba}`
                }
                fill={cor}
              />
              <text
                x={b.ladoDireito ? 16 : -16}
                y="0"
                dominantBaseline="central"
                textAnchor={b.ladoDireito ? "start" : "end"}
                fontSize={realcado ? b.fontSize : b.fontSize - 4}
                fontWeight="700"
                fill={corTexto}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {b.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

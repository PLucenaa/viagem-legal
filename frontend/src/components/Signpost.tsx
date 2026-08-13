import { cn } from "@/lib/utils";
import type { CaminhoTriagem } from "@/lib/types";

interface Braco {
  caminho: CaminhoTriagem;
  rotacao: number;
  y: number;
  comprimento: number;
  ladoDireito: boolean;
  label: string;
  cor: string;
  fontSize?: number;
}

const BRACOS: Braco[] = [
  {
    caminho: "DISPENSA",
    rotacao: -9,
    y: 96,
    comprimento: 158,
    ladoDireito: true,
    label: "Dispensada",
    cor: "var(--color-rio)",
  },
  {
    caminho: "EXTRAJUDICIAL",
    rotacao: 7,
    y: 168,
    comprimento: 172,
    ladoDireito: false,
    label: "Extrajudicial",
    cor: "var(--color-lavrado)",
  },
  {
    caminho: "UNIDADE_COMPETENTE",
    rotacao: -5,
    y: 244,
    comprimento: 190,
    ladoDireito: true,
    label: "Unidade competente",
    cor: "var(--color-estrada)",
    fontSize: 14.5,
  },
];

const POST_X = 230;

interface SignpostProps {
  /** Quando definido, apaga os outros braços e realça só o caminho decidido. */
  ativo?: CaminhoTriagem | null;
  className?: string;
}

export function Signpost({ ativo, className }: SignpostProps) {
  return (
    <svg
      viewBox="0 0 460 340"
      className={cn("w-full max-w-sm", className)}
      role="img"
      aria-label="Placa de sinalização com os três caminhos possíveis: dispensada, extrajudicial ou unidade competente"
    >
      {/* poste */}
      <rect x={POST_X - 8} y="70" width="16" height="250" rx="4" fill="var(--color-ink)" />
      <ellipse cx={POST_X} cy="322" rx="46" ry="9" fill="var(--color-ink)" opacity="0.15" />

      {BRACOS.map((b) => {
        const apagado = ativo != null && ativo !== b.caminho;
        const largura = 32;
        const pontaX = b.ladoDireito ? b.comprimento : -b.comprimento;
        return (
          <g
            key={b.caminho}
            transform={`translate(${POST_X} ${b.y}) rotate(${b.rotacao})`}
            opacity={apagado ? 0.28 : 1}
            style={{ transition: "opacity 0.4s ease" }}
          >
            <rect
              x={b.ladoDireito ? 0 : -b.comprimento}
              y={-largura / 2}
              width={b.comprimento}
              height={largura}
              rx="6"
              fill={apagado ? "var(--color-tepui)" : b.cor}
            />
            <polygon
              points={
                b.ladoDireito
                  ? `${pontaX},${-largura / 2 - 10} ${pontaX + 26},0 ${pontaX},${largura / 2 + 10}`
                  : `${pontaX},${-largura / 2 - 10} ${pontaX - 26},0 ${pontaX},${largura / 2 + 10}`
              }
              fill={apagado ? "var(--color-tepui)" : b.cor}
            />
            <text
              x={b.ladoDireito ? 14 : -14}
              y="6"
              textAnchor={b.ladoDireito ? "start" : "end"}
              fontFamily="var(--font-mono)"
              fontSize={b.fontSize ?? 17}
              fontWeight="600"
              letterSpacing="0.02em"
              fill="var(--color-paper)"
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

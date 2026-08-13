import { useEffect, useRef } from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

interface CriancaPapagaioProps {
  className?: string;
}

const PELE = "#C98A56";

/**
 * Criança soltando papagaio (pipa) — ilustração flat colorida (sem rosto
 * detalhado, só o suficiente pra ler como criança), papagaio na paleta
 * da marca. O papagaio balança sozinho, como se o vento estivesse soprando.
 */
export function CriancaPapagaio({ className }: CriancaPapagaioProps) {
  const papagaio = useRef<SVGGElement>(null);
  const linha = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!papagaio.current || !linha.current) return;
    const reduzMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduzMovimento) return;

    // Papagaio e linha balançam juntos (mesma duração/fase) — a linha gira
    // bem menos e a partir da mão, senão parece "descolar" do papagaio.
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.8, ease: "sine.inOut" } });
    tl.fromTo(papagaio.current, { rotation: -6 }, { rotation: 6, transformOrigin: "50% 40%" }, 0);
    tl.fromTo(linha.current, { rotation: -3 }, { rotation: 3, transformOrigin: "0% 100%" }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg
      viewBox="0 0 320 340"
      className={cn("w-full max-w-sm", className)}
      role="img"
      aria-label="Criança soltando papagaio"
    >
      {/* nuvens/vento */}
      <path
        d="M20,70 q18,-10 36,0 q14,-8 26,2"
        stroke="var(--color-tepui)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M230,40 q16,-8 32,0"
        stroke="var(--color-tepui)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* linha do papagaio até a mão — gira em fase com o papagaio,
          a partir da mão, pra parecer presa no meio dele */}
      <g ref={linha}>
        <path
          d="M228,66 C 216,120 210,160 200,196"
          stroke="var(--color-ink)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </g>

      {/* papagaio (pipa) — grupo externo só posiciona/inclina (fixo);
          grupo interno é o que o GSAP gira, sem disputar o transform.
          rotate(-32) deixa a pipa na diagonal com a rabiola pra direita. */}
      <g transform="translate(228 60) rotate(-32)">
        <g ref={papagaio}>
          <polygon points="0,-38 30,0 0,38 -30,0" fill="var(--color-lavrado)" />
          <polygon points="0,-38 30,0 0,0 0,-2" fill="var(--color-rio)" />
          <polygon points="0,38 -30,0 0,0" fill="var(--color-estrada)" />
          <polygon points="0,-38 0,38" stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.4" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="var(--color-ink)" strokeWidth="1.5" opacity="0.4" />
          {/* rabiola */}
          <path
            d="M0,38 C -6,60 6,74 -4,92 C -12,108 4,116 -6,132"
            stroke="var(--color-ink)"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <polygon points="-3,58 5,58 1,66" fill="var(--color-rio)" />
          <polygon points="-9,90 -1,90 -5,98" fill="var(--color-estrada)" />
          <polygon points="-11,112 -3,112 -7,120" fill="var(--color-tepui)" />
        </g>
      </g>

      {/* sombra no chão */}
      <ellipse cx="152" cy="332" rx="46" ry="6" fill="var(--color-ink)" opacity="0.1" />

      {/* criança, de perfil, olhando pro papagaio */}
      {/* braço de apoio, relaxado */}
      <path
        d="M140,248 C 132,258 126,266 124,278"
        stroke={PELE}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* pernas */}
      <path
        d="M146,296 L140,330"
        stroke={PELE}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M164,296 L170,330"
        stroke={PELE}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      {/* tênis */}
      <path d="M128,330 L146,330 L146,338 L124,338 Q124,331 128,330 Z" fill="var(--color-ink)" />
      <path d="M164,330 L182,330 Q186,331 186,338 L164,338 Z" fill="var(--color-ink)" />

      {/* bermuda */}
      <rect x="134" y="278" width="42" height="24" rx="9" fill="var(--color-lavrado)" />

      {/* camiseta */}
      <rect x="132" y="238" width="46" height="44" rx="13" fill="var(--color-rio)" />

      {/* braço erguido segurando a linha */}
      <path
        d="M170,246 C 182,232 190,216 198,198"
        stroke={PELE}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="200" cy="195" r="6" fill={PELE} />

      {/* pescoço + cabeça */}
      <rect x="146" y="222" width="14" height="16" rx="5" fill={PELE} />
      <circle cx="153" cy="212" r="18" fill={PELE} />

      {/* cabelo */}
      <path
        d="M135,210
           C133,190 148,178 164,182
           C176,185 180,198 176,210
           C172,200 162,194 152,196
           C144,198 138,203 135,210 Z"
        fill="var(--color-ink)"
      />
    </svg>
  );
}

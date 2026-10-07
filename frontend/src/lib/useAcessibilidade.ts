import { useEffect, useState } from "react";
import {
  EVENTO_ACESSIBILIDADE,
  aumentarFonte,
  diminuirFonte,
  isAltoContrasteAtivo,
  lerEscalaFonte,
  podeAumentarFonte,
  podeDiminuirFonte,
  resetarAcessibilidade,
  restaurarFonte,
  restaurarAltoContraste,
  toggleAltoContraste,
} from "@/lib/acessibilidade";

export function useAcessibilidade() {
  const [contraste, setContraste] = useState(false);
  const [fonte, setFonte] = useState(100);

  useEffect(() => {
    restaurarAltoContraste();
    restaurarFonte();
    const sincronizar = () => {
      setContraste(isAltoContrasteAtivo());
      setFonte(lerEscalaFonte());
    };
    sincronizar();
    window.addEventListener(EVENTO_ACESSIBILIDADE, sincronizar);
    return () => window.removeEventListener(EVENTO_ACESSIBILIDADE, sincronizar);
  }, []);

  return {
    contraste,
    fonte,
    podeAumentar: podeAumentarFonte(fonte),
    podeDiminuir: podeDiminuirFonte(fonte),
    toggleContraste: toggleAltoContraste,
    aumentarFonte,
    diminuirFonte,
    resetar: resetarAcessibilidade,
  };
}

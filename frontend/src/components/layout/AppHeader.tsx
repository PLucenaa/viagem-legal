import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoTjrr from "@/assets/logo_tjrr_white.png";
import { HEADER } from "@/lib/header";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 overflow-hidden bg-ink print:hidden">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:min-h-20 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 flex-1 items-center gap-3"
          onClick={() => setMenuAberto(false)}
        >
          {/* A logo original tem o símbolo em cima e o texto "Poder Judiciário"
              embaixo, ambos ocupando a largura toda — por isso o recorte é
              largo e baixo (não quadrado), só pra mostrar o símbolo. */}
          <span className="flex h-10 w-[5.75rem] shrink-0 items-start justify-center overflow-hidden sm:h-11 sm:w-24">
            <img
              src={logoTjrr}
              alt=""
              aria-hidden
              className="h-auto w-full shrink-0 object-cover object-top"
            />
          </span>

          {/* Abaixo de sm não cabe o título completo em uma linha — usa a
              marca curta pra não quebrar e estourar a altura do header. */}
          <span className="min-w-0 truncate text-[13px] font-semibold tracking-[0.06em] text-paper uppercase lg:hidden">
            {HEADER.marcaCurta}
          </span>
          <span className="hidden min-w-0 text-left leading-tight lg:block">
            <span className="block truncate text-xs font-semibold tracking-[0.06em] text-paper uppercase">
              {HEADER.marcaLinha1}
            </span>
            <span className="mt-0.5 block truncate text-[11px] tracking-[0.03em] text-paper/55 uppercase">
              {HEADER.marcaLinha2}
            </span>
          </span>
          <span className="sr-only">{HEADER.logoAlt}</span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Principal"
        >
          {HEADER.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-paper/80 uppercase transition hover:bg-paper/10 hover:text-paper",
                  isActive && "bg-lavrado text-ink hover:bg-lavrado",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-paper transition hover:bg-paper/10 lg:hidden"
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((v) => !v)}
        >
          {menuAberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuAberto && (
        <nav
          id="menu-mobile"
          className="border-t border-paper/15 px-4 py-3 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {HEADER.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-2.5 text-xs font-medium tracking-wide text-paper/80 uppercase hover:bg-paper/10",
                      isActive && "bg-lavrado text-ink",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
